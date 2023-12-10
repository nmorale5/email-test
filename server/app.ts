import BadgeConcept from "./concepts/badge";
import BusinessConcept from "./concepts/business";
import EmailerTool from "./concepts/emailer";
import FeedbackConcept from "./concepts/feedback";
import FriendConcept from "./concepts/friend";
import PetitionConcept from "./concepts/petition";
import PostConcept from "./concepts/post";
import ReputationConcept from "./concepts/reputation";
import ResponseConcept from "./concepts/response";
import UpvoteConcept from "./concepts/upvote";
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
export const Upvote = new UpvoteConcept();
export const Badge = new BadgeConcept();
export const Reputation = new ReputationConcept();
export const Feedback = new FeedbackConcept();
export const Response = new ResponseConcept();
// Constants
export const MINIMUM_RATING = 4;
export const AWARD_THRESHOLD = 1;
/* Number of feedback reviews before evaluation
Will break createFeedback evaluation if set to 0*/
