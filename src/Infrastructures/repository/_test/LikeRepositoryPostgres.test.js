const pool = require('../../database/postgres/pool');
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');

// doesThisUserLikesThisComment()
// likeComment()
// cancelLikeComment()
// likeCommentCount()

describe('LikeRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await LikesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('doesThisUserLikesThisComment function', () => {
    it('should return true if given userId already likes given commentId', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await LikesTableTestHelper.likeComment({});
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool);

      // Action and Assert
      expect(await likeRepositoryPostgres.doesThisUserLikesThisComment({
        userId: 'user-123',
        commentId: 'comment-123',
      })).toStrictEqual(true);
    });

    it('should return false if given userId not likes given commentId yet', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      // await LikesTableTestHelper.likeComment({});
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool);

      // Action and Assert
      expect(await likeRepositoryPostgres.doesThisUserLikesThisComment({
        userId: 'user-123',
        commentId: 'comment-123',
      })).toStrictEqual(false);
    });
  });

  describe('likeComment function', () => {
    it('should add like comment', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool);

      // Action
      await likeRepositoryPostgres.likeComment({
        userId: 'user-123',
        commentId: 'comment-123',
      });

      // Assert
      const likeComment = await LikesTableTestHelper.findLikeComment({ owner: 'user-123', commentId: 'comment-123' });
      expect(likeComment).toHaveLength(1);
    });

    it('should return status success if like comment success', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool);

      // Action and Assert
      expect(await likeRepositoryPostgres.likeComment({
        userId: 'user-123',
        commentId: 'comment-123',
      })).toStrictEqual({ status: 'success' });
    });
  });

  describe('cancelLikeComment function', () => {
    it('should delete like comment', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await LikesTableTestHelper.likeComment({});
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool);

      // Action
      await likeRepositoryPostgres.cancelLikeComment({
        userId: 'user-123',
        commentId: 'comment-123',
      });

      // Assert
      const likeComment = await LikesTableTestHelper.findLikeComment({ owner: 'user-123', commentId: 'comment-123' });
      expect(likeComment).toHaveLength(0);
    });

    it('should not delete all row in likes table', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      await CommentsTableTestHelper.addComment({});
      await LikesTableTestHelper.likeComment({});

      await CommentsTableTestHelper.addComment({ id: 'comment-456' });
      await LikesTableTestHelper.likeComment({ commentId: 'comment-456' });

      await CommentsTableTestHelper.addComment({ id: 'comment-789' });
      await LikesTableTestHelper.likeComment({ commentId: 'comment-789' });
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool);

      // Action
      await likeRepositoryPostgres.cancelLikeComment({
        userId: 'user-123',
        commentId: 'comment-123',
      });

      // Assert
      expect(await LikesTableTestHelper.rowCount()).toStrictEqual(2);
    });

    it('should return status success if delete like comment success', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await LikesTableTestHelper.likeComment({});
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool);

      // Action and Assert
      expect(await likeRepositoryPostgres.cancelLikeComment({
        userId: 'user-123',
        commentId: 'comment-123',
      })).toStrictEqual({ status: 'success' });
    });
  });

  describe('likeCommentCount function', () => {
    it('should return comment like count correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await UsersTableTestHelper.addUser({ id: 'user-456', username: 'user-456' });
      await UsersTableTestHelper.addUser({ id: 'user-789', username: 'user-789' });
      await UsersTableTestHelper.addUser({ id: 'user-101112', username: 'user-101112' });
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await LikesTableTestHelper.likeComment({});
      await LikesTableTestHelper.likeComment({ owner: 'user-456' });
      await LikesTableTestHelper.likeComment({ owner: 'user-789' });
      await LikesTableTestHelper.likeComment({ owner: 'user-101112' });
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool);

      //  Action and Assert
      expect(await likeRepositoryPostgres.likeCommentCount('comment-123')).toStrictEqual(4);
    });
  });
});
