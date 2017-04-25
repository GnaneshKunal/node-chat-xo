const _ = require('lodash');

function win(game, x, y, z) {
    if (game[x] !== '' && game[y] !== ' ' && game[z] !== ' ' && game[x] === game[y] && game[y] === game[z])
        return true;
}

module.exports = function(players) {
    this.fetchPlayer = function(game, socket) {
        return _.findKey(game, socket);
    }
    this.board = function(game) {
        var str = '';
        for (var y = 0; y < 9; y++) {
            if (y % 3 === 1 || y % 1 === 0) {
                str += game.game[y] + ' | ';
            } else {
                str += game.game[y];
            }
            if (y % 3 === 2 && y != 8)
                str += '\n_ _ _ _ _\n';
            if (y === 8)
                str+= '\n\n';
        }
        return str;
    }
    this.checkWin = function(game) {
        if (win(game, 0, 1, 2) || win(game, 3, 4, 5) || win(game, 6, 7, 8) || win(game, 0, 3, 6) || win(game, 1, 4, 7) || win(game, 2, 5, 8) || win(game, 0, 4, 8) || win(game, 2, 4, 6))
            return true;
    }
    this.afterFinish = function(game) {
        delete game.isActive;
        delete game.x;
        delete game.o;
        delete game.game;
    }
    this.checkFinish = function(game) {
        if (!_.includes(game, ' ')) {
            return true;
        }
    }
};