module.exports = function(players) {
    this.display = function(name, socket) {
        players.forEach(player => {
            if (player === socket) {
                emit('you are ' + player.tag);
            } 
        });
        return emit('o | x | o\n_ _ _ _ _ \no | x | o\n_ _ _ _ _ \no | x | o\n');
    }
};