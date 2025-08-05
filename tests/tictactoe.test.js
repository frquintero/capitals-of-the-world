const { checkWinBoard, checkDrawBoard } = require('../script');

describe('checkWinBoard', () => {
  test('detects row win', () => {
    const board = ['X','X','X','','','','','',''];
    expect(checkWinBoard(board, 'X')).toBe(true);
  });

  test('detects column win', () => {
    const board = ['O','','','O','','','O','',''];
    expect(checkWinBoard(board, 'O')).toBe(true);
  });

  test('detects diagonal win', () => {
    const board = ['X','','','','X','','','','X'];
    expect(checkWinBoard(board, 'X')).toBe(true);
  });
});

describe('checkDrawBoard', () => {
  test('identifies draw when board full without winner', () => {
    const board = ['X','O','X','X','O','O','O','X','X'];
    expect(checkDrawBoard(board)).toBe(true);
  });
});
