class VipUtils {
    constructor(log, disc, rcon, scheduler) {
        this.log = log.log;
        this.disc = disc;
        this.rcon = rcon;
        this.scheduler = scheduler;
    }
    addVip(steamid, dTag, days, tokens) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.rcon.runAdd(steamid, tokens);
                const message = `Added vip to ${steamid}`;
                if (tokens > 0) { this.log(`Added ${tokens} tokens to ${steamid}`) }
                this.log(message, true);

                await this.disc.addVipRole(dTag);

                const removalTime = new Date();
                removalTime.setDate(removalTime.getDate() + days);
                this.scheduler.scheduleRemoval(steamid, removalTime, dTag);
                resolve();
            } catch (err) {
                this.log(`Couldn't add VIP to ${steamid} (${dTag}) for ${days} days.`)
                this.log(err.message, true);
                console.warn(err);
                resolve();
            }
        });

    }

    removeVip(steamid, dTag) {
        return new Promise(async (resolve, reject) => {
            try {
                const message = `Removing VIP from ${steamid}`
                this.log(message, true);
                this.rcon.runRemove(steamid);
                await this.disc.removeVipRole(dTag);
                resolve()
            } catch (err) {
                this.log(`Couldn't remove VIP from ${steamid}, ${dTag}`)
                resolve()
            }

        });
    }

    addMute(steamid) {
        try {
            const message = `Adding mute to ${steamid}`;
            this.log(message, true);
            this.rcon.runMute(steamid);
        } catch (error) {
            this.log(`Error muteing ${steamid}`)
        }
    }
}

module.exports = VipUtils;