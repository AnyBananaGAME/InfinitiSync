const { InventoryContentEvent } = require("../src/Events/Bidirectional/InventoryContentEvent");
const { InventorySlotEvent } = require("../src/Events/Bidirectional/InventorySlotEvent");
const { InventoryTransactionEvent } = require("../src/Events/Bidirectional/InventoryTransactionEvent");
const { Player } = require("../src/Player/Player");
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const path = require('path');
const express = require("express");
const cors = require('cors');
const { ServerTextEvent } = require("../src/Events/Server/ServerTextEvent");
const { ClientPlayerAuthInputEvent } = require("../src/Events/Client/ClientPlayerAuthInputEvent");
const { World } = require("../src/World/World");

module.exports = {
    name: "BetterIS",
    description: "BetterIS ",
    version: "0.0.1",

    /** @type {Player}*/
    player: {},

    async onLoad(player) {
        this.player = player;
        console.log("Loading plugin " + this.name)
    },
    async onEnable() {
        try {
            await sleep(1000)
            await this.player.sendMessage("Enabling...");

            this.player.on(InventoryTransactionEvent.name, (data) => {
                console.log(data)
            })
            this.player.on(InventorySlotEvent.name, (data) => {
                this.player.inventory.slots[data.slot] = data.item;
            })
            this.player.on(ServerTextEvent.name, async (data) => {
                if (data.parameters === undefined) return console.log(data.message)

                console.log(data?.parameters[0] + ` ${data.parameters[1]}`);
                if ((data.parameters[1])?.includes("!drop")) {
                    for (i = 0; i < 36; i++) {
                        this.player.dropItem(1, i)
                    };
                }
                if ((data.parameters[1])?.includes("!move")) {
                    this.player.move(true);
                    await sleep(2000);
                    this.player.move(false);
                }
            })
            this.player.on(ClientPlayerAuthInputEvent.name, (data) => {
                console.log(data);
            });

            this.WebServer();
        } catch (e) { console.log(e) }
    },

    /**
     * Starts the web server
     * @date 8/2/2023 - 4:43:39 PM
     */
    WebServer() {
        const app = express();
        app.use(cors());
        const staticFilesDir = path.join(__dirname, 'public');
        app.use(express.static(staticFilesDir));

        const port = 3000;



        app.get('/api/data', (req, res) => {
            res.json(this.player.inventory.slots);
        })

        const bodyParser = require("body-parser");

        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));

        app.post('/api/drop', async (req, res) => {
            const data = req.body;
            console.log(data);
            await this.player.dropItem(data.count, data.slot);
            res.status(200).json({ ok: true });
        })

        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    }
}