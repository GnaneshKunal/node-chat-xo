const _ = require('lodash');

const NO_GAMES = '---There are no current Games---';
const NOT_PART = '---You are not a part of the game---';
const INVALID = '---Invalid command---';

module.exports = function(game, chunk, socket) {
    switch(true) {
        case chunk === 'iam:':
            if(!game.isActive) {
                return emit(NO_GAMES, socket);
            } else {
                var aPlayer = fetchPlayer(game, socket);
                if (aPlayer) {
                    return emit('---You are ' + aPlayer + '---', socket);
                } else {
                    return emit(NOT_PART, socket);
                }
            } break;
        case chunk.includes('my:'):
            if (!game.isActive || game.isActive == 'waiting') {
                return emit(NO_GAMES, socket);
            } else {
                var char = fetchPlayer(game, socket);
                if (!char) {
                    return emit(NOT_PART, socket);
                }
                var xo = chunk.split(':');
                if (xo.length !== 2) {
                    return emit(INVALID, socket);
                }
                var num = parseInt(xo[1]);
                xo = (parseInt(xo[1]) >= 0 && parseInt(xo[1]) < 9) ? xo[1] : false;
                if (xo) {
                    var character = fetchPlayer(game, socket);
                    if (!character) {
                        return emit(NOT_PART, socket);
                    }
                    if (game.game[num] === ' ') {
                        if (game[char].chance){
                            game.game[num] = character;
                            alert(board(game));
                            if (char === 'x') {
                                game.x.chance = false;
                                game.o.chance = true; 
                            } else {
                                game.x.chance = true;
                                game.o.chance = false; 
                            }
                        } else {
                            return emit('Please wait for opponent to react', socket);
                        }
                    } else {
                        alert(board(game));
                        return emit('Please choose another spot', socket);
                    }
                } else {
                    return emit(INVALID, socket);
                }
                if (checkWin(game.game)) {
                    alert('---' + socket.details.name + ' has won the game---');
                    return game = afterFinish(game);
                } else if (checkFinish(game.game)) {
                    alert('---Game has ended---');
                    return game = afterFinish(game);
                }
            } break;
        case chunk.includes('game:'):
            if (!game.isActive) {
                var xo = chunk.split(':');
                xo = xo.length === 2 && (xo[1] === 'x' || xo[1] === 'o') ? xo[1] : false;
                if (xo) {
                    game[xo] = socket;
                    game[xo].chance = true;
                    game.isActive = 'waiting';
                    return emit('you have selected ' + xo, socket);
                }
            } else if (game.isActive == 'waiting') {
                var xo = chunk.split(':');
                xo = xo.length === 2 && (xo[1] === 'x' || xo[1] === 'o') ? xo[1] : false;
                if (xo) {
                    if (game.hasOwnProperty(xo)) {
                        return emit(xo + ' has been assigned to another player.', socket);
                    }
                    else {
                        game[xo] = socket;
                        game.isActive = true;
                        game.game = [];
                        game[xo].chance = true;
                        for (var x = 0; x < 9; x++) {
                                game.game.push(' ');
                        }
                        return alert('Game has been started:---\n' + '\n--- ' + game.x.details.name + '[x] vs ' + game.o.details.name + '[o]');
                    }
                } else {
                    return emit(INVALID, socket);
                }
            } else {
                if (Object.values(game).includes(socket)) {
                    return emit('You are in the game', socket);
                } else {
                    return emit(NOT_PART, socket);
                }
            } break;
        case chunk.includes('score:'):
            if (!game.isActive) {
                return emit('The game is not active.', socket);
            } else if (game.isActive == 'waiting') {
                return emit('Waiting for a player to join.', socket);
            } else {
                return emit(board(game), socket);
            } break;
    }
}