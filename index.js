const Disc = require("./disc");
const Expr = require("./expr");
const Log = require("./log");
const Rcon = require("./rcon");
const Scheduler = require("./scheduler");
const VipUtils = require("./viputils");

async function main() {
    const log = new Log();
    const disc = new Disc(log);

    await disc.init();
    log.setDisc(disc)
    disc.log = log.log;


    const rcon = new Rcon(log, disc);
    const scheduler = new Scheduler(log, rcon);
    await scheduler.initAgenda();
    const viputils = new VipUtils(log, disc, rcon, scheduler);
    scheduler.setVipUtils(viputils);
    viputils.scheduler = scheduler;
    const expr = new Expr(log);
    const vipFunc = data => {
        try {
            viputils.addVip(data.steamid, data.discordTag, data.days, data.tokens);
        } catch (err) {
            console.warn(err)
            log.log(err.message, true);
            log.log('Trying again in 10 minutes.', true)
            setTimeout(() => {
                log.log(`Trying again for ${data.steamid}, ${data.discordTag}, for ${data.days} days`);
                viputils.addVip(data.steamid, data.discordTag, data.days);
            }, 600000);
        }
    }
    expr.on('addVip', vipFunc);
    disc.on('addVip', vipFunc);
}

main();
