const NewReply = require('../../Domains/replies/entities/NewReply');

class AddReplyUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const isThreadValid = await this._threadRepository.isThreadValid(useCasePayload.threadId);
    const isCommentValid = await this._commentRepository.isCommentValid(useCasePayload.commentId);

    if (!isThreadValid) {
      throw new Error('ADD_REPLY_USE_CASE.THREAD_NOT_VALID');
    }

    if (!isCommentValid) {
      throw new Error('ADD_REPLY_USE_CASE.COMMENT_NOT_VALID');
    }

    const newReply = new NewReply(useCasePayload);
    return this._replyRepository.addReply(newReply);
  }
}

module.exports = AddReplyUseCase;
