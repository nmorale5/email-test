import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { BadValuesError, UnauthenticatedError } from "./errors";

const TOKEN_LENGTH = 12;

export interface BusinessDoc extends BaseDoc {
  name: string;
  email: string;
  token: string;
  users: Array<ObjectId>;
}

export default class BusinessConcept {
  public readonly businesses = new DocCollection<BusinessDoc>("businesses");

  public async getBusiness(businessId: ObjectId) {
    const business = await this.businesses.readOne({ _id: businessId });
    if (business === null) {
      console.log(businessId);
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
    const business = await this.businesses.readOne({ name });
    if (business !== null) {
      throw new BadValuesError(`business already exists with name ${name}.`);
    }
    // TODO: make sure email follows regex pattern: *@*.*
    const token = generateToken();
    const newBusiness = await this.businesses.createOne({ name, email, token, users: [] });
    return { token: token, id: newBusiness };
  }

  public async deleteBusiness() {
    await this.businesses.deleteOne({});
    return { msg: "Post deleted successfully!" };
  }

  public async addUser(userId: ObjectId, token: string) {
    const business = await this.businesses.readOne({ token });
    if (business === null) {
      throw new UnauthenticatedError("validation token is incorrect");
    }
    const userArray = business.users;
    if (!userArray.includes(userId)) {
      userArray.push(userId);
      return this.businesses.updateOne({ _id: business._id }, { users: userArray });
    }
    throw new Error("You've already been added to this restaurant!");
  }

  public async removeUser(userId: ObjectId, token: string) {
    const business = await this.businesses.readOne({ token });
    if (business === null) {
      throw new UnauthenticatedError("validation token is incorrect");
    }
    const userArray = business.users;
    const index = userArray.indexOf(userId);
    if (index > -1) {
      userArray.splice(index, 1);
      return this.businesses.updateOne({ _id: business._id }, { users: userArray });
    }
    throw new Error("user did not have access to begin with");
  }
}

function generateToken(): string {
  // function courtesy of ChatGPT
  let result = "";
  for (let i = 0; i < TOKEN_LENGTH; i++) {
    const randomCharCode = Math.floor(Math.random() * 62) + 48;
    if (randomCharCode <= 57) {
      result += String.fromCharCode(randomCharCode); // Numbers 0-9
    } else if (randomCharCode <= 83) {
      result += String.fromCharCode(randomCharCode + 7); // Uppercase letters A-Z
    } else {
      result += String.fromCharCode(randomCharCode + 13); // Lowercase letters a-z
    }
  }
  return result;
}
