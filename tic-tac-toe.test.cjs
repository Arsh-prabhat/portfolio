const test = require('node:test');
const assert = require('node:assert/strict');
const { WINNING_LINES, getOutcome, chooseComputerMove, createGame } = require('./tic-tac-toe.js');

function createTimerQueue() {
  const tasks = [];
  return {
    tasks,
    schedule(callback, delay) {
      const task = { callback, delay, cancelled: false };
      tasks.push(task);
      return task;
    },
    cancel(task) {
      task.cancelled = true;
    },
    runNext() {
      const task = tasks.find((candidate) => !candidate.cancelled && !candidate.ran);
      if (!task) return false;
      task.ran = true;
      task.callback();
      return true;
    },
  };
}

test('detects every winning line for both X and O', () => {
  for (const line of WINNING_LINES) {
    for (const mark of ['X', 'O']) {
      const board = Array(9).fill(null);
      line.forEach((index) => { board[index] = mark; });
      assert.deepEqual(getOutcome(board), { state: 'won', winner: mark, line: [...line] });
    }
  }
});

test('detects a full-board draw', () => {
  assert.deepEqual(getOutcome(['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X']), {
    state: 'draw', winner: null, line: [],
  });
});

test('computer takes a win, blocks a player win, and chooses only an empty cell', () => {
  assert.equal(chooseComputerMove(['O', 'O', null, null, 'X', null, null, null, null]), 2);
  assert.equal(chooseComputerMove(['X', 'X', null, null, 'O', null, null, null, null]), 2);
  const board = ['X', null, null, null, 'O', null, null, null, null];
  const move = chooseComputerMove(board);
  assert.notEqual(board[move], 'X');
  assert.notEqual(board[move], 'O');
  assert.equal(chooseComputerMove(['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X']), -1);
});

test('accepts one player move and schedules exactly one computer response', () => {
  const timers = createTimerQueue();
  const game = createGame({ schedule: timers.schedule, cancel: timers.cancel });
  assert.equal(game.playHumanMove(0), true);
  assert.equal(game.playHumanMove(0), false);
  assert.equal(game.playHumanMove(1), false);
  assert.equal(timers.tasks.length, 1);
  assert.equal(timers.tasks[0].delay, 420);

  timers.runNext();
  const state = game.snapshot();
  assert.equal(state.board[0], 'X');
  assert.equal(state.board.filter((mark) => mark === 'O').length, 1);
  assert.equal(state.computerPending, false);
  assert.equal(state.turn, 'X');
});

test('each of the nine cell indices accepts a move in its matching state slot', () => {
  for (let index = 0; index < 9; index += 1) {
    const timers = createTimerQueue();
    const game = createGame({ schedule: timers.schedule, cancel: timers.cancel });
    assert.equal(game.playHumanMove(index), true, `cell ${index} should accept the move`);
    const board = game.snapshot().board;
    assert.equal(board[index], 'X', `cell ${index} should contain X`);
    assert.equal(board.filter(Boolean).length, 1, `cell ${index} should be the only occupied cell`);
    assert.equal(timers.tasks.length, 1, `cell ${index} should schedule exactly one response`);
  }
});

test('restart cancels a pending computer move and clears the board', () => {
  const timers = createTimerQueue();
  const game = createGame({ schedule: timers.schedule, cancel: timers.cancel });
  game.playHumanMove(4);
  const staleComputerTurn = timers.tasks[0];
  game.restart();
  staleComputerTurn.callback();
  assert.equal(staleComputerTurn.cancelled, true);
  assert.deepEqual(game.snapshot().board, Array(9).fill(null));
  assert.equal(game.snapshot().turn, 'X');
  assert.equal(game.snapshot().computerPending, false);
});

test('ends a complete game, rejects later moves, and restarts after the result', () => {
  const timers = createTimerQueue();
  const game = createGame({ schedule: timers.schedule, cancel: timers.cancel });
  let safety = 0;
  while (!game.snapshot().finished && safety < 20) {
    const state = game.snapshot();
    if (state.turn === 'X' && !state.computerPending) {
      const emptyIndex = state.board.findIndex((mark) => !mark);
      if (emptyIndex < 0) break;
      game.playHumanMove(emptyIndex);
    } else {
      timers.runNext();
    }
    safety += 1;
  }
  assert.equal(game.snapshot().finished, true);
  assert.equal(game.playHumanMove(0), false);
  game.restart();
  assert.equal(game.snapshot().finished, false);
  assert.deepEqual(game.snapshot().board, Array(9).fill(null));
});
