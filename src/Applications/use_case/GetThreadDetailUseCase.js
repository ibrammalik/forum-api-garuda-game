const DetailThread = require('../../Domains/threads/entities/DetailThread');
const DetailReply = require('../../Domains/replies/entities/DetailReply');
const DetailComment = require('../../Domains/comments/entities/DetailComment');

class GetThreadDetailUseCase {
  constructor({
    threadRepository, commentRepository, replyRepository, likeRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._likeRepository = likeRepository;
  }

  async execute(useCasePayload) {
    const { threadId } = useCasePayload;
    const isThreadValid = await this._threadRepository.isThreadValid(threadId);

    if (!isThreadValid) {
      throw new Error('GET_THREAD_DETAIL_USE_CASE.THREAD_NOT_VALID');
    }

    const comments = await this._commentRepository.getCommentsByThreadId(threadId);
    const replies = await this._replyRepository.getRepliesByThreadId(threadId);
    for (let i = 0; i < comments.length; i += 1) {
      const filteredReplies = replies.filter((reply) => reply.commentId === comments[i].id);
      comments[i].replies = filteredReplies.map((reply) => new DetailReply(reply));
    }
    const detailThread = await this._threadRepository.getDetailThread(threadId);
    detailThread.comments = await Promise.all(comments.map(async (comment) => new DetailComment({
      ...comment,
      likeCount: await this._likeRepository.likeCommentCount(comment.id),
    })));

    return new DetailThread(detailThread);
  }
}

module.exports = GetThreadDetailUseCase;
