const AuthorizationError = require('./AuthorizationError');
const InvariantError = require('./InvariantError');
const NotFoundError = require('./NotFoundError');

const DomainErrorTranslator = {
  translate(error) {
    return DomainErrorTranslator._directories[error.message] || error;
  },
};

DomainErrorTranslator._directories = {
  'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'),
  'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat user baru karena tipe data tidak sesuai'),
  'REGISTER_USER.USERNAME_LIMIT_CHAR': new InvariantError('tidak dapat membuat user baru karena karakter username melebihi batas limit'),
  'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': new InvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang'),
  'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('harus mengirimkan username dan password'),
  'USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('username dan password harus string'),
  'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
  'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),
  'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
  'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),
  'NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada'),
  'NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat thread baru karena tipe data tidak sesuai'),
  'NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada'),
  'NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat comment baru karena tipe data tidak sesuai'),
  'ADD_COMMENT_USE_CASE.THREAD_NOT_VALID': new NotFoundError('tidak dapat membuat comment baru karena thread tidak valid'),
  'DELETE_COMMENT_USE_CASE.THREAD_NOT_VALID': new NotFoundError('tidak dapat menghapus comment karena thread tidak valid'),
  'DELETE_COMMENT_USE_CASE.COMMENT_NOT_VALID': new NotFoundError('tidak dapat menghapus comment karena comment tidak valid'),
  'DELETE_COMMENT_USE_CASE.NOT_COMMENT_OWNER': new AuthorizationError('tidak dapat menghapus comment karena bukan pemilik comment'),
  'NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat reply baru karena properti yang dibutuhkan tidak ada'),
  'NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat reply baru karena tipe data tidak sesuai'),
  'ADD_REPLY_USE_CASE.THREAD_NOT_VALID': new NotFoundError('tidak dapat membuat reply baru karena thread tidak valid'),
  'ADD_REPLY_USE_CASE.COMMENT_NOT_VALID': new NotFoundError('tidak dapat membuat reply baru karena comment tidak valid'),
  'DELETE_REPLY_USE_CASE.THREAD_NOT_VALID': new NotFoundError('tidak dapat menghapus reply karena thread tidak valid'),
  'DELETE_REPLY_USE_CASE.COMMENT_NOT_VALID': new NotFoundError('tidak dapat menghapus reply karena comment tidak valid'),
  'DELETE_REPLY_USE_CASE.REPLY_NOT_VALID': new NotFoundError('tidak dapat menghapus reply karena reply tidak valid'),
  'DELETE_REPLY_USE_CASE.NOT_REPLY_OWNER': new AuthorizationError('tidak dapat menghapus reply karena bukan pemilik reply'),
  'GET_THREAD_DETAIL_USE_CASE.THREAD_NOT_VALID': new NotFoundError('tidak dapat menemukan thread'),
  'LIKE_COMMENT_USE_CASE.THREAD_NOT_VALID': new NotFoundError('tidak dapat like / cancel like comment karena thread tidak valid'),
  'LIKE_COMMENT_USE_CASE.COMMENT_NOT_VALID': new NotFoundError('tidak dapat like / cancel like comment karena comment tidak valid'),
};

module.exports = DomainErrorTranslator;
