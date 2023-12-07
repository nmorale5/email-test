import { ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";
import { NotFoundError } from "./errors";

export interface SolutionStateDoc extends BaseDoc {
  response: ObjectId;
  trending: boolean;
  success: boolean;
}

export interface FeedbackDoc extends BaseDoc {
  user: ObjectId;
  response: ObjectId;
  feedback: string;
  rating: number;
  decision: boolean; // binary decision on whether solution met demands
}

export default class FeedbackConcept {
  public readonly states = new DocCollection<SolutionStateDoc>("solution-states");
  public readonly feedback = new DocCollection<FeedbackDoc>("feedback");

  async getFeedbackState(response: ObjectId) {
    const doc = await this.states.readOne({ response })
    if (doc === null) {
      throw new NotFoundError("Response not found!")
    }
    return doc
  }

  async enterFeedbackState(response: ObjectId) {
    if (await this.states.readOne({response}) !== null) {
      throw new Error("Response already entered FeedbackState!")
    }
    
    const _id = await this.states.createOne({response, trending: true, success: false})
    return { msg: "Successfully entered trending solution state!"}
  }

  async updateFeedbackState(response: ObjectId, success?: boolean, trending?: boolean) {
    await this.getFeedbackState(response)

    if (success !== undefined) {
      await this.states.updateOne({response}, { success })
    }

    if (trending !== undefined) {
      await this.states.updateOne({response}, { trending })
    }

    return { msg: "Feedback success state succesfully updated!"}
  }

  async createFeedback(user: ObjectId, response: ObjectId, feedback: string, rating: number, decision: boolean) {
    // perform input error checking
    const _id = await this.feedback.createOne({user, response, feedback, rating, decision});
    return { msg: "Feedback successfully created!" }
  }

  async getOneUserFeedback(user: ObjectId, response: ObjectId) {
    await this.getFeedbackState(response)
    const doc = await this.feedback.readOne({ user, response })

    if (doc === null) {
      throw new NotFoundError("User's feedback not found!")
    }
    return doc
  }

  async deleteUserFeedback(user: ObjectId, response: ObjectId) {
    const doc = await this.feedback.readOne({ user, response })

    if (doc === null) {
      throw new NotFoundError("User's feedback not found!")
    }

    await this.feedback.deleteOne({ user, response })
  }

  async getAllFeedback(response: ObjectId) {
    await this.getFeedbackState(response)
    const responses = this.feedback.readMany({ response })
    return responses
  }

  async getYesRatio(response: ObjectId) {
    const responses = await this.getAllFeedback(response);

    if (responses.length === 0) {
      return 0
    }

    var count = 0
    for (const r of responses) {
      if (r.decision) {
        count += 1
      }
    }
    return count / responses.length
  }
}
