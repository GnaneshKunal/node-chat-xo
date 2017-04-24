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
     };

    this.broadcast = function(message, sender){
        clients.forEach(client => {
            if (client === sender) return;
            return client.write('\n' + message + '\n');
        });

        return process.stdout.write('\n' + message + '\n');
    };

    this.alert = function(message) {
        clients.forEach(client => {
            return client.write('\n' + message + '\n');
        });
    };

    this.emit = function(message, sender) {
        clients.forEach(client => {
            if (client === sender) {
                return client.write('\n' + message + '\n');
            }
        });
    };

    this.options = function(sender) {
        clients.forEach(client => {
            if (client === sender) {
                return sender.write('OPTIONS:\n');
            }
        });
    };
}