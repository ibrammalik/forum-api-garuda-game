const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const DetailReply = require('../../../Domains/replies/entities/DetailReply');
const LikeRepository = require('../../../Domains/likes/LikeRepository');

describe('GetThreadDetailUseCase', () => {
  it('should throw error when thread is not valid', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-hf9282892fj8928fj',
    };

    // creating dependency of use case
    const mockThreadRepository = new ThreadRepository();

    // mocking needed function
    mockThreadRepository.isThreadValid = jest.fn()
      .mockImplementation(() => Promise.resolve(false));

    // creating use case instance
    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action and Assert
    expect(getThreadDetailUseCase.execute(useCasePayload)).rejects.toThrowError('GET_THREAD_DETAIL_USE_CASE.THREAD_NOT_VALID');
  });

  it('should orchestrating the get thread detail action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-hf9282892fj8928fj',
    };

    const mockThreadComments = [
      {
        id: 'comment-_pby2_tmXV6bcvcdev8xk',
        username: 'johndoe',
        date: '2021-08-08T07:22:33.555Z',
        replies: [],
        content: 'sebuah comment',
        isDeleted: false,
      },
      {
        id: 'comment-yksuCoxM2s4MMrZJO-qVD',
        username: 'dicoding',
        date: '2021-08-08T07:26:21.338Z',
        replies: [],
        content: 'sebuah comment',
        isDeleted: true,
      },
    ];

    const mockCommentReplies = [
      {
        id: 'reply-hd392h3928',
        username: 'johndoe',
        date: '2021-08-08T07:22:33.555Z',
        content: 'sebuah reply',
        isDeleted: false,
        commentId: 'comment-_pby2_tmXV6bcvcdev8xk',
      },
      {
        id: 'reply-f91hf912fh8910fh',
        username: 'dicoding',
        date: '2023-08-08T07:22:33.555Z',
        content: 'sebuah reply',
        isDeleted: false,
        commentId: 'comment-yksuCoxM2s4MMrZJO-qVD',
      },
    ];

    const mockDetailThread = {
      id: 'thread-hf9282892fj8928fj',
      title: 'A Thread Title',
      body: 'A Thread Body',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
      comments: [],
    };

    const mockLikeCommentCount = (commentId) => {
      if (commentId === 'comment-_pby2_tmXV6bcvcdev8xk') return Promise.resolve(5);
      if (commentId === 'comment-yksuCoxM2s4MMrZJO-qVD') return Promise.resolve(10);
      return Promise.resolve(0);
    };

    // creating dependency of use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockLikeRepository = new LikeRepository();

    // mocking needed function
    mockThreadRepository.isThreadValid = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThreadComments));
    mockReplyRepository.getRepliesByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockCommentReplies));
    mockThreadRepository.getDetailThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockDetailThread));
    mockLikeRepository.likeCommentCount = jest.fn()
      .mockImplementation(mockLikeCommentCount);

    // creating use case instance
    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    const detailThread = await getThreadDetailUseCase.execute(useCasePayload);

    // Assert
    expect(detailThread).toStrictEqual(new DetailThread({
      id: 'thread-hf9282892fj8928fj',
      title: 'A Thread Title',
      body: 'A Thread Body',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
      comments: [
        new DetailComment({
          id: 'comment-_pby2_tmXV6bcvcdev8xk',
          username: 'johndoe',
          date: '2021-08-08T07:22:33.555Z',
          replies: [
            new DetailReply({
              id: 'reply-hd392h3928',
              username: 'johndoe',
              date: '2021-08-08T07:22:33.555Z',
              content: 'sebuah reply',
              isDeleted: false,
            }),
          ],
          content: 'sebuah comment',
          isDeleted: false,
          likeCount: 5,
        }),
        new DetailComment({
          id: 'comment-yksuCoxM2s4MMrZJO-qVD',
          username: 'dicoding',
          date: '2021-08-08T07:26:21.338Z',
          replies: [
            new DetailReply({
              id: 'reply-f91hf912fh8910fh',
              username: 'dicoding',
              date: '2023-08-08T07:22:33.555Z',
              content: 'sebuah reply',
              isDeleted: false,
            }),
          ],
          content: 'sebuah comment',
          isDeleted: true,
          likeCount: 10,
        }),
      ],
    }));
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(mockDetailThread.id);
    expect(mockThreadRepository.getDetailThread).toBeCalledWith(mockDetailThread.id);
  });
});
