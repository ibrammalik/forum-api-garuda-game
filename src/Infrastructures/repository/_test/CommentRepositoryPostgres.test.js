const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist add comment', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-jasf398fsa49785yfih' });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-jd9384jnmdfj21309z',
        owner: 'user-jasf398fsa49785yfih',
      });

      const newComment = new NewComment({
        threadId: 'thread-jd9384jnmdfj21309z',
        userId: 'user-jasf398fsa49785yfih',
        content: 'A Comment Content',
      });
      const fakeIdGenerator = () => 'hosf328h89sh32f'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.addComment(newComment);

      //   Assert
      const comment = await CommentsTableTestHelper.findCommentById('comment-hosf328h89sh32f');
      expect(comment).toHaveLength(1);
    });

    it('should return added comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-jasf398fsa49785yfih' });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-jd9384jnmdfj21309z',
        owner: 'user-jasf398fsa49785yfih',
      });

      const newComment = new NewComment({
        threadId: 'thread-jd9384jnmdfj21309z',
        userId: 'user-jasf398fsa49785yfih',
        content: 'A Comment Content',
      });
      const fakeIdGenerator = () => 'hosf328h89sh32f'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(newComment);

      //   Assert
      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-hosf328h89sh32f',
        content: 'A Comment Content',
        owner: 'user-jasf398fsa49785yfih',
      }));
    });
  });

  describe('isCommentValid function', () => {
    it('should return true if comment is valid', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-jasf398fsa49785yfih' });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-jd9384jnmdfj21309z',
        owner: 'user-jasf398fsa49785yfih',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-hosf328h89sh32f',
        owner: 'user-jasf398fsa49785yfih',
        threadId: 'thread-jd9384jnmdfj21309z',
      });
      const fakeIdGenerator = () => 'hosf328h89sh32f'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      //  Action and Assert
      expect(await commentRepositoryPostgres.isCommentValid('comment-hosf328h89sh32f')).toStrictEqual(true);
    });

    it('should return false if comment is not valid', async () => {
      // Arrange
      const fakeIdGenerator = () => 'hosf328h89sh32f'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      //  Action and Assert
      expect(await commentRepositoryPostgres.isCommentValid('comment-hosf328h89sh32f')).toStrictEqual(false);
    });
  });

  describe('doesThisUserIdOwnThisComment function', () => {
    it('should return true if given userId is the owner of comment', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-jasf398fsa49785yfih' });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-jd9384jnmdfj21309z',
        owner: 'user-jasf398fsa49785yfih',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-hosf328h89sh32f',
        owner: 'user-jasf398fsa49785yfih',
        threadId: 'thread-jd9384jnmdfj21309z',
      });
      const fakeIdGenerator = () => 'hosf328h89sh32f'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      //  Action and Assert
      expect(await commentRepositoryPostgres.doesThisUserIdOwnThisComment('user-jasf398fsa49785yfih', 'comment-hosf328h89sh32f')).toStrictEqual(true);
    });

    it('should return false if given userId is not the owner of comment', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-jasf398fsa49785yfih' });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-jd9384jnmdfj21309z',
        owner: 'user-jasf398fsa49785yfih',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-hosf328h89sh32f',
        owner: 'user-jasf398fsa49785yfih',
        threadId: 'thread-jd9384jnmdfj21309z',
      });
      const fakeIdGenerator = () => 'hosf328h89sh32f'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      //  Action and Assert
      expect(await commentRepositoryPostgres.doesThisUserIdOwnThisComment('not_the_owner_of_comment', 'comment-hosf328h89sh32f')).toStrictEqual(false);
    });
  });

  describe('deleteComment function', () => {
    it('should return status success when comment deleted successfully', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-jasf398fsa49785yfih' });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-jd9384jnmdfj21309z',
        owner: 'user-jasf398fsa49785yfih',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-hosf328h89sh32f',
        owner: 'user-jasf398fsa49785yfih',
        threadId: 'thread-jd9384jnmdfj21309z',
      });
      const fakeIdGenerator = () => 'hosf328h89sh32f'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      //  Action and Assert
      expect(await commentRepositoryPostgres.deleteComment('comment-hosf328h89sh32f')).toStrictEqual({ status: 'success' });
    });

    it('should return status failed when comment failed to delete', async () => {
      // Arrange
      const fakeIdGenerator = () => 'hosf328h89sh32f'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      //  Action and Assert
      expect(await commentRepositoryPostgres.deleteComment('comment-not_valid_commentId')).toStrictEqual({ status: 'failed' });
    });
  });

  describe('getCommentsByThreadId function', () => {
    it('should return comments with given threadId correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-jasf398fsa49785yfih' });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-jd9384jnmdfj21309z',
        owner: 'user-jasf398fsa49785yfih',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-first',
        owner: 'user-jasf398fsa49785yfih',
        threadId: 'thread-jd9384jnmdfj21309z',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-second',
        owner: 'user-jasf398fsa49785yfih',
        threadId: 'thread-jd9384jnmdfj21309z',
      });
      const fakeIdGenerator = () => 'hosf328h89sh32f'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const comments = await commentRepositoryPostgres.getCommentsByThreadId('thread-jd9384jnmdfj21309z');

      // Assert
      expect(comments).toHaveLength(2);
      expect(comments[0].id).toStrictEqual('comment-first');
      expect(comments[1].id).toStrictEqual('comment-second');
    });
  });
});
