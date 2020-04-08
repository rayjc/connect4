/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let isOver = false;
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

function createPosId(y,x){
  return `${y}-${x}`;
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
      cell.setAttribute("id", createPosId(y, x));
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
  const relTd = document.getElementById(createPosId(y, x));
  console.assert(
    !relTd.querySelector('.piece'),
    `td#${createPosId(y, x)} should not include a piece already!`
  );
  const newDiv = document.createElement('div');
  newDiv.classList.add('piece');
  newDiv.classList.add(`player-${currPlayer}`);

  relTd.appendChild(newDiv);
}

/** endGame: announce game end */

function endGame(msg) {
  // pop up alert message
  isOver = true;
  // delay alert after winning piece has been rendered
  setTimeout(function(){
    alert(msg);
  }, 280);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // exit early
  if (isOver){
    return;
  }

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
    document.querySelector('body').style.backgroundColor = getPlayerColor();
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  // check if all cells in board are filled; if so call, call endGame
  if (board.every((rows) => rows.every((el) => !!el)))
    endGame("Sorry it's a tie!");

  // switch players
  // switch currPlayer 1 <-> 2
  currPlayer = currPlayer === 1 ? 2 : 1;
  evt.target.style.borderColor = getPlayerColor();
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

  // iterate through every position on the board
  for (var y = 0; y < HEIGHT; y++) {
    for (var x = 0; x < WIDTH; x++) {
      // create possible 4 connected entries in different directions
      var horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      var vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      var diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      var diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      // check if either if the direction has 4 connected entries
      // by either player
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

function getTdsByCol(x){
  const boardTrs = document.querySelectorAll('table tr:not([id])');
  return Array.from(boardTrs).map((tr) => tr.children[x]);
}

function getPlayerColor() {
  return currPlayer === 1 ? 'red' : 'blue';
}

function reset(){
  // reset in-memory board
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      board[y][x] = null;
    }
  }
  // reset HTML board
  Array.from(document.querySelectorAll('td div.piece')).forEach((el) => el.remove());
  // reset starting player
  currPlayer = 1;
  // reset background
  document.querySelector('body').style.backgroundColor = '';
  // reset flag
  isOver = false;
}

makeBoard();
makeHtmlBoard();

// add hover effect on selected columns
document.querySelector('tr#column-top').addEventListener('mouseover', function(event){
  event.target.style.borderColor = getPlayerColor();
  // select the nth column and only the unoccupied <td>
  const emptyColTds = getTdsByCol(+event.target.id).filter(
    (td) => !td.firstElementChild
            || !td.firstElementChild.classList.contains('piece')
  );
  emptyColTds.forEach((td) => td.classList.add('highlight'));
});
document.querySelector('tr#column-top').addEventListener('mouseout', function(event){
  event.target.style.borderColor = '';
  // select the nth column
  const colTds = getTdsByCol(+event.target.id);
  colTds.forEach((td) => td.classList.remove('highlight'));
});
// add reset event
document.querySelector('#restart').addEventListener('click', function(event){
  reset();
})