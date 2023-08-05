const { Player } = require("../Player/Player");
const { Physics } = require('prismarine-physics');
const MinecraftData = require("minecraft-data");
const { Vec3 } = require("vec3");
const { ClientSubChunkRequestPacket } = require("../network/packets/ClientSubChunkRequestPacket");
const version = require('prismarine-registry')("bedrock_1.20.10")
const ChunkColumn = require('prismarine-chunk')(version);
const { LevelDB } = require('leveldb-zlib')
const { WorldProvider } = require('bedrock-provider');
const { ClientPlayerAuthInputPacket } = require("../network/packets/ClientPlayerAuthInputPacket");
const Block = require('prismarine-block')(version)

class World {
    physics;
    world;

    /**
     * 
     * @param registry
     * @param {MinecraftData.IndexedData} mcData 
     * @param block
     * @param {Player} player 
     */
    constructor(registry, mcData, block, player) {
        this.mcData = mcData;
        this.block = block;
        this.physics = new Physics(this.mcData, this.chunk);
        this.registry = registry;
        this.intervalSim = null;
        this.player = player;
    }
    async initialize() {
        try {
            const CCs = {}

            /**
              * Set Block Position
              * @date 8/4/2023 - 6:16:33 PM
              *
              * @type {{ getBlock: (pos: any) => any; setBlock: (pos: any, block: any) => number; }}
              */
            this.world = {
                getBlock: (pos) => {
                    //   console.log("Pos")
                    //    console.log(Math.floor(pos.x/16))
                    const chunk = CCs[`${Math.floor(pos.x / 16)},${Math.floor(pos.z / 16)}`] // x/16! z/16 !
                    if (!chunk) return 0;
                    //let dataY = (pos.y) / 2;
                    //if (dataY.toString().includes(".")) dataY = -(Math.ceil(dataY))

                    let block = chunk.getBlock(new Vec3(Math.floor(pos.x), Math.floor(pos.y + 64), Math.floor(pos.z)))
                    block.position = pos
                    return block
                },

                setBlock: (pos, block) => {
                    const chunk = CCs[`${Math.floor(pos.x / 16)},${Math.floor(pos.z / 16)}`] // x/16! z/16!
                    if (!chunk) return 0;
                    chunk.setBlock(new Vec3(Math.floor(pos.x), Math.floor(pos.y + 64), Math.floor(pos.z)), Block.fromStateId(block))
                }
            };

            /** Block Coordinates x,y,z */
            const positionOffset = {
                x: this.player.entity.position.x,
                y: this.player.entity.position.y - 5,
                z: this.player.entity.position.z
            };
            const blockCounts = {};
            this.player.client.on('level_chunk', async (packet) => {
                //console.log("level_chunk")
                const cc = new ChunkColumn({ x: packet.x, z: packet.z });

                await cc.networkDecodeNoCache(packet.payload, packet.sub_chunk_count);
                CCs[`${packet.x},${packet.z}`] = cc;
                const xx = packet.x;
                const zz = packet.z;
                // if(xx === 29) console.log(`${xx}  ${zz}`)
                //console.log(await cc.getBlock(new Vec3({x: this.player.entity.position.x, y: this.player.entity.position.y/, z: this.player.entity.position.z})))
                let ac = cc;
                let r = ac.registry;


                /*
                    let dataNull = [
                        'blocksByStateId',
                        'blocks',
                        'entitiesArray',
                        'blocksByName',
                        'blocksArray',
                        'blockStates',
                        'biomesByName',
                        'items',
                        'itemsByName',
                        'defaultSkin',
                        'entities',
                        'itemsArray',
                        'biomesArray',
                        'biomes',
                        'blockCollisionShapes',
                        'enchantments',
                        'recipes',
                        'instruments',
                        'instrumentsArray',
                        'materials',
                        'enchantmentsByName',
                        'enchantmentsArray',
                        'entitiesByName',
                        'windowsByName',
                        'effects',
                        'effectsByName',
                        ''
                    ];
                */

                //  dataNull.forEach(dataItem => {
                //   delete ac.registry[dataItem];
                //  });



                //  ac.sections.forEach(section => {
                //    console.log(section)
                //  });

                //   console.log(ac.sections)
                /*
                for (let i = 1; i < 255; i++) {
                    const block = cc.getBlock(new Vec3(xx, i, zz))
                    if (block) {
                        if (blockCounts[block.displayName]) {
                            blockCounts[block.displayName]["count"] += 1;
                        } else {
                            blockCounts[block.displayName] = {
                                count: 1,
                                stateId: block.stateId
                            };
                        }
                    }
                }
                */
            });
            this.player.client.once("spawn", (data) => {
                this.intervalSim = setInterval(() => {
                    let playerState = this.player.playerState;
                    this.physics.simulatePlayer(this.player.playerState, this.world).apply(this.player);

                    let PAIP = new ClientPlayerAuthInputPacket(this.player);
                //      console.log(this.player.playerState)
               //     this.player.playerState.pos.y = Number(this.player.playerState.pos.y);
                    PAIP.position = this.player.playerState.pos;
                    
                    PAIP.position.x = this.player.playerState.pos.x;
                    PAIP.position.y = this.player.playerState.pos.y; +1.62;
                    PAIP.position.z = this.player.playerState.pos.z;

                    PAIP.move_vector = {
                        x: Number(playerState.control.right) - Number(playerState.control.left),
                        z: Number(playerState.control.back) - Number(playerState.control.forward)
                    }
                    let OLD_POS_DATA = this.player.playerState.pos.clone()
                    PAIP.tick = BigInt(this.player.tick);

                    let player = this.player;

                    const posOffset = new Vec3(
                        Number(player.playerState?.pos?.x),
                        Number(player.playerState?.pos?.y) + 1.62011037597656,
                        Number(player.playerState?.pos?.z),
                    );

                    let iPacket = new ClientPlayerAuthInputPacket(this.player);
                    iPacket.yaw = player.entity.yaw;
                    iPacket.tick = BigInt(player.tick);
                    iPacket.position = posOffset;
                    iPacket.move_vector = player.moveVector;
                    iPacket.head_yaw = player.entity.yaw;
                    iPacket.delta = player.entity.velocity;


                    this.player.sendPacket(PAIP);
                    this.player.sendPacket(iPacket);
                }, 50);
            })
            setInterval(async () => {
            //    console.log(this.player.entity.position);
            //    const block = await this.world.getBlock({ x: this.player.entity.position.x, y: this.player.entity.position.y - 1, z: this.player.entity.position.z })
            //   console.log(`${block.position?.z} ${block.position?.y} ${block.position?.z} ${block.displayName} ${block.stateId}`)
            }, 5230);
            this.player.client.on("disconnect", async (data) => {
            })

            /*
            setInterval(() => {
                console.log(blockCounts)
            }, 15);
            */
        } catch (e) { console.log(e) }
    }

}
module.exports = { World }