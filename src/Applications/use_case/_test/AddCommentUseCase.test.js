const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddCommentUseCase = require('../AddCommentUseCase');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');

describe('AddCommentUseCase', () => {
  it('should orchestrating add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-sdhjs983h2983h32',
      userId: 'user-osd9h329n2938hg',
      content: 'A Comment Content',
    };

    const mockAddedComment = new AddedComment({
      id: 'comment-hsidh8sh723932h',
      content: useCasePayload.content,
      owner: useCasePayload.userId,
    });

    // creating dependency of use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    // mocking needed function
    mockThreadRepository.isThreadValid = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedComment));

    // creating use case instance
    const addCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const addedComment = await addCommentUseCase.execute(useCasePayload);

    // Assert
    expect(addedComment).toStrictEqual(new AddedComment({
      id: 'comment-hsidh8sh723932h',
      content: useCasePayload.content,
      owner: useCasePayload.userId,
    }));
    expect(mockCommentRepository.addComment).toBeCalledWith(new NewComment({
      threadId: useCasePayload.threadId,
      userId: useCasePayload.userId,
      content: useCasePayload.content,
    }));
  });
});
