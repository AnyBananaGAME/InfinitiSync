const version = require('prismarine-registry')('bedrock_1.20');
const ChunkColumn = require('prismarine-chunk')(version);
const { LevelDB } = require('leveldb-zlib')
const { WorldProvider } = require('bedrock-provider')
const { Relay, Player } = require("bedrock-protocol");
const { Vec3 } = require("vec3")
const sleep = ms => new Promise((resolve) => setTimeout(resolve, ms))



const util = require("util")
const relay = new Relay({
    host: "127.0.0.1",
    port: 19133,
    version: "1.20.10",
    destination: {
        host: "127.0.0.1",
        port: 19132
    },
    profilesFolder: "./src/Tokens",
    batchingInterval: 25,
    forceSinge: true
})
relay.listen();
relay.conLog = console.log;
const blockCounts = {};

// const db = new LevelDB('./WorldData', { createIfMissing: true })
// db.open();
// const world = new WorldProvider(db, { dimension: 0, version })
// console.log(packet)

log()
async function log(){
    await sleep(12000);
    console.log(blockCounts)
}

relay.on("connect", /** @type {Player} player */(player) => {

    player.on("clientbound", async ({ name, params }) => {
        if (name === "//level_chunk") return;
        if (name === "set_display_objective") return;
        if (name === "set_score") return;
        if (name === "remove_objective") return;
        if (name === "animate") return;
        if (name === "move_entity") return;
        if (name === "set_entity_motion") return;
        if (name === "update_block") return;
        if (name === "network_chunk_publisher_update") return;
        if (name === 'subchunk') {
            console.log(util.inspect(params, { showHidden: false, depth: null, colors: true }))
        }

        if (name === "level_chunk") {
            const cc = new ChunkColumn({ x: params.x, z: params.z });
            console.log(cc)
            await cc.networkDecodeNoCache(params.payload, params.sub_chunk_count);
    
            const xx = params.x;
            const zz = params.z;

            for (let i = 0; i < 255; i++) {
                
                const block = cc.getBlock(new Vec3(xx, i, zz))
                if (blockCounts[block.displayName]) {
                    blockCounts[block.displayName] += 1;
                } else {
                    blockCounts[block.displayName] = 1;
                }
            }
        }
        console.log(name)
    })
    logged = false;
    player.on("serverbound", ({ name, params }) => {
        if (name === "player_auth_input") return;
        if (name === "/level_chunk") return;

        if (name === "+inventory_transaction" || name === "+mob_equipment" || name === "subchunk_request") {
            console.log(util.inspect(params, { showHidden: false, depth: null, colors: true }))
            logged = true;
        }

        console.log(name)
    })
})

relay.on("close", () => {
    db.close();
})
