class DeleteReplyUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const {
      threadId, commentId, replyId, userId,
    } = useCasePayload;
    const isThreadValid = await this._threadRepository.isThreadValid(threadId);
    const isCommentValid = await this._commentRepository.isCommentValid(commentId);
    const isReplyValid = await this._replyRepository.isReplyValid(replyId);
    const doesThisUserIdOwnThisReply = await this._replyRepository
      .doesThisUserIdOwnThisReply(userId, replyId);

    if (!isThreadValid) {
      throw new Error('DELETE_REPLY_USE_CASE.THREAD_NOT_VALID');
    }

    if (!isCommentValid) {
      throw new Error('DELETE_REPLY_USE_CASE.COMMENT_NOT_VALID');
    }

    if (!isReplyValid) {
      throw new Error('DELETE_REPLY_USE_CASE.REPLY_NOT_VALID');
    }

    if (!doesThisUserIdOwnThisReply) {
      throw new Error('DELETE_REPLY_USE_CASE.NOT_REPLY_OWNER');
    }

    return this._replyRepository.deleteReply(replyId);
  }
}

module.exports = DeleteReplyUseCase;
