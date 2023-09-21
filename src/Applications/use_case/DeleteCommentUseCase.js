class DeleteCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { threadId, commentId, userId } = useCasePayload;
    const isThreadValid = await this._threadRepository.isThreadValid(threadId);
    const isCommentValid = await this._commentRepository.isCommentValid(commentId);
    const doesThisUserIdOwnThisComment = await this._commentRepository
      .doesThisUserIdOwnThisComment(userId, commentId);

    if (!isThreadValid) {
      throw new Error('DELETE_COMMENT_USE_CASE.THREAD_NOT_VALID');
    }

    if (!isCommentValid) {
      throw new Error('DELETE_COMMENT_USE_CASE.COMMENT_NOT_VALID');
    }

    if (!doesThisUserIdOwnThisComment) {
      throw new Error('DELETE_COMMENT_USE_CASE.NOT_COMMENT_OWNER');
    }

    return this._commentRepository.deleteComment(commentId);
  }
}

module.exports = DeleteCommentUseCase;
