var express = require("express"); // call express
var app = express(); // define our app using express
var bodyParser = require("body-parser");

var results = [];

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8082; // set our port

// =============================================================================
var router = express.Router(); // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  // get for /api/ test ... post for /api/numbers
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:PORT/api)
router.get("/", function(req, res) {
  res.json({ message: "hooray! we're online!" });
});

// ----------------------------------------------------
router.route("/numbers").post(function(req, res) {
  // debugging logs
  // console.log("\n -- /api/numbers call");
  // console.log(" ---- with parameter " + req.body.numbers);

  // parse input to words, save in global var results
  charFromNumbers(req.body.numbers);

  for (let i = 0; i < results.length; i++) {
    searchForWord(results[i]);
    // console.log(results);
  }

  res.json({
    message: "Parsing number input as T9. Input: " + req.body.numbers
  });
});

// all of our routes will be prefixed with /api
app.use("/api", router);

// custom functions
function searchForWord(searchString) {
  var readline = require("readline");
  var fs = require("fs");

  var myInterface = readline.createInterface({
    input: fs.createReadStream("./words.txt")
  });

  var lineno = 0;
  myInterface.on("line", function(line) {
    lineno++;
    if (line === searchString)
      console.log("Line number " + lineno + ": " + line);
  });

  // OLD CODE - returns index of substring (e.g. returns "clothes" when searching for "the")
  // fs.readFile("./words.txt", function(err, content) {
  //   if (err) throw err;
  //   console.log(
  //     content.indexOf(searchString) > -1
  //       ? "DICTIONARY WORD: " + searchString
  //       : null
  //   );
  // });
}

function charFromNumbers(word, letter = "", final = "") {
  const keypad = [
    [" "],
    [".", ",", "!", "?"],
    ["a", "b", "c"],
    ["d", "e", "f"],
    ["g", "h", "i"],
    ["j", "k", "l"],
    ["m", "n", "o"],
    ["p", "q", "r", "s"],
    ["t", "u", "v"],
    ["w", "x", "y", "z"]
  ];

  // console.log("INPUT = word: " + word + ", letter: " + letter);

  // if letter !empty (we're not done) add letter to the word
  if (letter != "") {
    final += letter;
  }

  // if we're done / no more letters in the word
  if (word === "") {
    console.log(final);
    results.push(final);
    return;
  } else {
    // we're not done
    // parsing the input
    // get first digit & shorten the word off of it
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
          charFromNumbers(word, letter, final);
        }
      default:
        // do nothing
        break;
    }
  }
}

// START THE SERVER
app.listen(port);
// FYI, can be handy
console.log("Magic happens on port " + port);

// "stupid" solution v1 - redone to keypad + universal switch

// const zero = [" "];
// const one = [".", ",", "!", "?"];
// const two = ["a", "b", "c"];
// const three = ["d", "e", "f"];
// const four = ["g", "h", "i"];
// const five = ["j", "k", "l"];
// const six = ["m", "n", "o"];
// const seven = ["p", "q", "r", "s"];
// const eight = ["t", "u", "v"];
// const nine = ["w", "x", "y", "z"];

// case "1":
//   for (let i = 0; i < one.length; i++) {
//     letter = one[i];
//     charFromNumbers(word, letter, final);
//   }
//   break;

// case "2":
//   for (let i = 0; i < two.length; i++) {
//     letter = two[i];
//     charFromNumbers(word, letter, final);
//   }
//   break;
// case "3":
//   for (let i = 0; i < three.length; i++) {
//     letter = three[i];
//     charFromNumbers(word, letter, final);
//   }
//   break;
// case "4":
//   for (let i = 0; i < four.length; i++) {
//     letter = four[i];
//     charFromNumbers(word, letter, final);
//   }
// case "5":
//   for (let i = 0; i < five.length; i++) {
//     letter = five[i];
//     charFromNumbers(word, letter, final);
//   }
//   break;
// case "6":
//   for (let i = 0; i < six.length; i++) {
//     letter = six[i];
//     charFromNumbers(word, letter, final);
//   }
//   break;
// case "7":
//   for (let i = 0; i < seven.length; i++) {
//     letter = seven[i];
//     charFromNumbers(word, letter, final);
//   }
//   break;
// case "8":
//   for (let i = 0; i < eight.length; i++) {
//     letter = eight[i];
//     charFromNumbers(word, letter, final);
//   }
//   break;
// case "9":
//   for (let i = 0; i < nine.length; i++) {
//     letter = nine[i];
//     charFromNumbers(word, letter, final);
//   }
// case "0":
//   for (let i = 0; i < zero.length; i++) {
//     letter = zero[i];
//     charFromNumbers(word, letter, final);
//   }
// break;
