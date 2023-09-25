class LikeCommentUseCase {
  constructor({ threadRepository, commentRepository, likeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._likeRepository = likeRepository;
  }

  async execute(useCasePayload) {
    const { threadId, commentId, userId } = useCasePayload;
    const isThreadValid = await this._threadRepository.isThreadValid(threadId);
    const isCommentValid = await this._commentRepository.isCommentValid(commentId);
    const isUserLikes = await this._likeRepository
      .doesThisUserLikesThisComment({ userId, commentId });

    if (!isThreadValid) {
      throw new Error('LIKE_COMMENT_USE_CASE.THREAD_NOT_VALID');
    }

    if (!isCommentValid) {
      throw new Error('LIKE_COMMENT_USE_CASE.COMMENT_NOT_VALID');
    }

    if (!isUserLikes) {
      return this._likeRepository.likeComment({ userId, commentId });
    }

    return this._likeRepository.cancelLikeComment({ userId, commentId });
  }
}

module.exports = LikeCommentUseCase;
