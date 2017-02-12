module.exports = function(chunk, socket) {
    switch(true) {
        case chunk === 'options':
            return options(socket);
        case chunk === 'myname':
            return emit('---' + socket.details.name + '---\n', socket);
        case (chunk.includes('name:') && chunk.indexOf('name:') == 0):
            if (chunk.split(':')[1] == '') return;
            var oldName = (socket.details.name == 'Guest' ? socket.details.address : socket.details.name) + ":" + socket.details.port;
            var newName = chunk.split(':')[1].trim();
            if (!changeName(newName, socket)) return;
            emit("---name has been changed---\n", socket);
            return broadcast(`${oldName} has changed to ${newName}:${socket.details.port}\n`, socket);
        default:
            return broadcast(socket.details.name + ":" + socket.details.port + "> " + chunk + '\n', socket);
    }
}