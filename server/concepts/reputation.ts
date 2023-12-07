import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";

export interface ReputationDoc extends BaseDoc {
  entity: ObjectId;
  value: number;
}

export default class ReputationConcept {
  public readonly reputations = new DocCollection<ReputationDoc>("reputations");

  public async updateReputation(entity: ObjectId, value: number) {
    const reputation = await this.reputations.readOne({ entity });
    if (reputation) {
      await this.reputations.updateOne({ _id: reputation._id }, { value: reputation.value + value });
      return { msg: "Reputation successfully updated!", post: await this.reputations.readOne({ _id: reputation._id }) };
    }
    const _id = await this.reputations.createOne({ entity, value });
    return { msg: "Reputation successfully added!", post: await this.reputations.readOne({ _id }) };
  }

  public async getEntityReputation(entity: ObjectId) {
    return (await this.reputations.readOne({ entity }))?.value ?? 0;
  }
}
