const RepliesHanlder = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'replies',
  register: async (server, { container }) => {
    const repliesHanlder = new RepliesHanlder(container);
    server.route(routes(repliesHanlder));
  },
};
