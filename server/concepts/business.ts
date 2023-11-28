import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { BadValuesError, UnauthenticatedError } from "./errors";

const TOKEN_LENGTH = 12;

export interface BusinessDoc extends BaseDoc {
  name: string;
  email: string;
  token: string;
  users: Set<ObjectId>;
}

export default class BusinessConcept {
  public readonly businesses = new DocCollection<BusinessDoc>("businesses");

  public async getBusiness(businessId: ObjectId) {
    const business = await this.businesses.readOne({ _id: businessId });
    if (business === null) {
      throw new BadValuesError("businessId is invalid");
    }
    return business;
  }

  public async getAllBusinesses(filterKeyword?: string) {
    const businessList = (await this.businesses.readMany({})).map((b) => {
      // eslint-disable-next-line unused-imports/no-unused-vars, @typescript-eslint/no-unused-vars
      const { token, ...rest } = b; // remove validation token before passing to frontend
      return rest;
    });
    if (filterKeyword === undefined || filterKeyword === "") {
      return businessList;
    }
    return businessList.filter((b) => b.name.includes(filterKeyword));
  }

  public async addBusiness(name: string, email: string) {
    // TODO: make sure name isn't already in db
    // TODO: make sure email follows regex pattern: *@*.*
    const token = generateToken();
    await this.businesses.createOne({ name, email, token, users: new Set() });
    return token;
  }

  public async addUser(businessId: ObjectId, userId: ObjectId, token: string) {
    const business = await this.getBusiness(businessId);
    if (business.token !== token) {
      throw new UnauthenticatedError("validation token is incorrect");
    }
    return this.businesses.updateOne({ _id: businessId }, { users: business.users.add(userId) });
  }
}

function generateToken(): string {
  // function courtesy of ChatGPT
  let result = "";
  for (let i = 0; i < TOKEN_LENGTH; i++) {
    const randomCharCode = Math.floor(Math.random() * 62) + 48;
    if (randomCharCode <= 57) {
      result += String.fromCharCode(randomCharCode); // Numbers 0-9
    } else if (randomCharCode <= 90) {
      result += String.fromCharCode(randomCharCode); // Uppercase letters A-Z
    } else {
      result += String.fromCharCode(randomCharCode + 6); // Lowercase letters a-z
    }
  }
  return result;
}
