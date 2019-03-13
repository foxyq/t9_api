const app = require('./app');

const port = process.env.PORT || 8082;

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.warn(`Server up and running, magic happens on port ${port}`);
  });
}

module.exports = app;
