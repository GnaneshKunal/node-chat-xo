module.exports = function(game, chunk, socket) {
    switch(true) {
        case chunk === 'iam:':
            if(!game.isActive) {
                return emit('There are no current Games', socket);
            } else {
                var aPlater = _.findKey(game, socket);
                if (aPlater) {
                    return emit('You are ' + _.findKey(game, socket), socket);
                } else {
                    return emit('You are not a part of the game', socket);
                }
            }
        case chunk.includes('game:'):
            if (!game.isActive) {
                var xo = chunk.split(':');
                xo = xo.length === 2 && (xo[1] === 'x' || xo[1] === 'o') ? xo[1] : false;
                if (xo) {
                    game[xo] = socket;
                    game.isActive = 'waiting';
                    return emit('you have selected ' + xo + '\n', socket);
                }
            } else if (game.isActive == 'waiting') {
                var xo = chunk.split(':');
                xo = xo.length === 2 && (xo[1] === 'x' || xo[1] === 'o') ? xo[1] : false;
                if (xo) {
                    if (game.hasOwnProperty(xo)) {
                        return emit(xo + ' has been assigned to another player.\n', socket);
                    }
                    else {
                        game[xo] = socket;
                        game.isActive = true;
                        return alert('Game has been started:\n' + '\n--- ' + game.x.details.name + '[x] vs ' + game.o.details.name + '[o] ---\n');
                    }
                }
            } else {
                if (Object.values(game).includes(socket)) {
                    return emit('You are in the game\n', socket);
                } else {
                    return emit('You are not in the game\n', socket);
                }
            }
    }
}