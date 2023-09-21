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

  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 201 and persisted reply', async () => {
      // Arrange
      const server = await createServer(container);
      const {
        accessToken, threadId, commentId,
      } = await ServerTestHelper.addUserThreadComment(server);

      const requestPayload = {
        content: 'A Reply Content',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedReply).toBeDefined();
    });

    it('should response 401 when request do not have authorization or access token', async () => {
      // Arrange
      const server = await createServer(container);
      const { threadId, commentId } = await ServerTestHelper.addUserThreadComment(server);

      const requestPayload = {
        content: 'A Reply Content',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
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
      const { accessToken, commentId } = await ServerTestHelper.addUserThreadComment(server);

      const requestPayload = {
        content: 'A Reply Content',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/not_valid_threadId/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat reply baru karena thread tidak valid');
    });

    it('should response 404 when commentId parameter is not valid or comment with given commentId not exist', async () => {
      // Arrange
      const server = await createServer(container);
      const { accessToken, threadId } = await ServerTestHelper.addUserThreadComment(server);

      const requestPayload = {
        content: 'A Reply Content',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/not_valid_commentId/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat reply baru karena comment tidak valid');
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const server = await createServer(container);
      const {
        accessToken, threadId, commentId,
      } = await ServerTestHelper.addUserThreadComment(server);

      const requestPayload = {
        // content: 'A Reply Content',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat reply baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const server = await createServer(container);
      const {
        accessToken, threadId, commentId,
      } = await ServerTestHelper.addUserThreadComment(server);

      const requestPayload = {
        content: {},
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat reply baru karena tipe data tidak sesuai');
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    it('should response 200 and delete the reply', async () => {
      // Arrange
      const server = await createServer(container);
      const {
        accessToken, threadId, commentId, replyId,
      } = await ServerTestHelper.addUserThreadCommentReply(server);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
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
        threadId, commentId, replyId,
      } = await ServerTestHelper.addUserThreadCommentReply(server);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
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

    it('should response 403 when not reply owner try to delete the reply', async () => {
      // Arrange
      const server = await createServer(container);
      const {
        threadId, commentId, replyId,
      } = await ServerTestHelper.addUserThreadCommentReply(server);
      const { accessToken: notReplyOwnerAccessToken } = await ServerTestHelper.addUserAndLogin(server, 'anotherUser');

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          Authorization: `Bearer ${notReplyOwnerAccessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat menghapus reply karena bukan pemilik reply');
    });

    it('should response 404 when threadId parameter is not valid or thread with given threadId not exist', async () => {
      // Arrange
      const server = await createServer(container);
      const {
        accessToken, commentId, replyId,
      } = await ServerTestHelper.addUserThreadCommentReply(server);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/not_valid_threadId/comments/${commentId}/replies/${replyId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat menghapus reply karena thread tidak valid');
    });

    it('should response 404 when commentId parameter is not valid or comment with given commentId not exist', async () => {
      // Arrange
      const server = await createServer(container);
      const {
        accessToken, threadId, replyId,
      } = await ServerTestHelper.addUserThreadCommentReply(server);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/not_valid_commentId/replies/${replyId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat menghapus reply karena comment tidak valid');
    });

    it('should response 404 when replyId parameter is not valid or reply with given replyId not exist', async () => {
      // Arrange
      const server = await createServer(container);
      const {
        accessToken, threadId, commentId,
      } = await ServerTestHelper.addUserThreadCommentReply(server);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/not_valid_replyId`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat menghapus reply karena reply tidak valid');
    });
  });
});
