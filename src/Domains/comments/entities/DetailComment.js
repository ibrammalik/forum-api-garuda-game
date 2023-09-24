class DetailComment {
  constructor(payload) {
    this._verifyPayload(payload);

    this.id = payload.id;
    this.username = payload.username;
    this.date = payload.date;
    this.replies = payload.replies;
    this.likeCount = payload.likeCount;
    this.content = payload.isDeleted ? '**komentar telah dihapus**' : payload.content;
  }

  _verifyPayload({
    id, username, date, replies, content, likeCount, isDeleted,
  }) {
    if (id === undefined
        || username === undefined
        || date === undefined
        || replies === undefined
        || content === undefined
        || likeCount === undefined
        || isDeleted === undefined

    ) {
      throw new Error('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string'
    || typeof username !== 'string'
    || typeof date !== 'string'
    || !Array.isArray(replies)
    || typeof content !== 'string'
    || typeof likeCount !== 'number'
    || typeof isDeleted !== 'boolean') {
      throw new Error('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailComment;
