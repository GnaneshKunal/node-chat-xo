module.exports = function(clients){
    this.changeName = function(name, socket) {
        var check = clients.map(client => client.details.name.toLowerCase());
        if (check.includes(name.toLowerCase())) {
            emit('---Please choose another name ---\n', socket);
            return false;
        }
        clients.forEach(client => {
            if (client == socket) {
            return client.details.name = name;
            }
        });
        return true;
     }

    this.broadcast = function(message, sender){
        clients.forEach(client => {
            if (client === sender) return;
            return client.write(message);
        });

        process.stdout.write(message);
    }

    this.emit = function(message, sender) {
        clients.forEach(client => {
            if (client === sender) {
            return client.write(message);
            }
        });
    }

    this.options = function(sender) {
        clients.forEach(client => {
            if (client === sender) {
            return sender.write('OPTIONS:');
            }
        });
    }
}