const LikeRepository = require('../../Domains/likes/LikeRepository');

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool) {
    super();
    this._pool = pool;
  }

  async doesThisUserLikesThisComment({ userId, commentId }) {
    const query = {
      text: 'SELECT owner FROM likes WHERE owner = $1 AND comment_id = $2',
      values: [userId, commentId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 1) return true;
    return false;
  }

  async likeComment({ userId, commentId }) {
    const query = {
      text: 'INSERT INTO likes VALUES ($1, $2)',
      values: [userId, commentId],
    };

    await this._pool.query(query);

    return { status: 'success' };
  }

  async cancelLikeComment({ userId, commentId }) {
    const query = {
      text: 'DELETE FROM likes WHERE owner = $1 AND comment_id = $2',
      values: [userId, commentId],
    };

    await this._pool.query(query);

    return { status: 'success' };
  }

  async likeCommentCount(commentId) {
    const query = {
      text: 'SELECT owner FROM likes WHERE comment_id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);
    return result.rowCount;
  }
}

module.exports = LikeRepositoryPostgres;
