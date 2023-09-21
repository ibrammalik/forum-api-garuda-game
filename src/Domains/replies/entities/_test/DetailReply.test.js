const DetailReply = require('../DetailReply');

describe('a DetailReply entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'reply-f298fj23899j238f',
      content: 'A Reply Content',
      date: '2021-08-08T07:59:18.982Z',
      username: 'dicoding',
      // isDeleted: false
    };

    // Action and Assert
    expect(() => new DetailReply(payload)).toThrowError('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: {},
      content: 'A Reply Content',
      date: false,
      username: 8347289432,
      isDeleted: false,
    };

    // Action and Assert
    expect(() => new DetailReply(payload)).toThrowError('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create detailReply object correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-f298fj23899j238f',
      content: 'A Reply Content',
      date: '2021-08-08T07:59:18.982Z',
      username: 'dicoding',
      isDeleted: true,
    };

    // Action
    const detailReply = new DetailReply(payload);

    // Assert
    expect(detailReply.id).toEqual(payload.id);
    expect(detailReply.content).toEqual('**balasan telah dihapus**');
    expect(detailReply.date).toEqual(payload.date);
    expect(detailReply.username).toEqual(payload.username);
  });
});
