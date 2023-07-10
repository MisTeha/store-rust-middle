class Log {
    constructor() {
        this.disc;
        this.unsent = [];
    }

    log(message, format = false) {
        console.log(message);
        if (format) message = "`" + message + "`";
        if (this.disc === undefined) {
            this.unsent.push(message);
            return;
        }
        this.disc.dLog(message);
    }

    setDisc(disc) {
        this.disc = disc;
        for (const message of this.unsent) {
            this.disc.dLog(message);
            this.unsent = []
        }
    }
}

module.exports = Log;