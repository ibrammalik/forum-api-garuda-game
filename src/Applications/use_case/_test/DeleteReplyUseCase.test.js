const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('should throw error when thread is not valid', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-f3298hsdvzvcnzmn2',
      commentId: 'comment-fh907147hhsdzo7',
      replyId: 'reply-fj2398jsdnvczvnqjui',
      userId: 'user-zxcvz9v2zvwavadsvcvv2',
    };

    // creating dependency of use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    // mocking needed function
    mockThreadRepository.isThreadValid = jest.fn()
      .mockImplementation(() => Promise.resolve(false));
    mockCommentRepository.isCommentValid = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockReplyRepository.isReplyValid = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockReplyRepository.doesThisUserIdOwnThisReply = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockReplyRepository.deleteReply = jest.fn()
      .mockImplementation(() => Promise.resolve({
        status: 'success',
      }));

    // creating use case instance
    const deleteReplyUseCase = new DeleteReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action and Assert
    expect(deleteReplyUseCase.execute(useCasePayload)).rejects.toThrowError('DELETE_REPLY_USE_CASE.THREAD_NOT_VALID');
  });

  it('should throw error when comment is not valid', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-f3298hsdvzvcnzmn2',
      commentId: 'comment-fh907147hhsdzo7',
      replyId: 'reply-fj2398jsdnvczvnqjui',
      userId: 'user-zxcvz9v2zvwavadsvcvv2',
    };

    // creating dependency of use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    // mocking needed function
    mockThreadRepository.isThreadValid = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockCommentRepository.isCommentValid = jest.fn()
      .mockImplementation(() => Promise.resolve(false));
    mockReplyRepository.isReplyValid = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockReplyRepository.doesThisUserIdOwnThisReply = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockReplyRepository.deleteReply = jest.fn()
      .mockImplementation(() => Promise.resolve({
        status: 'success',
      }));

    // creating use case instance
    const deleteReplyUseCase = new DeleteReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action and Assert
    expect(deleteReplyUseCase.execute(useCasePayload)).rejects.toThrowError('DELETE_REPLY_USE_CASE.COMMENT_NOT_VALID');
  });

  it('should throw error when reply is not valid', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-f3298hsdvzvcnzmn2',
      commentId: 'comment-fh907147hhsdzo7',
      replyId: 'reply-fj2398jsdnvczvnqjui',
      userId: 'user-zxcvz9v2zvwavadsvcvv2',
    };

    // creating dependency of use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    // mocking needed function
    mockThreadRepository.isThreadValid = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockCommentRepository.isCommentValid = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockReplyRepository.isReplyValid = jest.fn()
      .mockImplementation(() => Promise.resolve(false));
    mockReplyRepository.doesThisUserIdOwnThisReply = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockReplyRepository.deleteReply = jest.fn()
      .mockImplementation(() => Promise.resolve({
        status: 'success',
      }));

    // creating use case instance
    const deleteReplyUseCase = new DeleteReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action and Assert
    expect(deleteReplyUseCase.execute(useCasePayload)).rejects.toThrowError('DELETE_REPLY_USE_CASE.REPLY_NOT_VALID');
  });

  it('should throw error when the given userId is not the owner of this reply', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-f3298hsdvzvcnzmn2',
      commentId: 'comment-fh907147hhsdzo7',
      replyId: 'reply-fj2398jsdnvczvnqjui',
      userId: 'user-zxcvz9v2zvwavadsvcvv2',
    };

    // creating dependency of use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    // mocking needed function
    mockThreadRepository.isThreadValid = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockCommentRepository.isCommentValid = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockReplyRepository.isReplyValid = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockReplyRepository.doesThisUserIdOwnThisReply = jest.fn()
      .mockImplementation(() => Promise.resolve(false));
    mockReplyRepository.deleteReply = jest.fn()
      .mockImplementation(() => Promise.resolve({
        status: 'success',
      }));

    // creating use case instance
    const deleteReplyUseCase = new DeleteReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action and Assert
    expect(deleteReplyUseCase.execute(useCasePayload)).rejects.toThrowError('DELETE_REPLY_USE_CASE.NOT_REPLY_OWNER');
  });

  it('should orchestrating delete comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-f3298hsdvzvcnzmn2',
      commentId: 'comment-fh907147hhsdzo7',
      replyId: 'reply-fj2398jsdnvczvnqjui',
      userId: 'user-zxcvz9v2zvwavadsvcvv2',
    };

    // creating dependency of use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    // mocking needed function
    mockThreadRepository.isThreadValid = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockCommentRepository.isCommentValid = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockReplyRepository.isReplyValid = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockReplyRepository.doesThisUserIdOwnThisReply = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockReplyRepository.deleteReply = jest.fn()
      .mockImplementation(() => Promise.resolve({
        status: 'success',
      }));

    // creating use case instance
    const deleteReplyUseCase = new DeleteReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const deleteReply = await deleteReplyUseCase.execute(useCasePayload);

    // Assert
    expect(deleteReply).toStrictEqual({
      status: 'success',
    });
    expect(mockReplyRepository.deleteReply).toBeCalledWith(useCasePayload.replyId);
  });
});
