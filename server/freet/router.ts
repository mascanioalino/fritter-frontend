import type { NextFunction, Request, Response } from "express";
import express from "express";
import FreetCollection from "./collection";
import * as userValidator from "../user/middleware";
import * as freetValidator from "../freet/middleware";
import * as groupValidator from "../group/middleware";
import * as util from "./util";
import BookmarkCollection from "../bookmark/collection";
import LikeCollection from "../like/collection";

const router = express.Router();

/**
 * Get all the freets
 *
 * @name GET /api/freets
 *
 * @return {FreetResponse[]} - A list of all the freets sorted in descending
 *                      order by date modified
 */
/**
 * Get freet by id.
 *
 * @name GET /api/freets?freetId=freetId
 *
 * @return {FreetResponse[]} - A freet with id freetId
 *
 */
/**
 * Get freets by author.
 *
 * @name GET /api/freets?author=username
 *
 * @return {FreetResponse[]} - An array of freets created by user with username, author
 * @throws {400} - If author is not given
 * @throws {404} - If no user has given author
 *
 */
router.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if author query parameter was supplied
    if (req.query.author !== undefined || req.query.freetId !== undefined) {
      next();
      return;
    }

    const allFreets = await FreetCollection.findAll();
    const response = allFreets.map(util.constructFreetResponse);
    res.status(200).json(response);
  },
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if author query parameter was supplied
    if (req.query.author !== undefined) {
      next();
      return;
    }

    const freet = await FreetCollection.findOne(req.query.freetId as string);
    const response = util.constructFreetResponse(freet);
    res.status(200).json(response);
  },
  [userValidator.isAuthorExists],
  async (req: Request, res: Response) => {
    const authorFreets = await FreetCollection.findAllByUsername(
      req.query.author as string
    );
    const response = authorFreets.map(util.constructFreetResponse);
    res.status(200).json(response);
  }
);

/**
 * Get freets by group.
 *
 * @name GET /api/freets/groups?groupName=groupName
 *
 * @return {FreetResponse[]} - An array of freets created by all users on behalf of group, groupName
 * @throws {400} - If groupName is not given
 * @throws {404} - If no group has given author
 *
 */
router.get(
  "/groups",
  [groupValidator.isGroupExists],
  async (req: Request, res: Response, next: NextFunction) => {
    const groupFreets = await FreetCollection.findAllByGroupName(
      req.query.groupName as string
    );
    const response = groupFreets.map(util.constructFreetResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new freet.
 *
 * @name POST /api/freets
 *
 * @param {string} content - The content of the freet
 * @param {string} groupId - The id of the group
 * @return {FreetResponse} - The created freet
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the freet content is empty or a stream of empty spaces
 * @throws {413} - If the freet content is more than 140 characters long
 */
router.post(
  "/",
  [userValidator.isUserLoggedIn, freetValidator.isValidFreetContent],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ""; // Will not be an empty string since its validated in isUserLoggedIn
    if (req.body.groupId) {
      const freet = await FreetCollection.addOneToGroup(userId, req.body.content, req.body.groupId);
      res.status(201).json({
        message: "Your freet was created successfully.",
        freet: util.constructFreetResponse(freet),
      });
    } else {
      const freet = await FreetCollection.addOne(userId, req.body.content);
      res.status(201).json({
        message: "Your freet was created successfully.",
        freet: util.constructFreetResponse(freet),
      });
    }
  }
);

/**
 * Delete a freet
 *
 * @name DELETE /api/freets/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the freet
 * @throws {404} - If the freetId is not valid
 */
router.delete(
  "/:freetId?",
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    freetValidator.isValidFreetModifier,
  ],
  async (req: Request, res: Response) => {
    await FreetCollection.deleteOne(req.params.freetId);
    await BookmarkCollection.removeFreet(req.params.freetId);
    await LikeCollection.removeFreet(req.params.freetId);
    res.status(200).json({
      message: "Your freet was deleted successfully.",
    });
  }
);

/**
 * Modify a freet
 *
 * @name PATCH /api/freets/:id
 *
 * @param {string} content - the new content for the freet
 * @return {FreetResponse} - the updated freet
 * @throws {403} - if the user is not logged in or not the author of
 *                 of the freet
 * @throws {404} - If the freetId is not valid
 * @throws {400} - If the freet content is empty or a stream of empty spaces
 * @throws {413} - If the freet content is more than 140 characters long
 */
router.patch(
  "/:freetId?",
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    freetValidator.isValidFreetModifier,
    freetValidator.isValidFreetContent,
  ],
  async (req: Request, res: Response) => {
    const freet = await FreetCollection.updateOne(
      req.params.freetId,
      req.body.content
    );
    res.status(200).json({
      message: "Your freet was updated successfully.",
      freet: util.constructFreetResponse(freet),
    });
  }
);

export { router as freetRouter };
