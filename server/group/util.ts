import type { PopulatedGroup } from "./model";
import type { HydratedDocument } from "mongoose";
import type { Group } from "./model";

type GroupResponse = {
  _id: string;
  groupName: string;
  admins: string[];
  owner: string;
  members: string[];
  requests: string[];
};

/**
 * Transform a raw Group object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Group>} group - A group
 * @returns {LikeResponse} - The group object formatted for the frontend
 */
const constructGroupResponse = (
  group: HydratedDocument<Group>
): GroupResponse => {
  const groupCopy: PopulatedGroup = {
    ...group.toObject({
      versionKey: false,
    }),
  };
  console.log(groupCopy);
  return {
    _id: groupCopy._id.toString(),
    admins: groupCopy.admins.map((x) => x.username.toString()),
    members: groupCopy.members.map((x) => x.username.toString()),
    owner: groupCopy.owner.username,
    groupName: groupCopy.groupName,
    requests: groupCopy.requests.map((x) => x.username.toString()),
  };
};

export { constructGroupResponse };
