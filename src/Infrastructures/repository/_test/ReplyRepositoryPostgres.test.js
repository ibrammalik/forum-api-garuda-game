const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const NewReply = require('../../../Domains/replies/entities/NewReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');

describe('ReplyRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addReply function', () => {
    it('should persist add reply', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-jasf398fsa49785yfih' });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-jd9384jnmdfj21309z',
        owner: 'user-jasf398fsa49785yfih',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-jf9832j8f2j39832',
        threadId: 'thread-jd9384jnmdfj21309z',
        owner: 'user-jasf398fsa49785yfih',
      });

      const newReply = new NewReply({
        commentId: 'comment-jf9832j8f2j39832',
        userId: 'user-jasf398fsa49785yfih',
        content: 'A Reply Content',
      });
      const fakeIdGenerator = () => 'fh9238hhfa09shf23'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await replyRepositoryPostgres.addReply(newReply);

      // Assert
      const reply = await RepliesTableTestHelper.findReplyById('reply-fh9238hhfa09shf23');
      expect(reply).toHaveLength(1);
    });

    it('should return added reply correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-jasf398fsa49785yfih' });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-jd9384jnmdfj21309z',
        owner: 'user-jasf398fsa49785yfih',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-jf9832j8f2j39832',
        threadId: 'thread-jd9384jnmdfj21309z',
        owner: 'user-jasf398fsa49785yfih',
      });

      const newReply = new NewReply({
        commentId: 'comment-jf9832j8f2j39832',
        userId: 'user-jasf398fsa49785yfih',
        content: 'A Reply Content',
      });
      const fakeIdGenerator = () => 'fh9238hhfa09shf23'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedReply = await replyRepositoryPostgres.addReply(newReply);

      // Assert
      expect(addedReply).toStrictEqual(new AddedReply({
        id: 'reply-fh9238hhfa09shf23',
        content: 'A Reply Content',
        owner: 'user-jasf398fsa49785yfih',
      }));
    });
  });

  describe('isReplyValid function', () => {
    it('should return true if reply is valid', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-jasf398fsa49785yfih' });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-jd9384jnmdfj21309z',
        owner: 'user-jasf398fsa49785yfih',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-jf9832j8f2j39832',
        threadId: 'thread-jd9384jnmdfj21309z',
        owner: 'user-jasf398fsa49785yfih',
      });
      await RepliesTableTestHelper.addReply({
        id: 'reply-fh9238hhfa09shf23',
        owner: 'user-jasf398fsa49785yfih',
        commentId: 'comment-jf9832j8f2j39832',
      });
      const fakeIdGenerator = () => 'fh9238hhfa09shf23'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action and Assert
      expect(await replyRepositoryPostgres.isReplyValid('reply-fh9238hhfa09shf23')).toStrictEqual(true);
    });

    it('should return true if reply is valid', async () => {
      // Arrange
      const fakeIdGenerator = () => 'fh9238hhfa09shf23'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action and Assert
      expect(await replyRepositoryPostgres.isReplyValid('reply-fh9238hhfa09shf23')).toStrictEqual(false);
    });
  });

  describe('doesThisUserIdOwnThisReply function', () => {
    it('should return true if given userId is the owner of reply', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-jasf398fsa49785yfih' });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-jd9384jnmdfj21309z',
        owner: 'user-jasf398fsa49785yfih',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-jf9832j8f2j39832',
        threadId: 'thread-jd9384jnmdfj21309z',
        owner: 'user-jasf398fsa49785yfih',
      });
      await RepliesTableTestHelper.addReply({
        id: 'reply-fh9238hhfa09shf23',
        owner: 'user-jasf398fsa49785yfih',
        commentId: 'comment-jf9832j8f2j39832',
      });
      const fakeIdGenerator = () => 'fh9238hhfa09shf23'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action and Assert
      expect(await replyRepositoryPostgres.doesThisUserIdOwnThisReply('user-jasf398fsa49785yfih', 'reply-fh9238hhfa09shf23')).toStrictEqual(true);
    });

    it('should return false if given userId is the owner of reply', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-jasf398fsa49785yfih' });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-jd9384jnmdfj21309z',
        owner: 'user-jasf398fsa49785yfih',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-jf9832j8f2j39832',
        threadId: 'thread-jd9384jnmdfj21309z',
        owner: 'user-jasf398fsa49785yfih',
      });
      await RepliesTableTestHelper.addReply({
        id: 'reply-fh9238hhfa09shf23',
        owner: 'user-jasf398fsa49785yfih',
        commentId: 'comment-jf9832j8f2j39832',
      });
      const fakeIdGenerator = () => 'fh9238hhfa09shf23'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action and Assert
      expect(await replyRepositoryPostgres.doesThisUserIdOwnThisReply('not_the_owner_of_reply', 'reply-fh9238hhfa09shf23')).toStrictEqual(false);
    });
  });

  describe('deleteReply function', () => {
    it('should return status success when reply deleted successfully', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-jasf398fsa49785yfih' });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-jd9384jnmdfj21309z',
        owner: 'user-jasf398fsa49785yfih',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-jf9832j8f2j39832',
        threadId: 'thread-jd9384jnmdfj21309z',
        owner: 'user-jasf398fsa49785yfih',
      });
      await RepliesTableTestHelper.addReply({
        id: 'reply-fh9238hhfa09shf23',
        owner: 'user-jasf398fsa49785yfih',
        commentId: 'comment-jf9832j8f2j39832',
      });
      const fakeIdGenerator = () => 'fh9238hhfa09shf23'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      //  Action and Assert
      expect(await replyRepositoryPostgres.deleteReply('reply-fh9238hhfa09shf23')).toStrictEqual({ status: 'success' });
    });

    it('should return failed when reply failed to delete', async () => {
      // Arrange
      const fakeIdGenerator = () => 'fh9238hhfa09shf23'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      //  Action and Assert
      expect(await replyRepositoryPostgres.deleteReply('reply-not_valid_replyId')).toStrictEqual({ status: 'failed' });
    });
  });

  describe('getRepliesByThreadId function', () => {
    it('should return replies with given threadId correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-jasf398fsa49785yfih' });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-jd9384jnmdfj21309z',
        owner: 'user-jasf398fsa49785yfih',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-jf9832j8f2j39832',
        threadId: 'thread-jd9384jnmdfj21309z',
        owner: 'user-jasf398fsa49785yfih',
      });
      await RepliesTableTestHelper.addReply({
        id: 'reply-first',
        owner: 'user-jasf398fsa49785yfih',
        commentId: 'comment-jf9832j8f2j39832',
      });
      await RepliesTableTestHelper.addReply({
        id: 'reply-second',
        owner: 'user-jasf398fsa49785yfih',
        commentId: 'comment-jf9832j8f2j39832',
      });
      const fakeIdGenerator = () => 'fh9238hhfa09shf23'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const replies = await replyRepositoryPostgres.getRepliesByThreadId('thread-jd9384jnmdfj21309z');

      // Assert
      expect(replies).toHaveLength(2);
      expect(replies[0].id).toStrictEqual('reply-first');
      expect(replies[1].id).toStrictEqual('reply-second');
    });
  });
});
