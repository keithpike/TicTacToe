_.times = function(n, iterator, context) {
var accum = Array(Math.max(0, n));
for (var i = 0; i < n; i++) accum[i] = iterator.call(context, i);
return accum;
};

(function (root) {
if (!(typeof(require) === "undefined")) {
  // _ = require('./underscore.js');
}

var TTT = root.TTT = (root.TTT || {});

var Game = TTT.Game = function($rootEl) {
  this.player = Game.marks[0];
  this.board = this.makeBoard();
  this.$el = $rootEl;
}

Game.marks = ["x", "o"];

Game.prototype.diagonalWinner = function () {
  var game = this;

  var diagonalPositions1 = [[0, 0], [1, 1], [2, 2]];
  var diagonalPositions2 = [[2, 0], [1, 1], [0, 2]];

  var winner = null;
  _(Game.marks).each(function (mark) {
    function didWinDiagonal (diagonalPositions) {
      return _.every(diagonalPositions, function (pos) {
        return game.board[pos[0]][pos[1]] === mark;
      });
    }

    var won = _.any(
      [diagonalPositions1, diagonalPositions2],
      didWinDiagonal
    );

    if (won) {
      winner = mark;
    }
  });

  return winner;
};

Game.prototype.isEmptyPos = function (pos) {
  return (this.board[pos[0]][pos[1]] === null);
};

Game.prototype.horizontalWinner = function () {
  var game = this;

  var winner = null;
  _(Game.marks).each(function (mark) {
    var indices = _.range(0, 3);

    var won = _(indices).any(function (i) {
      return _(indices).every(function (j) {
        return game.board[i][j] === mark;
      });
    });

    if (won) {
      winner = mark;
    }
  });

  return winner;
};

Game.prototype.makeBoard = function () {
  return _.times(3, function (i) {
    var $row = $("<div class='row'></div>");
    $('#grid').append($row);
    return _.times(3, function (j) {
      var $cell = $("<div class='cell'></div>");
      $cell.attr("data-row", i);
      $cell.attr("data-column", j);
      $row.append($cell);
      return null;
    });
  });
};

Game.prototype.move = function (event) {
  $target = $(event.target);

  var pos = [
    parseInt($target.attr('data-row')),
    parseInt($target.attr('data-column'))
  ];
  if (!this.isEmptyPos(pos)) {
    return false;
  }

  this.placeMark(pos, $target);
  this.switchPlayer();
  this.winner();
  return true;
};

Game.prototype.placeMark = function (pos, $target) {
  this.board[pos[0]][pos[1]] = this.player;
  $target.css('background-color', this.getColor(this.player));
};

Game.prototype.getColor = function (player) {
  if (player === 'x') {
    return "lightsalmon";
  } else {
    return "lightskyblue";
  }
};

Game.prototype.switchPlayer = function () {
  if (this.player === Game.marks[0]) {
    this.player = Game.marks[1];
  } else {
    this.player = Game.marks[0];
  }
};

Game.prototype.valid = function (pos) {

  function isInRange (pos) {
    return (0 <= pos) && (pos < 3);
  }

  return _(pos).all(isInRange) && _.isNull(this.board[pos[0]][pos[1]]);
};

Game.prototype.verticalWinner = function () {
  var game = this;

  var winner = null;
  _(Game.marks).each(function (mark) {
    var indices = _.range(0, 3);

    var won = _(indices).any(function (j) {
      return _(indices).every(function (i) {
        return game.board[i][j] === mark;
      });
    });

    if (won) {
      winner = mark;
    }
  });

  return winner;
};

Game.prototype.winner = function () {
  if(
    this.diagonalWinner() || this.horizontalWinner() || this.verticalWinner()
  ) {
    this.$el.off("click", ".cell", this.move.bind(this));
    alert("YOU WON.");

  }
};

Game.prototype.printBoard = function () {
  var game = this;

  game.board.forEach(function(row){
    var first = row[0] == null ? " " : row[0];
    var second = row[1] == null ? " " : row[1];
    var third = row[2] == null ? " " : row[2];

    console.log(first + " | " + second + " | " + third);
  })
}

Game.prototype.setUpEvents = function () {
  this.$el.click('.cell', this.move.bind(this) );
};

})(this);
