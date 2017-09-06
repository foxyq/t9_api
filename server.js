var express = require("express");
var app = express();
var bodyParser = require("body-parser");

// configure app to use bodyParser() for data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8082; // set our port
var router = express.Router(); // get an instance of the express Router

// variables for results suggestions and dictionary words
var results = [];
var dictWords = [];

// middleware to use for all requests
router.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  // get for /api/ test ... post for /api/numbers
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  next(); // make sure we go to the next routes and don't stop here
});
// ------------------------------------- end of SETTINGS

// ------------------------------------- ROUTES
// test route to make sure everything is working
// (accessed at GET http://localhost:PORT/api)
router.get("/", function(req, res) {
  res.json({
    message: "hooray! we're online!",
    words: dictWords
  });
});

router.route("/numbers").post(function(req, res) {
  // parse input to words, save in global var results
  // check if input is not empty
  // frontend will validate NUMBER ONLY input
  results = [];
  dictWords = [];

  if (req.body.numbers !== "") {
    numberToChars(req.body.numbers);

    searchForWords(results);

    // async ? ?? ?? ?  ---------------------------------------------
    res.setHeader("Content-Type", "application/json");
    res.json({
      // JSON with 1) suggestions 2) dict words
      // message: "Parsed number " + req.body.numbers + " as T9 Input ",
      suggestions: results,
      words: dictWords
    });
  } else res.json({ message: "Empty input" });
});

// all of our routes will be prefixed with /api
app.use("/api", router);
// ------------------------------------- end of ROUTES

// ------------------------------------- FUNCTIONS for logic

// search for word (from suggestions) in dictionary
// dictionary from UNIX's cat /usr/share/dict/words > words.txt
function searchForWords(suggestions) {
  var readline = require("readline");
  var fs = require("fs");

  var myInterface = readline.createInterface({
    input: fs.createReadStream("./words.txt")
  });

  var lineno = 0;
  myInterface.on("line", function(line) {
    lineno++;

    // check each item from list of suggestions agains dictionary file
    for (let i = 0; i < suggestions.length; i++) {
      // match found => is strictly equal (length + content)
      if (line === suggestions[i]) {
        console.log("Line number " + lineno + ": " + line);
        dictWords.push(line);
        // console.log(dictWords);
      }
    }
  });
}

// convert numbers (input) to chars
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
  if (letter != "") {
    final += letter;
  }

  // if we're done / there are no more letters in the word
  if (word === "") {
    console.log(final);
    results.push(final);
    return;
  } else {
    // we're not done
    // parsing the input
    const firstDigit = word[0];
    word = word.substr(1);

    // debugging logs
    // console.log("######## ENTNERING CYCLE ##########");
    // console.log("first digit: " + firstDigit + ", substracted word: ", word);

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
// ------------------------------------- end of FUNCTIONS

// START THE SERVER
app.listen(port);
// port FYI, can be handy
console.log("Magic happens on port " + port);
