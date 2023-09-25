const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const LikeCommentUseCase = require('../LikeCommentUseCase');

describe('LikeCommentUseCase', () => {
  it('should orchestrating like comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-jf930082j98h2983h2fh8',
      commentId: 'comment-fj938j2938j238j23f9',
      userId: 'user-jf932j8293jf9382jf',
    };

    // creating dependency of use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    // mocking needed function
    mockThreadRepository.isThreadValid = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockCommentRepository.isCommentValid = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockLikeRepository.doesThisUserLikesThisComment = jest.fn()
      .mockImplementation(() => Promise.resolve(false));
    mockLikeRepository.likeComment = jest.fn()
      .mockImplementation(() => Promise.resolve({ status: 'success' }));

    // creating use case instance
    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    const likeComment = await likeCommentUseCase.execute(useCasePayload);

    // Assert
    expect(likeComment).toStrictEqual({ status: 'success' });
    expect(mockLikeRepository.likeComment).toBeCalledWith({
      commentId: useCasePayload.commentId,
      userId: useCasePayload.userId,
    });
  });

  it('should throw error when thread is not valid', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-jf930082j98h2983h2fh8',
      commentId: 'comment-fj938j2938j238j23f9',
      userId: 'user-jf932j8293jf9382jf',
    };

    // creating dependency of use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    // mocking needed function
    mockThreadRepository.isThreadValid = jest.fn()
      .mockImplementation(() => Promise.resolve(false));
    mockCommentRepository.isCommentValid = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockLikeRepository.doesThisUserLikesThisComment = jest.fn()
      .mockImplementation(() => Promise.resolve(false));
    mockLikeRepository.likeComment = jest.fn()
      .mockImplementation(() => Promise.resolve({ status: 'success' }));

    // creating use case instance
    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action and Assert
    expect(likeCommentUseCase.execute(useCasePayload)).rejects.toThrowError('LIKE_COMMENT_USE_CASE.THREAD_NOT_VALID');
  });

  it('should throw error when thread is not comment', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-jf930082j98h2983h2fh8',
      commentId: 'comment-fj938j2938j238j23f9',
      userId: 'user-jf932j8293jf9382jf',
    };

    // creating dependency of use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    // mocking needed function
    mockThreadRepository.isThreadValid = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockCommentRepository.isCommentValid = jest.fn()
      .mockImplementation(() => Promise.resolve(false));
    mockLikeRepository.doesThisUserLikesThisComment = jest.fn()
      .mockImplementation(() => Promise.resolve(false));
    mockLikeRepository.likeComment = jest.fn()
      .mockImplementation(() => Promise.resolve({ status: 'success' }));

    // creating use case instance
    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action and Assert
    expect(likeCommentUseCase.execute(useCasePayload)).rejects.toThrowError('LIKE_COMMENT_USE_CASE.COMMENT_NOT_VALID');
  });
});
