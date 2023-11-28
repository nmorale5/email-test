import { ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";


export interface PetitionDoc extends BaseDoc {
  title: string;
  problem: string;
  solution: string;
  target: ObjectId;
  creator: ObjectId;
  upvoteThreshold: number;
}

export default class PetitionConcept {
  public readonly petitions = new DocCollection<PetitionDoc>("petitions");

  public async createPetition(
		title: string,
		problem: string,
		solution: string,
		target: ObjectId,
		creator: ObjectId,
		upvoteThreshold: number,
	) {

	}

	public async deletePetition(
		petitionId: ObjectId
	) {

	}

	public async getAllPetitions() {

	}

	public async filterPetitions() {

	}
}