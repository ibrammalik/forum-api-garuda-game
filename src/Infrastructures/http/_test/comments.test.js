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

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and persisted comments', async () => {
      // Arrange
      const server = await createServer(container);
      const { accessToken } = await ServerTestHelper.addUserAndLogin(server);
      const { id: threadId } = await ServerTestHelper.addThreadAndGetId(server, accessToken);

      const requestPayload = {
        content: 'A Comment Content',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
    });

    it('should response 401 when request do not have authorization or access token', async () => {
      // Arrange
      const server = await createServer(container);
      const { accessToken } = await ServerTestHelper.addUserAndLogin(server);
      const { id: threadId } = await ServerTestHelper.addThreadAndGetId(server, accessToken);

      const requestPayload = {
        content: 'A Comment Content',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        // headers: {
        //   Authorization: `Bearer ${accessToken}`,
        // },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 404 when threadId parameter is not valid or thread with given threadId not exist', async () => {
      // Arrange
      const server = await createServer(container);
      const { accessToken } = await ServerTestHelper.addUserAndLogin(server);

      const requestPayload = {
        content: 'A Comment Content',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/not_valid_threadId/comments',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat comment baru karena thread tidak valid');
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const server = await createServer(container);
      const { accessToken } = await ServerTestHelper.addUserAndLogin(server);
      const { id: threadId } = await ServerTestHelper.addThreadAndGetId(server, accessToken);

      const requestPayload = {
        // content: 'A Comment Content',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const server = await createServer(container);
      const { accessToken } = await ServerTestHelper.addUserAndLogin(server);
      const { id: threadId } = await ServerTestHelper.addThreadAndGetId(server, accessToken);

      const requestPayload = {
        content: 94058230958,
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat comment baru karena tipe data tidak sesuai');
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 200 and delete the comment', async () => {
      // Arrange
      const server = await createServer(container);
      const {
        accessToken, threadId, commentId,
      } = await ServerTestHelper.addUserThreadComment(server);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 401 when request do not have authorization or access token', async () => {
      // Arrange
      const server = await createServer(container);
      const {
        threadId, commentId,
      } = await ServerTestHelper.addUserThreadComment(server);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        // headers: {
        //   Authorization: `Bearer ${accessToken}`,
        // },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 403 when not comment owner try to delete the comment', async () => {
      // Arrange
      const server = await createServer(container);
      const {
        threadId, commentId,
      } = await ServerTestHelper.addUserThreadComment(server);
      const { accessToken: notReplyOwnerAccessToken } = await ServerTestHelper.addUserAndLogin(server, 'anotherUser');

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${notReplyOwnerAccessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat menghapus comment karena bukan pemilik comment');
    });

    it('should response 404 when threadId parameter is not valid or thread with given threadId not exist', async () => {
      // Arrange
      const server = await createServer(container);
      const {
        accessToken, commentId,
      } = await ServerTestHelper.addUserThreadComment(server);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/not_valid_threadId/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat menghapus comment karena thread tidak valid');
    });

    it('should response 404 when commentId parameter is not valid or comment with given commentId not exist', async () => {
      // Arrange
      const server = await createServer(container);
      const {
        accessToken, threadId,
      } = await ServerTestHelper.addUserThreadCommentReply(server);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/not_valid_commentId`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat menghapus comment karena comment tidak valid');
    });
  });
});
