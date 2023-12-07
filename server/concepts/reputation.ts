import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";

export interface ReputationDoc extends BaseDoc {
  entity: ObjectId;
  value: number;
}

export default class ReputationConcept {
  public readonly reputations = new DocCollection<ReputationDoc>("reputations");

  public async addReputation(entity: ObjectId, value: number) {
    const _id = await this.reputations.createOne({ entity, value });
    return { msg: "Reputation successfully added!", post: await this.reputations.readOne({ _id }) };
  }

  public async getEntityReputation(entity: ObjectId) {
    const entityReputations = await this.reputations.readMany({ entity });
    return entityReputations.map((reputation) => reputation.value).reduce((sumVal, newVal) => sumVal + newVal, 0);
  }
}
