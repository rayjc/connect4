/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;
const PLAYER = {
  1: 1, 
  2: 2
};

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  // TODO: set "board" to empty HEIGHT x WIDTH matrix array
  for (let y = 0; y < HEIGHT; y++){
    for (let x = 0; x < WIDTH; x++){
      if (!board[y]) {
        board[y] = [];
      }
      board[y][x] = null;
    }
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.querySelector('table#board');

  // create the top table row (headers)
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  for (let x = 0; x < WIDTH; x++) {
    let headCell = document.createElement("td");
    headCell.setAttribute("id", x);   // assign id based on x position
    top.append(headCell);
  }
  htmlBoard.append(top);

  // create the HEIGHT x WIDTH table
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      // assign id based on the (y,x) position
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  // extract col at position x
  const col = board.map((row) => row[x]);
  // find last empty y (bottom of the board)
  const y = col.lastIndexOf(null);

  return y !== -1 ? y : null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // make a div and insert into correct table cell
  //const relTd = document.querySelector(`td#\\3${y}-${x}`);
  const relTd = document.getElementById(`${y}-${x}`);
  console.assert(
    !relTd.querySelector('.piece'),
    `td#${y}-${x} should not include a piece already!`
  );
  const newDiv = document.createElement('div');
  newDiv.classList.add('piece');
  newDiv.classList.add(`player-${currPlayer}`);

  relTd.appendChild(newDiv);
}

/** endGame: announce game end */

function endGame(msg) {
  // pop up alert message
  // delay alert after winning piece has been rendered
  setTimeout(function(){
    alert(msg);
  }, 50);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  const x = +evt.target.id;   // convert id string to number

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  placeInTable(y, x);
  board[y][x] = currPlayer;   // update in-memory board

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  // check if all cells in board are filled; if so call, call endGame
  if (board.every((rows) => rows.every((el) => !!el)))
    endGame();

  // switch players
  // switch currPlayer 1 <-> 2
  currPlayer = currPlayer === PLAYER[1] ? PLAYER[2] : PLAYER[1];
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */
// could consider making graphs and apply BFS followed by DFS during each
// placement instead of checking the entire board for every piece placed...

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.

  for (var y = 0; y < HEIGHT; y++) {
    for (var x = 0; x < WIDTH; x++) {
      var horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      var vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      var diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      var diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
