import BusinessConcept from "./concepts/business";
import EmailerTool from "./concepts/emailer";
import FriendConcept from "./concepts/friend";
import PetitionConcept from "./concepts/petition";
import PostConcept from "./concepts/post";
import UserConcept from "./concepts/user";
import WebSessionConcept from "./concepts/websession";

// App Definition using concepts
export const WebSession = new WebSessionConcept();
export const User = new UserConcept();
export const Post = new PostConcept();
export const Friend = new FriendConcept();
export const Business = new BusinessConcept();
export const Emailer = new EmailerTool();
export const Petition = new PetitionConcept();