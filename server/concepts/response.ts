import { ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";

export enum RESPONSE_TYPE {
  REJECTED,
  ACCEPTED,
}

export interface ResponseDoc extends BaseDoc {
  concern: ObjectId;
  response: string;
  date: number;
  type: RESPONSE_TYPE;
}

export default class ResponseConcept {
  public readonly responses = new DocCollection<ResponseDoc>("responses");

  public async createResponse(concern: ObjectId, response: string, type: RESPONSE_TYPE) {
    const date = Date.now();
    const _id = await this.responses.createOne({ concern, response, date, type });
    return { msg: "Response successfully created!", post: await this.responses.readOne({ _id }) };
  }

  public async getResponse(_id: ObjectId): Promise<ResponseDoc> {
    const response = await this.responses.readOne({ _id });
    if (!response) throw new Error("This response cannot be found");
    return response;
  }

  public async getResponseByConcern(concern: ObjectId): Promise<ResponseDoc> {
    const response = await this.responses.readOne({ concern });
    if (!response) throw new Error("No response with concern provided");
    return response;
  }

  public async hasResponse(concern: ObjectId): Promise<Boolean> {
    const response = await this.responses.readOne({ concern });
    // typecasting to bool using !!
    return !!response;
  }

  public async deleteResponse(_id: ObjectId) {
    await this.responses.deleteOne({ _id });
    return { msg: "Response deleted" };
  }

  // Get all responses by a restaurant needs to be a sync
}
