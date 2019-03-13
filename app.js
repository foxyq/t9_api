const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const {
  getSuggestions,
  searchForWords,
  loadDictfromFile
} = require('./utils/utils');

const app = express();

const dictionary = loadDictfromFile('./utils/words.txt');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.post('/api/numbers', (req, res) => {
  const { numbers } = req.body;
  const suggestions = getSuggestions(numbers);
  const words = searchForWords(suggestions, dictionary);

  res.status(200).json({ suggestions, words });
});

module.exports = app;
