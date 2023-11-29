import { ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";

export interface UpvoteDoc extends BaseDoc {
  user: ObjectId;
  post: ObjectId;
}

export default class UpvoteConcept {
  public readonly petitions = new DocCollection<UpvoteDoc>("upvotes");

  public async addUpvote(user: ObjectId, post: ObjectId) {}
  public async removeUpvote(user: ObjectId, post: ObjectId) {}
  public async getTotalUpvotes(post: ObjectId) {
    return 0;
  }
}
