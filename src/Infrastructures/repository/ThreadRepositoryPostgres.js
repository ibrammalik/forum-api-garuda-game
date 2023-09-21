const AddedThread = require('../../Domains/threads/entities/AddedThread');
const DetailThread = require('../../Domains/threads/entities/DetailThread');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(newThread) {
    const { title, body, userId } = newThread;
    const id = `thread-${this._idGenerator()}`;
    const date = new Date().toISOString();
    const createdAt = date;
    const updatedAt = date;

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5, $6) RETURNING id, title, owner',
      values: [id, userId, title, body, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    return new AddedThread({ ...result.rows[0] });
  }

  async isThreadValid(threadId) {
    const query = {
      text: 'SELECT id FROM threads where id = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 1) return true;
    return false;
  }

  async getDetailThread(threadId) {
    const query = {
      text: `SELECT
            threads.id, 
            threads.title, 
            threads.body, 
            threads.created_at AS date, 
            users.username
            FROM threads INNER JOIN users 
            ON threads.owner = users.id
            WHERE threads.id = $1
          `,
      values: [threadId],
    };

    const result = await this._pool.query(query);
    return new DetailThread({
      ...result.rows[0],
      comments: [],
    });
  }
}

module.exports = ThreadRepositoryPostgres;
