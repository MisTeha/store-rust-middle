steamIDString = ""
var re = new RegExp('\\d{17}');
var r = steamIDString.match(re);
if (!r) return this.logger.log(`Steamid ei sobi: ${steamIDString} (${discordTag}, ${q} päeva)`)
steamid = r[0]