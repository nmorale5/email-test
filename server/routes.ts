import { ObjectId } from "mongodb";

import { Router, getExpressRouter } from "./framework/router";

import { Business, Emailer, Friend, Post, User, WebSession } from "./app";
import { UnauthenticatedError } from "./concepts/errors";
import { PostDoc, PostOptions } from "./concepts/post";
import { UserDoc } from "./concepts/user";
import { WebSessionDoc } from "./concepts/websession";
import Responses from "./responses";

class Routes {
  @Router.get("/session")
  async getSessionUser(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await User.getUserById(user);
  }

  @Router.get("/users")
  async getUsers() {
    return await User.getUsers();
  }

  @Router.get("/users/:username")
  async getUser(username: string) {
    return await User.getUserByUsername(username);
  }

  @Router.post("/users")
  async createUser(session: WebSessionDoc, username: string, password: string) {
    WebSession.isLoggedOut(session);
    return await User.create(username, password);
  }

  @Router.patch("/users")
  async updateUser(session: WebSessionDoc, update: Partial<UserDoc>) {
    const user = WebSession.getUser(session);
    return await User.update(user, update);
  }

  @Router.delete("/users")
  async deleteUser(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    WebSession.end(session);
    return await User.delete(user);
  }

  @Router.post("/login")
  async logIn(session: WebSessionDoc, username: string, password: string) {
    const u = await User.authenticate(username, password);
    WebSession.start(session, u._id);
    return { msg: "Logged in!" };
  }

  @Router.post("/logout")
  async logOut(session: WebSessionDoc) {
    WebSession.end(session);
    return { msg: "Logged out!" };
  }

  @Router.get("/posts")
  async getPosts(author?: string) {
    let posts;
    if (author) {
      const id = (await User.getUserByUsername(author))._id;
      posts = await Post.getByAuthor(id);
    } else {
      posts = await Post.getPosts({});
    }
    return Responses.posts(posts);
  }

  @Router.post("/posts")
  async createPost(session: WebSessionDoc, content: string, options?: PostOptions) {
    const user = WebSession.getUser(session);
    const created = await Post.create(user, content, options);
    return { msg: created.msg, post: await Responses.post(created.post) };
  }

  @Router.patch("/posts/:_id")
  async updatePost(session: WebSessionDoc, _id: ObjectId, update: Partial<PostDoc>) {
    const user = WebSession.getUser(session);
    await Post.isAuthor(user, _id);
    return await Post.update(_id, update);
  }

  @Router.delete("/posts/:_id")
  async deletePost(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    await Post.isAuthor(user, _id);
    return Post.delete(_id);
  }

  @Router.get("/friends")
  async getFriends(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await User.idsToUsernames(await Friend.getFriends(user));
  }

  @Router.delete("/friends/:friend")
  async removeFriend(session: WebSessionDoc, friend: string) {
    const user = WebSession.getUser(session);
    const friendId = (await User.getUserByUsername(friend))._id;
    return await Friend.removeFriend(user, friendId);
  }

  @Router.get("/friend/requests")
  async getRequests(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await Responses.friendRequests(await Friend.getRequests(user));
  }

  @Router.post("/friend/requests/:to")
  async sendFriendRequest(session: WebSessionDoc, to: string) {
    const user = WebSession.getUser(session);
    const toId = (await User.getUserByUsername(to))._id;
    return await Friend.sendRequest(user, toId);
  }

  @Router.delete("/friend/requests/:to")
  async removeFriendRequest(session: WebSessionDoc, to: string) {
    const user = WebSession.getUser(session);
    const toId = (await User.getUserByUsername(to))._id;
    return await Friend.removeRequest(user, toId);
  }

  @Router.put("/friend/accept/:from")
  async acceptFriendRequest(session: WebSessionDoc, from: string) {
    const user = WebSession.getUser(session);
    const fromId = (await User.getUserByUsername(from))._id;
    return await Friend.acceptRequest(fromId, user);
  }

  @Router.put("/friend/reject/:from")
  async rejectFriendRequest(session: WebSessionDoc, from: string) {
    const user = WebSession.getUser(session);
    const fromId = (await User.getUserByUsername(from))._id;
    return await Friend.rejectRequest(fromId, user);
  }

  @Router.get("/email/testRegister")
  async sendTestEmail() {
    await Emailer.sendRegisterEmail({
      toAddress: "61040-team-mank@mit.edu",
      businessName: "McDonald's",
      token: "SOMETOKEN",
    });
  }

  @Router.get("/email/testThreshold")
  async sendEmail() {
    await Emailer.sendThresholdEmail({
      toAddress: "61040-team-mank@mit.edu",
      businessName: "McDonald's",
      token: "SOMETOKEN",
      signers: 100,
      petition: {
        title: "Gluten Free Buns At McDonald's",
        problem: "Not enough gluten-free options for McDonald's",
        solution: "Make gluten-free buns",
      },
    });
  }

  @Router.put("/business")
  async addBusiness(name: string, email: string) {
    const verificationToken = await Business.addBusiness(name, email);
    await Emailer.sendRegisterEmail({
      toAddress: email,
      businessName: name,
      token: verificationToken,
    });
  }

  @Router.put("/business/users")
  async addUserToBusiness(businessId: ObjectId, userId: ObjectId, token: string) {
    return await Business.addUser(businessId, userId, token);
  }

  // todo: for kevin and mohamed
  @Router.put("/petition/:petitionId/:signerId")
  async signPetition(session: WebSessionDoc, petitionId: ObjectId, signerId: ObjectId) {
    if (!WebSession.getUser(session).equals(signerId)) {
      throw new UnauthenticatedError("signerId is different from session user id");
    }
    // todo: Petition.addSigner(petitionId, signerId);
    // todo: const p = Petition.getPetition(petitionId);
    // todo: const b = Business.getBusiness(p.business);
    const signers = 100; // todo: p.signers.length
    const threshold = 100; // todo: p.threshold
    if (signers === threshold) {
      // todo: get all email data fields from petition concept
      await Emailer.sendThresholdEmail({
        toAddress: "61040-team-mank@mit.edu", // todo: b.email
        businessName: "McDonald's", // todo: b.name
        token: "SOMETOKEN", // todo: b.token
        signers: 100, // todo: p.signers.length
        petition: {
          title: "Gluten Free Buns At McDonald's", // todo: p.title
          problem: "Not enough gluten-free options for McDonald's", // todo: p.problem
          solution: "Make gluten-free buns", // todoo: p.solution
        },
      });
    }
  }
}

export default getExpressRouter(new Routes());
