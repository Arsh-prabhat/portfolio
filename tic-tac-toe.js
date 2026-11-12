const TicTacToeLogic = (() => {
  const WINNING_LINES = Object.freeze([
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ].map((line) => Object.freeze(line)));

  function getOutcome(board) {
    for (const line of WINNING_LINES) {
      const [first, second, third] = line;
      if (board[first] && board[first] === board[second] && board[first] === board[third]) {
        return { state: 'won', winner: board[first], line: [...line] };
      }
    }
    return board.every(Boolean)
      ? { state: 'draw', winner: null, line: [] }
      : { state: 'playing', winner: null, line: [] };
  }

  function chooseComputerMove(board) {
    if (getOutcome(board).state !== 'playing') return -1;

    const findTacticalMove = (mark) => board.findIndex((cell, index) => {
      if (cell) return false;
      const nextBoard = [...board];
      nextBoard[index] = mark;
      const outcome = getOutcome(nextBoard);
      return outcome.state === 'won' && outcome.winner === mark;
    });

    const winningMove = findTacticalMove('O');
    if (winningMove !== -1) return winningMove;
    const blockingMove = findTacticalMove('X');
    if (blockingMove !== -1) return blockingMove;
    if (!board[4]) return 4;

    for (const index of [0, 2, 6, 8, 1, 3, 5, 7]) {
      if (!board[index]) return index;
    }
    return -1;
  }

  function createGame({ onChange = () => {}, schedule = setTimeout, cancel = clearTimeout, delay = 420, initialBoard = Array(9).fill(null) } = {}) {
    let board = [...initialBoard];
    let turn = 'X';
    let finished = false;
    let computerPending = false;
    let winningLine = [];
    let timer = null;
    let message = 'Your move: X.';

    const snapshot = () => ({
      board: [...board],
      turn,
      finished,
      computerPending,
      winningLine: [...winningLine],
      message,
    });

    const notify = () => onChange(snapshot());

    function resolveOutcome() {
      const outcome = getOutcome(board);
      if (outcome.state === 'playing') return false;
      finished = true;
      computerPending = false;
      winningLine = outcome.line;
      message = outcome.state === 'draw'
        ? 'Draw!'
        : outcome.winner === 'X' ? 'You got me!' : 'O wins!';
      return true;
    }

    function playComputer() {
      timer = null;
      if (finished || !computerPending || turn !== 'O') return false;

      const index = chooseComputerMove(board);
      if (index < 0 || board[index]) {
        computerPending = false;
        resolveOutcome();
        notify();
        return false;
      }

      board[index] = 'O';
      computerPending = false;
      if (!resolveOutcome()) {
        turn = 'X';
        message = 'Your move: X.';
      }
      notify();
      return true;
    }

    function playHumanMove(index) {
      if (!Number.isInteger(index) || index < 0 || index > 8 || board[index] || finished || computerPending || turn !== 'X') {
        return false;
      }

      board[index] = 'X';
      if (!resolveOutcome()) {
        turn = 'O';
        computerPending = true;
        message = 'O thinks...';
        timer = schedule(playComputer, delay);
      }
      notify();
      return true;
    }

    function restart() {
      if (timer !== null) cancel(timer);
      timer = null;
      board = Array(9).fill(null);
      turn = 'X';
      finished = false;
      computerPending = false;
      winningLine = [];
      message = 'Your move: X.';
      notify();
    }

    notify();
    return Object.freeze({ playHumanMove, restart, snapshot });
  }

  return Object.freeze({ WINNING_LINES, getOutcome, chooseComputerMove, createGame });
})();

if (typeof module !== 'undefined' && module.exports) module.exports = TicTacToeLogic;
if (typeof window !== 'undefined') window.TicTacToeLogic = TicTacToeLogic;

if (typeof document !== 'undefined') {
  const gameRoot = document.querySelector('.note-game');
  if (gameRoot) {
    const cells = [...gameRoot.querySelectorAll('.game-cell')];
    const status = gameRoot.querySelector('.game-status');
    const restartButton = gameRoot.querySelector('.game-restart');
    const marks = gameRoot.querySelector('.note-marks');

    const renderMarks = (state) => {
      const pathsByIndex = new Map();
      marks.querySelectorAll('path[data-mark-index]').forEach((path) => {
        const index = Number(path.dataset.markIndex);
        pathsByIndex.get(index)?.remove();
        pathsByIndex.set(index, path);
      });
      // Centers follow the drawn grid's angled separators in the SVG's native viewBox.
      const cellCenters = [
        [20, 11], [64, 16], [100, 22],
        [18, 34], [55, 44], [95, 57],
        [12, 76], [44, 78], [88, 82],
      ];
      state.board.forEach((mark, index) => {
        const existingPath = pathsByIndex.get(index);
        if (!mark) {
          existingPath?.remove();
          pathsByIndex.delete(index);
          return;
        }
        const [cx, cy] = cellCenters[index];
        const markClass = `${mark === 'X' ? 'mark-x' : 'mark-o'}${state.winningLine.includes(index) ? ' winning-mark' : ''}`;
        let path = existingPath;
        if (path && path.dataset.mark !== mark) {
          path.remove();
          pathsByIndex.delete(index);
          path = null;
        }
        if (!path) {
          path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          path.dataset.markIndex = String(index);
          path.dataset.mark = mark;
          if (mark === 'X') path.setAttribute('d', `M ${cx - 6} ${cy - 7} Q ${cx - 2} ${cy - 2} ${cx + 7} ${cy + 7} M ${cx + 6} ${cy - 7} Q ${cx + 2} ${cy - 2} ${cx - 6} ${cy + 7}`);
          else path.setAttribute('d', `M ${cx + 1} ${cy - 9} C ${cx + 9} ${cy - 10}, ${cx + 10} ${cy - 2}, ${cx + 7} ${cy + 5} C ${cx + 3} ${cy + 10}, ${cx - 6} ${cy + 10}, ${cx - 8} ${cy + 4} C ${cx - 10} ${cy - 3}, ${cx - 6} ${cy - 8}, ${cx + 1} ${cy - 9} Z`);
          marks.appendChild(path);
        }
        path.setAttribute('class', markClass);
        pathsByIndex.delete(index);
      });
      pathsByIndex.forEach((path) => path.remove());
    };

    const render = (state) => {
      const winningCells = new Set(state.winningLine);
      cells.forEach((cell, index) => {
        const mark = state.board[index];
        const row = Math.floor(index / 3) + 1;
        const column = (index % 3) + 1;
        cell.disabled = Boolean(mark) || state.finished || state.computerPending;
        cell.setAttribute('aria-disabled', String(Boolean(mark) || state.finished || state.computerPending));
        cell.setAttribute('aria-label', `Row ${row}, column ${column}, ${mark ? `occupied by ${mark}` : 'empty'}`);
        cell.classList.toggle('is-winning', winningCells.has(index));
      });
      status.textContent = state.message;
      restartButton.hidden = !state.finished;
      renderMarks(state);
    };

    const game = TicTacToeLogic.createGame({ onChange: render, initialBoard: [null, 'O', null, null, null, 'X', null, null, null] });

    gameRoot.addEventListener('pointerdown', (event) => event.stopPropagation());
    gameRoot.addEventListener('pointerup', (event) => event.stopPropagation());
    gameRoot.addEventListener('click', (event) => {
      const control = event.target.closest('button');
      if (!control || !gameRoot.contains(control)) return;
      event.stopPropagation();
      if (control.matches('.game-cell')) game.playHumanMove(Number(control.dataset.cell));
      if (control.matches('.game-restart')) game.restart();
    });
  }
}
