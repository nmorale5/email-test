import { ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";

export interface PetitionDoc extends BaseDoc {
  title: string;
  problem: string;
  solution: string;
  topic: string;
  target: ObjectId;
  creator: ObjectId;
  upvoteThreshold: number;
}

export default class PetitionConcept {
  public readonly petitions = new DocCollection<PetitionDoc>("petitions");

  public async createPetition(title: string, problem: string, solution: string, topic: string, target: ObjectId, creator: ObjectId, upvoteThreshold: number) {
    const _id = await this.petitions.createOne({ title, problem, solution, target, creator, upvoteThreshold, topic });
    return { msg: "Petition successfully created!", post: await this.petitions.readOne({ _id }) };
  }

  public async getPetition(_id: ObjectId): Promise<PetitionDoc> {
    const petition = await this.petitions.readOne({ _id });
    if (!petition) throw new Error("This petition cannot be found");
    return petition;
  }

  public async deletePetition(_id: ObjectId) {
    await this.petitions.deleteOne({ _id });
    return { msg: "Petition deleted successfully!" };
  }

  // Get all petitions, optionally get petitions pertaining to a creator/target
  public async getAllPetitions(target?: ObjectId, creator?: ObjectId): Promise<Array<PetitionDoc>> {
    return (await this.petitions.readMany({ target, creator })) ?? [];
  }

  public async filterPetitions(words: Array<string>) {
    const filteredPetitions: Array<PetitionDoc> = [];
    for (const word of words) {
      (
        await this.petitions.readMany(
          { title: { $regex: new RegExp(`${word}`, "i") } },
          {
            sort: { dateUpdated: -1 },
          },
        )
      ).map((petition) => {
        if (!filteredPetitions.map((p) => p._id.toString()).includes(petition._id.toString())) filteredPetitions.push(petition);
      });
    }
    return filteredPetitions;
  }
}
