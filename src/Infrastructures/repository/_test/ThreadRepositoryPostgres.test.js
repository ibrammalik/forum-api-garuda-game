const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({
      id: 'user-sdljs329jfs98342',
    });
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist add thread', async () => {
      // Arrange
      const newThread = new NewThread({
        title: 'A Thread Title',
        body: 'A Thread Body',
        userId: 'user-sdljs329jfs98342',
      });
      const fakeIdGenerator = () => 'sdhi83h9f823h'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadRepositoryPostgres.addThread(newThread);

      //   Assert
      const threads = await ThreadsTableTestHelper.findThreadById('thread-sdhi83h9f823h');
      expect(threads).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      // Arrange
      const newThread = new NewThread({
        title: 'A Thread Title',
        body: 'A Thread Body',
        userId: 'user-sdljs329jfs98342',
      });
      const fakeIdGenerator = () => 'sdhi83h9f823h'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(newThread);

      //   Assert
      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-sdhi83h9f823h',
        title: 'A Thread Title',
        owner: 'user-sdljs329jfs98342',
      }));
    });
  });

  describe('isThreadValid function', () => {
    it('should return true if given threadId is valid', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({
        id: 'thread-fakhj298ff82h9af',
        owner: 'user-sdljs329jfs98342',
      });

      const fakeIdGenerator = () => 'sdhi83h9f823h'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      //  Action And Assert
      expect(await threadRepositoryPostgres.isThreadValid('thread-fakhj298ff82h9af')).toStrictEqual(true);
    });

    it('should return false if given threadId is not valid', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({
        id: 'thread-fakhj298ff82h9af',
        owner: 'user-sdljs329jfs98342',
      });

      const fakeIdGenerator = () => 'sdhi83h9f823h'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      //  Action And Assert
      expect(await threadRepositoryPostgres.isThreadValid('not_valid_threadId')).toStrictEqual(false);
    });
  });
});
