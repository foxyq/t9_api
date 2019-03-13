const { getSuggestions, searchForWords, loadDictfromFile } = require('./utils');

describe('loadDictFromFile ', () => {
  test('throw error on non existing file', () => {
    const nonExistingFile = './path/is/not/real';
    try {
      loadDictfromFile(nonExistingFile);
    } catch (e) {
      expect(e.message).toEqual('no such file');
    }
  });

  test('succesfully loads and parses file', () => {
    const file = './utils/words.txt';

    expect(loadDictfromFile(file)).toContain('fox');
    expect(loadDictfromFile(file)).toContain('dawn');
    expect(loadDictfromFile(file)).toContain('mouse');
    expect(loadDictfromFile(file)).toContain('Zyzzogeton');
  });
});

describe('getSuggestions', () => {
  test('returns correct suggestions on string input', () => {
    const sugs = [
      ['0', [' ']],
      ['1', ['.', ',', '!', '?']],
      ['2', ['a', 'b', 'c']],
      ['3', ['d', 'e', 'f']],
      ['4', ['g', 'h', 'i']],
      ['5', ['j', 'k', 'l']],
      ['6', ['m', 'n', 'o']],
      ['7', ['p', 'q', 'r', 's']],
      ['8', ['t', 'u', 'v']],
      ['9', ['w', 'x', 'y', 'z']],
      ['36', ['dm', 'dn', 'do', 'em', 'en', 'eo', 'fm', 'fn', 'fo']],
      ['', ['']]
    ];

    sugs.forEach(sug => {
      expect(getSuggestions(sug[0])).toEqual(sug[1]);
    });
  });

  test('returns empty string on integer input', () => {
    const sugs = [[0, ''], [1, ''], [456, ''], [232, '']];

    sugs.forEach(sug => {
      expect(getSuggestions(sug[0])).toEqual(sug[1]);
    });
  });
});

describe('searchForWords', () => {
  test('returns empty dictionary on no match', () => {
    const dictionary = ['a', 'b', 'c', 'd'];
    const sugs = ['x'];

    expect(searchForWords(sugs, dictionary)).toEqual([]);
  });

  test('returns dictionary on correct match', () => {
    const dictionary = ['a', 'b', 'c', 'd'];
    const suggestions = ['b', 'd'];

    expect(searchForWords(suggestions, dictionary)).toEqual(suggestions);
  });

  test('returns empty with empty dictionary', () => {
    const dictionary = [];
    const suggestions = ['b', 'd'];

    expect(searchForWords(suggestions, dictionary)).toEqual(dictionary);
  });
});
