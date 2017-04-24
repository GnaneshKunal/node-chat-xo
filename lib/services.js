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

    this.help = function(sender) {
        clients.forEach(client => {
            if (client === sender) {
                return sender.write('\nHELP:\n1)\t help:{shows help}\n2)\t name:[name]{changes name}\n3)\t myname:{displays name}\n4)\t iam:{shows your game character}\n5)\t game:[xo]{used to join game}\n6)\t score:{displays board}\n7)\t my:[0-8]{places your character in a position}\n');
            }
        });
    };
}