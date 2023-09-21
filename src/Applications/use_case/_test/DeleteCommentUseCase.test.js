const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should throw error when thread is not valid', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-hf9282892fj8928fj',
    };

    // creating dependency of use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    // mocking needed function
    mockThreadRepository.isThreadValid = jest.fn()
      .mockImplementation(() => Promise.resolve(false));
    mockCommentRepository.isCommentValid = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockCommentRepository.doesThisUserIdOwnThisComment = jest.fn()
      .mockImplementation(() => Promise.resolve(true));

    // creating use case instance
    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action and Assert
    expect(deleteCommentUseCase.execute(useCasePayload)).rejects.toThrowError('DELETE_COMMENT_USE_CASE.THREAD_NOT_VALID');
  });

  it('should throw error when comment is not valid', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-hf9282892fj8928fj',
    };

    // creating dependency of use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    // mocking needed function
    mockThreadRepository.isThreadValid = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockCommentRepository.isCommentValid = jest.fn()
      .mockImplementation(() => Promise.resolve(false));
    mockCommentRepository.doesThisUserIdOwnThisComment = jest.fn()
      .mockImplementation(() => Promise.resolve(true));

    // creating use case instance
    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action and Assert
    expect(deleteCommentUseCase.execute(useCasePayload)).rejects.toThrowError('DELETE_COMMENT_USE_CASE.COMMENT_NOT_VALID');
  });

  it('should throw error when the given userId is not the owner of this comment', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-hf9282892fj8928fj',
    };

    // creating dependency of use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    // mocking needed function
    mockThreadRepository.isThreadValid = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockCommentRepository.isCommentValid = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockCommentRepository.doesThisUserIdOwnThisComment = jest.fn()
      .mockImplementation(() => Promise.resolve(false));

    // creating use case instance
    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action and Assert
    expect(deleteCommentUseCase.execute(useCasePayload)).rejects.toThrowError('DELETE_COMMENT_USE_CASE.NOT_COMMENT_OWNER');
  });

  it('should orchestrating delete comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      commentId: 'comment-sdhisfuh89h32f3',
      userId: 'user-ha0s9d8fh289fh823',
      threadId: 'thread-f982h1h2948h',
    };

    // creating dependency of use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    // mocking needed function
    mockThreadRepository.isThreadValid = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockCommentRepository.isCommentValid = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockCommentRepository.doesThisUserIdOwnThisComment = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockCommentRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve({
        status: 'success',
      }));

    // creating use case instance
    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const deleteComment = await deleteCommentUseCase.execute(useCasePayload);

    // Assert
    expect(deleteComment).toStrictEqual({
      status: 'success',
    });
    expect(mockCommentRepository.deleteComment).toBeCalledWith(useCasePayload.commentId);
  });
});
