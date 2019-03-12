const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const { getSuggestions, searchForWords, loadDictfromFile } = require('./utils');

const router = express.Router();
const port = process.env.PORT || 8082;
const app = express();

const dictionary = loadDictfromFile('./words.txt');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

router.post('/numbers', (req, res) => {
  const { numbers } = req.body;
  const suggestions = getSuggestions(numbers);
  const words = searchForWords(suggestions, dictionary);

  res.json({ suggestions, words });
});

app.use('/api', router);

app.listen(port);
console.warn(`Server up and running, magic happens on port ${port}`);
