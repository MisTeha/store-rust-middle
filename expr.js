const express = require('express');
const { port } = require('./config.json')
const EventEmitter = require('events');

class expr extends EventEmitter {
    constructor(logger) {
        super();
        this.app;
        this.logger = logger;
        this.startlisten();
    }

    startlisten() {
        const app = express();
        app.use(express.json());
        app.post('/rust/vip', (req, res) => {
            console.log('\n' + JSON.stringify(req.body));
            if (req.body.status !== "processing") {
                res.sendStatus(200)
                return;
            }
            const { meta_data, line_items } = req.body;
            let discordTag, steamIDString, steamid;
            for (const field of meta_data) {
                if (field.key === "discord") { discordTag = field.value; }
                if (field.key === "steam") { steamIDString = field.value; }
            }
            let q = 0;
            let tokens = 0;
            for (const item of line_items) {
                let a = 0;
                let b = 0;
                if (item.name.includes('7')) { a = 7; b = 0 }
                else if (item.name.includes('14')) { a = 14; b = 1 }
                else if (item.name.includes('30')) { a = 30; b = 2 }
                q += a * item.quantity;
                tokens += b * item.quantity;
            }
            var re = new RegExp('\\d{17}');
            var r = steamIDString.match(re);
            if (!r) return this.logger.log(`Steamid ei sobi: ${steamIDString} (${discordTag}, ${q} päeva, ${tokens} tokenit)`)
            steamid = r[0]
            console.log(tokens)
            this.emit('addVip', { steamid: steamid, discordTag: discordTag, days: q, tokens: tokens });
            res.sendStatus(200);
        });
        app.listen(port, () => {
            this.logger.log('Listening on port ' + port, true)
        });
    }
}

module.exports = expr;