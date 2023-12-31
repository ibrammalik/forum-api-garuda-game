const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');

describe('/threads/{threadId}/comments endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ServerTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments/{commentId}/likes', () => {
    it('should response 200 and like comment', async () => {
      // Arrange
      const server = await createServer(container);
      const {
        accessToken, threadId, commentId,
      } = await ServerTestHelper.addUserThreadComment(server);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 200 and cancel like comment', async () => {
      // Arrange
      const server = await createServer(container);
      const {
        accessToken, threadId, commentId,
      } = await ServerTestHelper.addUserThreadComment(server);

      //   like comment
      await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Action
      // cancel like comment
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 404 when thread is not valid', async () => {
      // Arrange
      const server = await createServer(container);
      const {
        accessToken, commentId,
      } = await ServerTestHelper.addUserThreadComment(server);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/not_valid_thread_id/comments/${commentId}/likes`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat like / cancel like comment karena thread tidak valid');
    });

    it('should response 404 when comment is not valid', async () => {
      // Arrange
      const server = await createServer(container);
      const {
        accessToken, threadId,
      } = await ServerTestHelper.addUserThreadComment(server);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/not_valid_comment_id/likes`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat like / cancel like comment karena comment tidak valid');
    });
  });
});
