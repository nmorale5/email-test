import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { containsObjectId, withObjectId, withoutObjectId } from "../framework/utils";
import { NotAllowedError } from "./errors";

export interface UpvoteDoc extends BaseDoc {
  postId: ObjectId;
  userIds: Array<ObjectId>;
}

export default class UpvoteConcept {
  public readonly upvotes = new DocCollection<UpvoteDoc>("upvotes");

  public async addUpvote(postId: ObjectId, userId: ObjectId) {
    const upvotesOnThisPost = await this.upvotes.readOne({ postId });
    if (upvotesOnThisPost === null) {
      await this.upvotes.createOne({ postId, userIds: [userId] });
      return;
    }
    if (containsObjectId(upvotesOnThisPost.userIds, userId)) {
      throw new NotAllowedError("This user has already upvoted this post!");
    }
    await this.upvotes.updateOne({ postId }, { userIds: withObjectId(upvotesOnThisPost.userIds, userId) });
  }

  public async removeUpvote(postId: ObjectId, userId: ObjectId) {
    const upvotesOnThisPost = await this.upvotes.readOne({ postId });
    if (upvotesOnThisPost === null || !containsObjectId(upvotesOnThisPost.userIds, userId)) {
      throw new NotAllowedError("This post has not been upvoted by this user!");
    }
    await this.upvotes.updateOne({ postId }, { userIds: withoutObjectId(upvotesOnThisPost.userIds, userId) });
  }

  public async isUpvoting(postId: ObjectId, userId: ObjectId) {
    const upvotesOnThisPost = await this.upvotes.readOne({ postId });
    return upvotesOnThisPost !== null && containsObjectId(upvotesOnThisPost.userIds, new ObjectId(userId));
  }

  public async getUpvotes(postId: ObjectId) {
    const upvotesOnThisPost = await this.upvotes.readOne({ postId });
    return upvotesOnThisPost ? upvotesOnThisPost.userIds : new Array<ObjectId>();
  }
}
