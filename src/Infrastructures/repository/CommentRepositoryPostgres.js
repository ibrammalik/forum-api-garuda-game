const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(newComment) {
    const { threadId, userId: owner, content } = newComment;
    const id = `comment-${this._idGenerator()}`;
    const date = new Date().toISOString();
    const createdAt = date;
    const updatedAt = date;
    const isDeleted = false;

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id, content, owner',
      values: [id, owner, threadId, content, isDeleted, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    return new AddedComment({ ...result.rows[0] });
  }

  async isCommentValid(commentId) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 1) return true;
    return false;
  }

  async doesThisUserIdOwnThisComment(userId, commentId) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1 AND owner = $2',
      values: [commentId, userId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 1) return true;
    return false;
  }

  async deleteComment(commentId) {
    const query = {
      text: 'UPDATE comments SET is_deleted = true WHERE id = $1 RETURNING id',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 1) return { status: 'success' };
    return { status: 'failed' };
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: `SELECT 
              comments.id, 
              users.username, 
              comments.created_at AS date, 
              comments.content, 
              comments.is_deleted
              FROM comments INNER JOIN users 
              ON comments.owner = users.id
              WHERE comments.thread_id = $1`,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    const comments = result.rows
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((comment) => ({ isDeleted: comment.is_deleted, ...comment }));

    return comments;
  }
}
module.exports = CommentRepositoryPostgres;
