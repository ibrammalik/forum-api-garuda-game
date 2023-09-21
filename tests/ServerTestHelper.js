/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');
const CommentsTableTestHelper = require('./CommentsTableTestHelper');
const ThreadsTableTestHelper = require('./ThreadsTableTestHelper');
const RepliesTableTestHelper = require('./RepliesTableTestHelper');

const ServerTestHelper = {
  async addUserAndLogin(server, username = 'dicoding') {
    const addUserResponse = await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username,
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      },
    });
    const loginResponse = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username,
        password: 'secret',
      },
    });
    const addUserResponseJson = JSON.parse(addUserResponse.payload);
    const loginResponseJson = JSON.parse(loginResponse.payload);
    return {
      accessToken: loginResponseJson.data.accessToken,
      userId: addUserResponseJson.data.addedUser.id,
    };
  },

  async addThreadAndGetId(server, accessToken) {
    const response = await server.inject({
      method: 'POST',
      url: '/threads',
      payload: {
        title: 'A Thread Title',
        body: 'A Thread Body',
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const responseJson = JSON.parse(response.payload);
    return responseJson.data.addedThread;
  },

  async addUserThreadComment(server) {
    const { accessToken, userId } = await this.addUserAndLogin(server);
    const threadId = 'thread-f932h9f28hf9823h';
    const commentId = 'comment-jf2983j289fj38ffj2';
    // add thread
    await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
    // add comment
    await CommentsTableTestHelper.addComment({ id: commentId, owner: userId, threadId });

    return {
      userId, accessToken, threadId, commentId,
    };
  },

  async addUserThreadCommentReply(server) {
    const {
      userId, accessToken, threadId, commentId,
    } = await this.addUserThreadComment(server);
    const replyId = 'reply-j98vhas9vn29b924h';
    await RepliesTableTestHelper.addReply({ id: replyId, owner: userId, commentId });

    return {
      userId, accessToken, threadId, commentId, replyId,
    };
  },

  async cleanTable() {
    await pool.query('DELETE FROM users WHERE 1=1');
    await pool.query('DELETE FROM authentications WHERE 1=1');
    await pool.query('DELETE FROM threads WHERE 1=1');
    await pool.query('DELETE FROM comments WHERE 1=1');
    await pool.query('DELETE FROM replies WHERE 1=1');
  },
};

module.exports = ServerTestHelper;
