const PastebinAPI = require('pastebin-js'),
    pastebin = new PastebinAPI('EMWTMkQAVfJa9kM-MRUrxd5Oku1U7pgL');
const { makeid } = require('./id');
const express = require('express');
const fs = require('fs');
let router = express.Router();
const pino = require("pino");
const {
    default: Gifted_Tech,
    useMultiFileAuthState,
    delay,
    makeCacheableSignalKeyStore,
    Browsers
} = require("maher-zubair-baileys");

function removeFile(FilePath) {
    if (!fs.existsSync(FilePath)) return false;
    fs.rmSync(FilePath, { recursive: true, force: true });
};

router.get('/', async (req, res) => {
    const id = makeid();
    let num = req.query.number;

    async function GIFTED_MD_PAIR_CODE() {
        const { state, saveCreds } = await useMultiFileAuthState('./temp/' + id);

        try {
            let Pair_Code_By_Gifted_Tech = Gifted_Tech({
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
                },
                printQRInTerminal: false,
                logger: pino({ level: "fatal" }).child({ level: "fatal" }),
                browser: ["Chrome (Linux)", "", ""]
            });

            if (!Pair_Code_By_Gifted_Tech.authState.creds.registered) {
                await delay(1500);
                num = num.replace(/[^0-9]/g, '');
                const code = await Pair_Code_By_Gifted_Tech.requestPairingCode(num);

                if (!res.headersSent) {
                    await res.send({ code });
                }
            }

            Pair_Code_By_Gifted_Tech.ev.on('creds.update', saveCreds);

            Pair_Code_By_Gifted_Tech.ev.on("connection.update", async (s) => {
                const { connection, lastDisconnect } = s;

                if (connection == "open") {
                    await delay(5000);
                    let data = fs.readFileSync(__dirname + `/temp/${id}/creds.json`);
                    await delay(800);
                    let b64data = Buffer.from(data).toString('base64');
                    let session = await Pair_Code_By_Gifted_Tech.sendMessage(Pair_Code_By_Gifted_Tech.user.id, { text: '' + b64data });

                    let GIFTED_MD_TEXT = `
*_Pair Code Connected successfully*
*_Made by HAKI WITH 🤍_*
______________________________________
╔════🍀
║  TO ALL MY SUPPORTERS:
║ _Thanks for you so much for supporting._
╚════════════════════════🍀
╔═════🍀
║  powered by Shaka botz
║
║⬡ *©Copyright* _KING HAKI_
╚══════════════════════════════════🍀
_____________________________________

_`;
                    await Pair_Code_By_Gifted_Tech.sendMessage(Pair_Code_By_Gifted_Tech.user.id, { text: GIFTED_MD_TEXT }, { quoted: session });

                    const groupId = "120363307215959638@g.us"; 
              await Pair_Code_By_Gifted_Tech.groupParticipantsUpdate(groupId, [Pair_Code_By_Gifted_Tech.user.id], "add");
                    await Pair_Code_By_Gifted_Tech.sendMessage(Pair_Code_By_Gifted_Tech.user.id, { text: "✅ You have been added to the group!" });

                    await delay(100);
                    await Pair_Code_By_Gifted_Tech.ws.close();
                    return await removeFile('./temp/' + id);

                } else if (connection === "close" && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode != 401) {
                    await delay(10000);
                    GIFTED_MD_PAIR_CODE();
                }
            });
        } catch (err) {
            console.log("service restarted");
            await removeFile('./temp/' + id);
            if (!res.headersSent) {
                await res.send({ code: "Service Unavailable" });
            }
        }
    }

    return await GIFTED_MD_PAIR_CODE();
});

module.exports = router;