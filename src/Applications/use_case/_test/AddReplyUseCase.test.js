const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const AddReplyUseCase = require('../AddReplyUseCase');
const NewReply = require('../../../Domains/replies/entities/NewReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');

describe('AddReplyUseCase', () => {
  it('should orchestrating add reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-jf9238j29fj8zdsd',
      commentId: 'comment-fj13981jf2398j23',
      userId: 'user-zzmoavmv80we',
      content: 'A Reply Content',
    };

    const mockAddedReply = new AddedReply({
      id: 'reply-f9382j892fj39j239',
      content: useCasePayload.content,
      owner: useCasePayload.userId,
    });

    // creating dependency of use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    // mocking needed function
    mockThreadRepository.isThreadValid = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockCommentRepository.isCommentValid = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockReplyRepository.addReply = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedReply));

    // creating use case instance
    const addReplyUseCase = new AddReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const addedReply = await addReplyUseCase.execute(useCasePayload);

    // Assert
    expect(addedReply).toStrictEqual(new AddedReply({
      id: 'reply-f9382j892fj39j239',
      content: useCasePayload.content,
      owner: useCasePayload.userId,
    }));
    expect(mockReplyRepository.addReply).toBeCalledWith(new NewReply({
      commentId: useCasePayload.commentId,
      userId: useCasePayload.userId,
      content: useCasePayload.content,
    }));
  });
});
