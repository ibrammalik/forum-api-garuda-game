const AddedComment = require('../AddedComment');

describe('a AddedComment entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      // id: 'comment-shozcxduf93h98sd',
      // content: 'A Comment Content',
      owner: 'user-cmnv9snvcsdjl',
    };

    // Action and Assert
    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
  // Arrange
    const payload = {
      id: {},
      content: 8457034,
      owner: true,
    };

    // Action and Assert
    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create addedComment object correctly', () => {
  // Arrange
    const payload = {
      id: 'comment-shozcxduf93h98sd',
      content: 'A Comment Content',
      owner: 'user-cmnv9snvcsdjl',
    };

    // Action
    const addedComment = new AddedComment(payload);

    // Assert
    expect(addedComment.id).toEqual(payload.id);
    expect(addedComment.content).toEqual(payload.content);
    expect(addedComment.owner).toEqual(payload.owner);
  });
});
