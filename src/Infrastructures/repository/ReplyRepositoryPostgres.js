const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const AddedReply = require('../../Domains/replies/entities/AddedReply');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(newReply) {
    const { commentId, userId: owner, content } = newReply;
    const id = `reply-${this._idGenerator()}`;
    const date = new Date().toISOString();
    const createdAt = date;
    const updatedAt = date;
    const isDeleted = false;

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id, content, owner',
      values: [id, owner, commentId, content, isDeleted, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    return new AddedReply({ ...result.rows[0] });
  }

  async isReplyValid(replyId) {
    const query = {
      text: 'SELECT id FROM replies WHERE id = $1',
      values: [replyId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 1) return true;
    return false;
  }

  async doesThisUserIdOwnThisReply(userId, replyId) {
    const query = {
      text: 'SELECT id FROM replies WHERE id = $1 AND owner = $2',
      values: [replyId, userId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 1) return true;
    return false;
  }

  async deleteReply(replyId) {
    const query = {
      text: 'UPDATE replies SET is_deleted = true WHERE id = $1 RETURNING id',
      values: [replyId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 1) return { status: 'success' };
    return { status: 'failed' };
  }

  async getRepliesByThreadId(threadId) {
    const query = {
      text: `SELECT 
              replies.id, 
              users.username, 
              replies.created_at AS date, 
              replies.content, 
              replies.is_deleted,
              replies.comment_id
              FROM replies INNER JOIN users 
              ON replies.owner = users.id
              INNER JOIN comments
              ON replies.comment_id = comments.id
              WHERE comments.thread_id = $1`,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    const replies = result.rows
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((reply) => ({ commentId: reply.comment_id, isDeleted: reply.is_deleted, ...reply }));

    return replies;
  }
}
module.exports = ReplyRepositoryPostgres;
