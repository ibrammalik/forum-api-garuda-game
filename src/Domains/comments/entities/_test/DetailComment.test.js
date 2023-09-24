const DetailComment = require('../DetailComment');

describe('a DetailComment entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-f298fj23899j238f',
      username: 'dicoding',
      date: '2021-08-08T07:59:18.982Z',
      replies: [],
      content: 'A Comment Content',
      likeCount: 5,
      // isDeleted: false
    };

    // Action and Assert
    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: {},
      username: 8347289432,
      date: false,
      replies: false,
      content: 'A Comment Content',
      likeCount: 5,
      isDeleted: false,
    };

    // Action and Assert
    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create detailComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-f298fj23899j238f',
      username: 'dicoding',
      date: '2021-08-08T07:59:18.982Z',
      replies: [],
      content: 'A Comment Content',
      likeCount: 5,
      isDeleted: false,
    };

    // Action
    const detailComment = new DetailComment(payload);

    // Assert
    expect(detailComment.id).toEqual(payload.id);
    expect(detailComment.username).toEqual(payload.username);
    expect(detailComment.date).toEqual(payload.date);
    expect(detailComment.replies).toEqual(payload.replies);
    expect(detailComment.content).toEqual(payload.content);
    expect(detailComment.likeCount).toEqual(payload.likeCount);
  });
});
