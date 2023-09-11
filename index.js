const fs = require("fs");

const version = require("prismarine-registry")("bedrock_1.20.10");
const mcData = require("minecraft-data")(version.version.majorVersion);
const block = require("prismarine-block")(version);

const { createClient } = require("bedrock-protocol");
const { PlayerState } = require("prismarine-physics");

const { Vec3 } = require("vec3");

const { Player } = require("./src/Player/Player");

const { World } = require("./src/World/World");

const { InventoryContentEvent } = require("./src/Events/Bidirectional/InventoryContentEvent");
const { StartGameEvent } = require("./src/Events/Server/StartGameEvent");
const { SpawnEvent } = require("./src/Events/Server/SpawnEvent");
const { StartGameEventData } = require("./index");

const client = createClient({
	host: "ServerIP",
	username: "UserName",
	port: 19132,
	profilesFolder: "./src/Tokens",
	raknetBackend: "raknet-native",
	skipPing: true
});

/** @type {Player} player */
const player = new Player(client);

const world = new World(version, mcData, block, player);
player.world = world;

world.initialize();

player.on(StartGameEvent.name, /** @param {StartGameEventData} data */(data) => {
	const position = data.getPosition();
	console.log(position);

	player.entity.position = position;
	player.runtime_entity_id = data.getEntityRuntimeId();

	// console.log("data");
	// console.log(client.startGameData)

	/*
    const SubChunkPacket = new ClientSubChunkRequestPacket();
    SubChunkPacket.isQueued = true;
    SubChunkPacket.dimension = 0;
    SubChunkPacket.origin = new Vec3(player.entity.position.x / 16, 0, player.entity.position.z / 16)
    SubChunkPacket.requests = [
        { dx: 0, dy: 0, dz: 0 }, { dx: 0, dy: 1, dz: 0 }, { dx: 0, dy: 2, dz: 0 },
        { dx: 0, dy: 3, dz: 0 }, { dx: 0, dy: 4, dz: 0 }, { dx: 0, dy: 5, dz: 0 },
        { dx: 0, dy: 6, dz: 0 }, { dx: 0, dy: 7, dz: 0 }, { dx: 0, dy: 8, dz: 0 },
        { dx: 0, dy: 9, dz: 0 }, { dx: 0, dy: 10, dz: 0 }, { dx: 0, dy: 11, dz: 0 },
        { dx: 0, dy: 12, dz: 0 }, { dx: 0, dy: 13, dz: 0 }, { dx: 0, dy: 14, dz: 0 },
        { dx: 0, dy: 15, dz: 0 }, { dx: 0, dy: 16, dz: 0 }, { dx: 0, dy: 17, dz: 0 },
        { dx: 0, dy: 18, dz: 0 }, { dx: 0, dy: 19, dz: 0 }, { dx: 0, dy: 20, dz: 0 },
        { dx: 0, dy: 21, dz: 0 }, { dx: 0, dy: 22, dz: 0 }, { dx: 0, dy: 23, dz: 0 },
        { dx: 0, dy: 24, dz: 0 }
    ]

    player.sendPacket(SubChunkPacket);
    console.log("Sent " + SubChunkPacket.name);
    console.log(SubChunkPacket.origin);
    */
});

player.on(SpawnEvent.name, async () => {
	const plugins = fs.readdirSync("./Plugins").filter((file) => file.endsWith(".js"));

	plugins.forEach(async file => {
		const plugin = require("./Plugins/" + file);

		await plugin.onLoad(player);
		console.log("Loaded plugin " + plugin.name);
		await plugin.onEnable();
		console.log("Enabled plugin " + plugin.name);

		player.isConnected = true;
	});

	const position = player.client.startGameData.player_position;
	player.entity.position = new Vec3(position.x, position.y, position.z);
	player.playerState = new PlayerState(player, player.controls);
});

player.client.on("subchunk", (chunk) => {
	console.log("RECEIVED SUBCHUNK!");
	console.log(chunk);
});

player.on(InventoryContentEvent.name, async (data) => {
	if (data.window_id === "inventory") {
		const inventoryItems = data.input.filter(item => item);

		let i = 0;
		inventoryItems.forEach(item => {
			player.setSlot(i, item);
			i++;
		});
	}
});
