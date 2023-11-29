import { ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";


export interface PetitionDoc extends BaseDoc {
  title: string;
  problem: string;
  solution: string;
  target: ObjectId;
  creator: ObjectId;
  upvoteThreshold: number;
	signers: Set<ObjectId>;
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

	// Get all petitions, optionally get petitions pertaining to a creator/target
	public async getAllPetitions(target?: ObjectId, creator?: ObjectId) {
		
	}

	public async filterPetitions() {

	}
}