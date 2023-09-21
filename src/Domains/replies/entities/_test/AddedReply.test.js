const AddedReply = require('../AddedReply');

describe('a AddedReply entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      // id: 'reply-shozcxduf93h98sd',
      // content: 'A Reply Content',
      owner: 'user-cmnv9snvcsdjl',
    };

    // Action and Assert
    expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
  // Arrange
    const payload = {
      id: {},
      content: 8457034,
      owner: true,
    };

    // Action and Assert
    expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create addedReply object correctly', () => {
  // Arrange
    const payload = {
      id: 'reply-shozcxduf93h98sd',
      content: 'A Reply Content',
      owner: 'user-cmnv9snvcsdjl',
    };

    // Action
    const addedReply = new AddedReply(payload);

    // Assert
    expect(addedReply.id).toEqual(payload.id);
    expect(addedReply.content).toEqual(payload.content);
    expect(addedReply.owner).toEqual(payload.owner);
  });
});
