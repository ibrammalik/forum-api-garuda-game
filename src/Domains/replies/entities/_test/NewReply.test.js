const NewReply = require('../NewReply');

describe('a NewReply entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      // commentId: 'comment-hf9fh8923hf23h',
      // userId: 'user-oisdhf98hs9dj32',
      content: 'A reply content',
    };

    // Action and Assert
    expect(() => new NewReply(payload)).toThrowError('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      commentId: 12345,
      userId: {},
      content: true,
    };

    // Action and Assert
    expect(() => new NewReply(payload)).toThrowError('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create newReply object correctly', () => {
    // Arrange
    const payload = {
      commentId: 'comment-hf9fh8923hf23h',
      userId: 'user-oisdhf98hs9dj32',
      content: 'A reply content',
    };

    // Action
    const newReply = new NewReply(payload);

    // Assert
    expect(newReply.commentId).toEqual(payload.commentId);
    expect(newReply.userId).toEqual(payload.userId);
    expect(newReply.content).toEqual(payload.content);
  });
});
