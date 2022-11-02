import LikeModel from './model';
import type {Like} from './model';
import type {HydratedDocument, Types} from 'mongoose';

class LikeCollection {
  /**
   * Add a like to the collection
   *
   * @param {string} authorId - The id of the author of the freet
   * @param {string} freetId - The id of the freet
   * @return {Promise<HydratedDocument<Like>>} - The newly created freet
   */
  static async addOne(
    authorId: Types.ObjectId | string,
    freetId: Types.ObjectId | string,
    hidden: boolean
  ): Promise<HydratedDocument<Like>> {
    const like = new LikeModel({
      authorId,
      freetId,
      hidden
    });
    await like.save(); // Saves freet to MongoDB
    return like.populate('authorId freetId');
  }

  /**
   * Get all likes given by freet
   *
   * @param {string} likeId - The id of the freet
   * @return {Promise<HydratedDocument<Like>>} - All likes for a particular freet
   */
  static async findOne(
    likeId: Types.ObjectId | string
  ): Promise<HydratedDocument<Like>> {
    return LikeModel.findOne({_id: likeId}).populate('authorId freetId');
  }

  /**
   * Get all likes given by freet
   *
   * @param {string} userId - The id of the user
   * @param {string} freetId - The id of the freet
   * @return {Promise<HydratedDocument<Like>>} - A for a particular freet by user
   */
  static async findOneByUserAndFreet(
    userId: Types.ObjectId | string, freetId: Types.ObjectId | string
  ): Promise<HydratedDocument<Like>> {
    return LikeModel.findOne({freetId, authorId: userId}).populate('authorId freetId');
  }

  /**
   * Get all likes given by freet
   *
   * @param {string} freetId - The id of the freet
   * @return {Promise<Array<HydratedDocument<Like>>>} - All likes for a particular freet
   */
  static async findAllPublicLikesByFreet(
    freetId: Types.ObjectId | string
  ): Promise<Array<HydratedDocument<Like>>> {
    return LikeModel.find({freetId, hidden: false}).populate('authorId freetId');
  }

  /**
   * Get all likes given by freet
   *
   * @param {string} freetId - The id of the freet
   * @return {Promise<Array<HydratedDocument<Like>>>} - All likes for a particular freet
   */
  static async findAllHiddenLikesByFreet(
    freetId: Types.ObjectId | string
  ): Promise<Array<HydratedDocument<Like>>> {
    return LikeModel.find({freetId, hidden: true}).populate('authorId freetId');
  }

  /**
   * Get all public likes given by username
   *
   * @param {string} userId - The username of person who liked freet
   * @return {Promise<Array<HydratedDocument<Like>>>} - All public likes
   */
  static async findAllPublicLikesByUser(
    userId: Types.ObjectId | string
  ): Promise<Array<HydratedDocument<Like>>> {
    return LikeModel.find({authorId: userId, hidden: false}).populate('authorId freetId');
  }

  /**
   * Get all hidden likes given by username
   *
   * @param {string} userId - The username of person who liked freet
   * @return {Promise<Array<HydratedDocument<Like>>>} - All hidden likes
   */
  static async findAllHiddenLikesByUser(
    userId: Types.ObjectId | string
  ): Promise<Array<HydratedDocument<Like>>> {
    return LikeModel.find({authorId: userId, hidden: true}).populate('authorId freetId');
  }

  /**
   * Delete a like from the freet.
   *
   * @param {string} freetId - The freetId of the like we intend to delete
   * @return {Promise<Boolean>} - true if the like has been deleted, false otherwise
   */
  static async deleteOne(freetId: string, userId: string): Promise<boolean> {
    const like = await LikeModel.deleteMany({authorId: userId, freetId});
    console.log(like);
    return like !== null;
  }

  /**
   * Update all likes by removing a freet
   *
   * @param {string} freetId - The freet to add or remove
   * @return {Promise<Boolean>} - A bookmark with the change in freets
   */
     static async removeFreet(
      freetId: Types.ObjectId | string
    ): Promise<Boolean> {
      const likes = await LikeModel.deleteMany({ freetId });
      return likes !== null ;
    }
}
export default LikeCollection;
