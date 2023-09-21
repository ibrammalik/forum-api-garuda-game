const NewComment = require('../NewComment');

describe('a NewComment entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      // threadId: 'thread-sodfh239sd8f',
      // userId: 'user-oisdhf98hs9dj32',
      content: 'A comment content',
    };

    // Action and Assert
    expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      threadId: 12334,
      userId: {},
      content: true,
    };

    // Action and Assert
    expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create newThread object correctly', () => {
    // Arrange
    const payload = {
      threadId: 'thread-sodfh239sd8f',
      userId: 'user-oisdhf98hs9dj32',
      content: 'A comment content',
    };

    // Action
    const newComment = new NewComment(payload);

    // Assert
    expect(newComment.threadId).toEqual(payload.threadId);
    expect(newComment.userId).toEqual(payload.userId);
    expect(newComment.content).toEqual(payload.content);
  });
});
