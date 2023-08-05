const { createClient } = require("bedrock-protocol");
const { Player } = require("./src/Player/Player");
const { StartGameEvent } = require("./src/Events/Server/StartGameEvent");
const { StartGameEventData } = require("./index");
const fs = require("fs");
const { SpawnEvent } = require("./src/Events/Server/SpawnEvent");
const { InventoryContentEvent } = require("./src/Events/Bidirectional/InventoryContentEvent");
const { World } = require("./src/World/World");
const { Vec3 } = require("vec3");
const { ClientSubChunkRequestPacket } = require("./src/network/packets/ClientSubChunkRequestPacket");
const { ClientPlayerAuthInputPacket } = require("./src/network/packets/ClientPlayerAuthInputPacket");
const { PlayerState } = require("prismarine-physics");
const version = require('prismarine-registry')('bedrock_1.20.10');
const mcData = require("minecraft-data")(version.version.majorVersion);
const block = require('prismarine-block')(version);

const client = createClient({
    host: "192.168.1.58",
    username: "ImoHigh",
    port: 19132,
    profilesFolder: "./src/Tokens",
    raknetBackend: "raknet-native",
    skipPing: true
})
/** @type {Player} player */
const player = new Player(client);
var world = new World(version, mcData, block, player);
player.world = world;
world.initialize();

player.on(StartGameEvent.name, /** @param {StartGameEventData} data */(data) => {
    // console.log(player.client.startGameData);    
    const pos = data.getPosition();
    console.log(pos)
    player.entity.position = pos;
    console.log(player.entity.position.x)
    player.runtime_entity_id = data.getEntityRuntimeId();
   // console.log("data");
   // console.log(client.startGameData)
   // let a = new Vec3(client?.startGameData.player_position.x, client?.startGameData.player_position.y, client?.startGameData.player_position.z);
   // console.log(a); 


    /*
    let SubChunkPacket = new ClientSubChunkRequestPacket();
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
})


/** Data will be undefined here future me! */
player.on(SpawnEvent.name, async (data) => {
    const plugins = fs.readdirSync("./Plugins").filter((file) => file.endsWith(".js"));
    plugins.forEach(async file => {
        let plugin = require("./Plugins/" + file);
        await plugin.onLoad(player);
        console.log("Loaded plugin " + plugin.name);
        await plugin.onEnable()
        console.log("Enabled plugin " + plugin.name);
        player.isConnected = true;
    })
    let pos = player.client.startGameData.player_position;
   player.entity.position = new Vec3(pos.x, pos.y, pos.z);
   player.playerState = new PlayerState(player, player.controls);

})
player.client.on("subchunk", (p) => {
    console.log("RECEIVED SUBCHUNK!");
    console.log(p)
})
player.on(InventoryContentEvent.name, async (data) => {
    // inventoryItems = data.input.filter(item => item.network_id !== 0);
    if (data.window_id === "inventory") {
        const inventoryItems = data.input.filter(item => item);
        let i = 0;
        inventoryItems.forEach(item => {
            player.setSlot(i, item);
            i = i + 1;
        });
        const timestamp = Date.now();
        const date = new Date(timestamp);
        const dateString = date.toString();
        // console.log(dateString);
        // console.log(`Slot 0 `);
        // console.log(inventoryItems[0]);

    }
})


setInterval(() => {
    const posOffset = new Vec3(
        Number(player.playerState?.pos?.x),
        Number(player.playerState?.pos?.y), //+ 1.62011037597656,
        Number(player.playerState?.pos?.z),
    );
    // console.log(posOffset); 
    if (player.playerState !== null && false && !isNaN(player.playerState?.pos?.x)) {
        //console.log("FAK")
        let iPacket = new ClientPlayerAuthInputPacket(player);
        iPacket.yaw = player.entity.yaw;
        iPacket.tick = BigInt(player.tick);
        iPacket.position = posOffset;
        iPacket.move_vector = player.moveVector;
        iPacket.head_yaw = player.entity.yaw;
        iPacket.delta = player.entity.velocity;
        player.sendPacket(iPacket);
        // player.entity.position.y = player.entity.position.y+1.62001037597656
    }
}, 50);