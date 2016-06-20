'use strict';

module.exports = {
  loadPriority: 1000,
  startPriority: 1000,
  stopPriority: 1000,
  initialize: function (api, next) {
    api.Game = {
      constructGame: function () {
        var generateGuid = function () {
          function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
              .toString(16)
              .substring(1);
          }
          return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
        }
        var newGame = {};
        var generator = api.PhraseGenerator;
        newGame.players = [];
        newGame.currentTurn = 0;
        newGame.id = generateGuid();
        newGame.redPieces = [];
        newGame.blackPieces = [];

        newGame.getCurrentPlayer = function () {
          return this.players[this.currentTurn];
        }

        newGame.getSummaryState = function () {

          var summary = {};
          summary.players = []
          for (var i = 0; i < this.players.length; i++) {
            if (i == this.currentTurn) {
              summary.players.push({ "name": this.players[i].name, "score": this.players[i].score, "turn": true });
            }
            else {
              summary.players.push({ "name": this.players[i].name, "score": this.players[i].score, "turn": false });
            }
          }
          summary.blackPieces = this.blackPieces;
          summary.redPieces = this.redPieces;
          summary.gameId = this.id;

          return summary;
        }

        newGame.move = function (player, x1, y1, x2, y2) {
          var isRed = null;
          if (this.players[0] == player) {
            isRed = true;
          }
          else if (this.players.length >= 2 && this.players[1] == player) {
            isRed = false;
          }
          if (isRed != null) {
            if (isRed) {
              for (var i = 0; i < this.redPieces.length; i++) {
                if (this.redPieces[i].x == x1 && this.redPieces[i].y == y1) {
                  this.redPieces[i].move(x2, y2);
                  return true;
                }
              }
              return false;
            }
            else {
              for (var i = 0; i < this.blackPieces.length; i++) {
                if (this.blackPieces[i].x == x1 && this.blackPieces[i].y == y1) {
                  this.blackPieces[i].move(x2, y2);
                  return true;
                }
              }
              return false;
            }
          }
        }

        newGame.getCurrentPlayerName = function () {
          return this.getCurrentPlayer().name;
        }

        newGame.isTurnOf = function (otherPlayer) {
          return this.getCurrentPlayer().id == otherPlayer.id;
        }

        newGame.fixTurn = function () {
          if (this.players.length == 0) {
            this.currentTurn = 0;
          }
          else {
            while (this.currentTurn >= this.players.length) {
              this.currentTurn -= this.players.length;
            }
          }
        }
        newGame.advanceTurn = function () {
          this.currentTurn += 1;
          this.fixTurn();
        }
        newGame.addPlayer = function (player) {
          if (this.players.length >= 2) {
            return false;
          }
          player.score = 12;
          this.players.push(player);
          return true;
        }

        newGame.playerInGame = function (playerId) {
          for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].id == playerId) {
              return true;
            }
          }
          return false;
        }

        newGame.removePlayer = function (playerId) {
          for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].id == playerId) {
              this.players.splice(i, 1);
              this.fixTurn();
              if (this.players.length == 0) {
                for (var j = 0; j < api.allGames.length; j++) {
                  if (api.allGames[j].id == this.id) {
                    api.allGames.splice(j, 1);
                    break;
                  }
                }
              }
              return true;
            }
          }
          return false;
        }

        newGame.listPlayerNames = function () {
          var playerNames = []
          for (var eachPlayerIndex in this.players) {
            eachPlayerIndex = +eachPlayerIndex;
            playerNames.push(this.players[eachPlayerIndex].name);
          }
          return playerNames;
        }

        newGame.reset = function () {
          this.redPieces = [];
          this.blackPieces = [];
          for (var ry = 0; ry < 3; ry++) {
            for (var rx = 1 - ry % 2; rx < 8; rx += 2) {
              this.redPieces.push(api.Piece.constructPiece(rx, ry, true));
            }
          }
          for (var ry = 5; ry < 8; ry++) {
            for (var rx = 1 - ry % 2; rx < 8; rx += 2) {
              this.blackPieces.push(api.Piece.constructPiece(rx, ry, false));
            }
          }
        }
        newGame.reset();

        return newGame;
      }
    };

    next();
  },
  start: function (api, next) {
    api.allGames = []
    next();
  },
  stop: function (api, next) {
    next();
  }
};
