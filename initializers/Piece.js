'use strict';

module.exports = {
  loadPriority:  1000,
  startPriority: 1000,
  stopPriority:  1000,
  initialize: function(api, next){
    api.Piece = {
      constructPiece: function(x,y, isRed) {
        var newPiece = {};
        newPiece.x = x;
        newPiece.y = y;
        newPiece.isKing = false;
        newPiece.makeKing = function() {
          this.isKing = true;
        }
        newPiece.isRed = isRed;
        newPiece.move = function(x,y) {
          this.x = x;
          this.y = y;
        }
        return newPiece;  
      }
    };
    next();
  },
  start: function(api, next){
    next();
  },
  stop: function(api, next){
    next();
  }
};
