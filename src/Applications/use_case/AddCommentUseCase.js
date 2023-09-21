const NewComment = require('../../Domains/comments/entities/NewComment');

class AddCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const isThreadValid = await this._threadRepository.isThreadValid(useCasePayload.threadId);

    if (!isThreadValid) {
      throw new Error('ADD_COMMENT_USE_CASE.THREAD_NOT_VALID');
    }

    const newComment = new NewComment(useCasePayload);
    return this._commentRepository.addComment(newComment);
  }
}

module.exports = AddCommentUseCase;
