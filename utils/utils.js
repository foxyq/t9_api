const fs = require('fs');

const keypad = [
  [' '], // 0
  ['.', ',', '!', '?'], // 1
  ['a', 'b', 'c'], // 2
  ['d', 'e', 'f'], // 3
  ['g', 'h', 'i'], // 4
  ['j', 'k', 'l'], // 5
  ['m', 'n', 'o'], // 6
  ['p', 'q', 'r', 's'], // 7
  ['t', 'u', 'v'], // 8
  ['w', 'x', 'y', 'z'] // 9
];

function loadDictfromFile(path) {
  try {
    const dict = new Set();

    fs.readFileSync(path)
      .toString()
      .split('\n')
      .forEach((line, index, arr) => {
        if (index === arr.length - 1 && line === '') {
          return;
        }
        dict.add(line);
      });

    return dict;
  } catch (e) {
    throw new Error('no such file');
  }
}

function getSuggestions(numberKey) {
  const suggestions = [];

  const numberToChars = (word, letter = '', final = '') => {
    // if letter !empty (we're not done) add letter to the final word
    let result = final;
    if (letter !== '') {
      result += letter;
    }

    // if we're done / there are no more letters in the word
    if (word === '') {
      suggestions.push(result);
      return result;
    }

    const firstDigit = word[0];
    const rest = word.substr(1);

    if (firstDigit >= 0 && firstDigit <= 9) {
      for (let i = 0; i < keypad[firstDigit].length; i += 1) {
        const newLetter = keypad[firstDigit][i];
        numberToChars(rest, newLetter, result);
      }
    }

    return null;
  };

  if (Number.isInteger(numberKey)) {
    return '';
  }

  numberToChars(numberKey);

  return suggestions;
}

function searchForWords(suggestions = [], dictionary) {
  const dictWords = [];

  dictionary.forEach(option => {
    suggestions.forEach(suggestion => {
      if (suggestion === option) {
        dictWords.push(option);
      }
    });
  });

  return dictWords;
}

module.exports = {
  getSuggestions,
  searchForWords,
  loadDictfromFile
};
