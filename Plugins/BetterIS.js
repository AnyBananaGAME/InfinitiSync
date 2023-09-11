const { InventorySlotEvent } = require("../src/Events/Bidirectional/InventorySlotEvent");
const { ServerTextEvent } = require("../src/Events/Server/ServerTextEvent");
const { Player } = require("../src/Player/Player");

const bodyParser = require("body-parser");
const path = require("path");
const express = require("express");
const cors = require("cors");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

module.exports = {
	name: "BetterIS",
	description: "Allows you to view your inventory in a browser",
	version: "1.0.0",

	/** @type {Player}*/
	player: {},

	async onLoad(player) {
		this.player = player;
		console.log("Loading plugin " + this.name);
	},

	async onEnable() {
		try {
			await sleep(1000);

			this.player.sendMessage("Enabling...");

			this.player.on(InventorySlotEvent.name, (data) => {
				this.player.inventory.slots[data.slot] = data.item;
			});

			this.player.on(ServerTextEvent.name, async (data) => {
				if (data.parameters === undefined) return console.log(data.message);

				console.log(data?.parameters[0] + ` ${data.parameters[1]}`);

				if ((data.parameters[1])?.includes("!drop")) {
					for (i = 0; i < 36; i++) {
						this.player.dropItem(1, i);
					}
				}

				if ((data.parameters[1])?.includes("!move")) {
					this.player.move(true);
					await sleep(2000);
					this.player.move(false);
				}
			});

			this.start();
		} catch (error) { console.error(error); }
	},

	/**
     * Starts the web server
     */
	start() {
		const app = express();
		app.use(cors());

		const staticFilesDir = path.join(__dirname, "public");
		app.use(express.static(staticFilesDir));

		const port = 3000;

		app.get("/api/data", (req, res) => {
			res.json(this.player.inventory.slots);
		});

		app.use(bodyParser.json());
		app.use(bodyParser.urlencoded({ extended: true }));

		app.post("/api/drop", async (req, res) => {
			const data = req.body;

			this.player.dropItem(data.count, data.slot);

			res.status(200).json({ ok: true });
		});

		app.listen(port, () => {
			console.log(`Server is running on http://localhost:${port}`);
		});
	}
};
