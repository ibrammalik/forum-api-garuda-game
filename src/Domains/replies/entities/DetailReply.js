class DetailReply {
  constructor(payload) {
    this._verifyPayload(payload);

    this.id = payload.id;
    this.content = payload.isDeleted ? '**balasan telah dihapus**' : payload.content;
    this.date = payload.date;
    this.username = payload.username;
  }

  _verifyPayload({
    id, username, date, content, isDeleted,
  }) {
    if (id === undefined
        || username === undefined
        || date === undefined
        || content === undefined
        || isDeleted === undefined

    ) {
      throw new Error('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof username !== 'string' || typeof date !== 'string' || typeof content !== 'string' || typeof isDeleted !== 'boolean') {
      throw new Error('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailReply;
