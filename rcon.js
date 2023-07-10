const WebRcon = require('webrconjs');
const { rconIp, rconPort, rconPassword } = require('./config.json');

class Rcon {
    constructor(log) {
        this.log = log.log;
    }
    runRcon(command) {
        return new Promise((resolve, reject) => {
            const rcon = new WebRcon(rconIp, rconPort);

            rcon.on('error', (err) => {
                console.log("error while running " + command);
                return reject(err);
            });

            rcon.on('connect', () => {
                console.log("connected")
                console.log(command)
                rcon.run(command);
            });

            rcon.on('message', message => {
                console.log(message);
                setTimeout(() => rcon.disconnect(), 6000)
                resolve();
            });

            rcon.on('disconnect', () => {
                console.log('disconnected');
            });

            rcon.connect(rconPassword);
        });

    }

    runAdd(steamid, tokens) {
        return new Promise((resolve, reject) => {
            if (tokens > 0) {
                this.runRcon(`addtoken Superraskevipitokeiniparool1 ${steamid} vip ${tokens}`);
            }
            this.runRcon(`o.usergroup add ${steamid} vip`)
                .then(() => {
                    resolve();
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    runRemove(steamid) {
        return this.runRcon(`o.usergroup remove ${steamid} vip`);
    }

    runMute(steamid) {
        return this.runRcon(`Siia peab panema commandi`)
    }
}

module.exports = Rcon;