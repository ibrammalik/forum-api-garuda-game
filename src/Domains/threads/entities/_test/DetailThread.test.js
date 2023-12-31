const DetailThread = require('../DetailThread');

describe('a DetailThread entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      // id: 'thread-jf298j3282j39',
      // title: 'A Thread Title',
      // body: 'A Thread Body',
      // date: '2021-08-08T07:59:16.198Z',
      // username: 'dicoding',
      comments: [],
    };

    // Action and Assert
    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: {},
      title: {},
      body: 2535,
      date: 29065,
      username: true,
      comments: [],
    };

    // Action and Assert
    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create detailThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-jf298j3282j39',
      title: 'A Thread Title',
      body: 'A Thread Body',
      date: '2021-08-08T07:59:16.198Z',
      username: 'dicoding',
      comments: [],
    };

    // Action
    const detailThread = new DetailThread(payload);

    // Assert
    expect(detailThread.id).toEqual(payload.id);
    expect(detailThread.title).toEqual(payload.title);
    expect(detailThread.body).toEqual(payload.body);
    expect(detailThread.date).toEqual(payload.date);
    expect(detailThread.username).toEqual(payload.username);
    expect(detailThread.comments).toEqual(payload.comments);
  });
});
