const { MongoClient } = require('mongodb');
const Agenda = require('agenda');
const Rcon = require('./rcon');

class Scheduler {
    constructor(log, rcon) {
        this.rcon = rcon;
        this.logger = log;
        this.agenda;
        this.vipUtils;
    }

    setVipUtils(utils) {
        this.vipUtils = utils;
    }

    initAgenda() {
        return new Promise(async (resolve, reject) => {
            const db = await MongoClient.connect('mongodb://127.0.0.1:27017/agenda');
            const agenda = new Agenda().mongo(db.db(), 'jobs');
            agenda.define('removevip', job => this.vipUtils.removeVip(job.attrs.data.steamid, job.attrs.data.tag));
            await new Promise(resolve => agenda.once('ready', resolve));

            agenda.start();
            this.agenda = agenda;
            return resolve(agenda);
        });
    }

    scheduleRemoval(steamid, time, tag) {
        return new Promise(async (resolve, reject) => {
            await this.agenda.schedule(time, 'removevip', { steamid: steamid, tag: tag });
            const message = `Scheduled VIP removal for ${steamid} at ${time.toLocaleString()}`
            this.logger.log(message, true);
            resolve()
        });

    }
}

module.exports = Scheduler;