const express = require("express");
const router = express.Router();
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const readline = require("readline");
const port = process.env.PORT || 8082;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

router.post("/numbers", (req, res) => {
  const numbers = req.body.numbers;

  const suggestions = getSuggestions(numbers);
  const words = searchForWords(suggestions);

  console.log("words", words);

  res.json({ suggestions, words });
});

// all of our routes will be prefixed with /api
app.use("/api", router);

// search for word (from suggestions) in dictionary
// dictionary from UNIX's cat /usr/share/dict/words > words.txt
function searchForWords(suggestions = []) {
  const dictWords = [];
  const options = fs.readFileSync("./words.txt", "utf8").split("\n");

  options.forEach(option => {
    suggestions.forEach(suggestion => {
      if (suggestion === option) {
        dictWords.push(option);
      }
    });
  });

  return dictWords;
}

function getSuggestions(number) {
  const suggestions = [];

  numberToChars(number);

  function numberToChars(word, letter = "", final = "") {
    const keypad = [
      [" "], // 0
      [".", ",", "!", "?"], // 1
      ["a", "b", "c"], // 2
      ["d", "e", "f"], // 3
      ["g", "h", "i"], // 4
      ["j", "k", "l"], // 5
      ["m", "n", "o"], // 6
      ["p", "q", "r", "s"], // 7
      ["t", "u", "v"], // 8
      ["w", "x", "y", "z"] // 9
    ];

    // if letter !empty (we're not done) add letter to the final word
    if (letter !== "") {
      final += letter;
    }

    // if we're done / there are no more letters in the word
    if (word === "") {
      console.log(final);
      suggestions.push(final);
      return final;
    } else {
      // we're not done
      // parsing the input
      const firstDigit = word[0];
      word = word.substr(1);

      switch (firstDigit) {
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
        case "0":
          for (let i = 0; i < keypad[firstDigit].length; i++) {
            letter = keypad[firstDigit][i];
            numberToChars(word, letter, final);
          }
        default:
          // do nothing
          break;
      }
    }
  }

  return suggestions;
}

app.listen(port);
console.log("Magic happens on port " + port);
