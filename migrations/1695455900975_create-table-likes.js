exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('likes', {
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    comment_id: {
      type: 'VARCHAR(50)',
    },
  });

  pgm.addConstraint('likes', 'fk_likes.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');

  pgm.addConstraint('likes', 'fk_likes.comment_id_comments.id', 'FOREIGN KEY(comment_id) REFERENCES comments(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropTable('likes');

  pgm.dropConstraint('likes', 'fk_likes.owner_users.id');

  pgm.dropConstraint('likes', 'fk_likes.comment_id_comments.id');
};
