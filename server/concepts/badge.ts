import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError } from "./errors";

export interface BadgeDoc extends BaseDoc {
  owner: ObjectId;
  badges: Array<{
    name: string;
    count: number;
  }>;
}

export default class BadgeConcept {
  public readonly badges = new DocCollection<BadgeDoc>("badges");

  public async add(owner: ObjectId, badgeName: string) {
    const badgesByThisOwner = await this.badges.readOne({ owner });
    if (badgesByThisOwner === null) {
      await this.badges.createOne({ owner, badges: [{ name: badgeName, count: 1 }] });
      return;
    }
    if (badgesByThisOwner.badges.some((b) => b.name === badgeName)) {
      await this.badges.updateOne({ owner }, { badges: badgesByThisOwner.badges.map((b) => (b.name === badgeName ? { name: b.name, count: b.count + 1 } : b)) });
      return;
    }
    await this.badges.updateOne({ owner }, { badges: badgesByThisOwner.badges.concat({ name: badgeName, count: 1 }) });
  }

  public async remove(owner: ObjectId, badgeName: string) {
    const badgesByThisOwner = await this.badges.readOne({ owner });
    if (badgesByThisOwner === null) {
      throw new NotAllowedError("owner doesn't even have any badge");
    }
    if (!badgesByThisOwner.badges.some((b) => b.name === badgeName)) {
      throw new NotAllowedError("owner doesn't even have this badge");
    }
    await this.badges.updateOne({ owner }, { badges: badgesByThisOwner.badges.map((b) => (b.name === badgeName ? { name: b.name, count: b.count - 1 } : b)) });
  }

  public async getBadges(owner: ObjectId) {
    const badgesByThisOwner = await this.badges.readOne({ owner });
    return badgesByThisOwner?.badges ?? [];
  }

  public async getBadgeInfo(owner: ObjectId, badgeName: string) {
    const badgesByThisOwner = await this.badges.readOne({ owner });
    if (badgesByThisOwner === null) {
      return null;
    }
    const badgeInfo = badgesByThisOwner.badges.filter((b) => b.name === badgeName);
    if (badgeInfo.length === 0) {
      return null;
    }
    return badgeInfo.at(0)!;
  }
}
