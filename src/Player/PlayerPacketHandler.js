const Client = require("bedrock-protocol");
const { Player } = require("./Player");
const { StartGameEvent } = require("../Events/Server/StartGameEvent");
const { SpawnEvent } = require("../Events/Server/SpawnEvent");
const { InventoryContentEvent } = require("../Events/Bidirectional/InventoryContentEvent");
const { InventoryTransactionEvent } = require("../Events/Bidirectional/InventoryTransactionEvent");
const { InventorySlotEvent } = require("../Events/Bidirectional/InventorySlotEvent");
const { ServerTextEvent } = require("../Events/Server/ServerTextEvent");
const { ClientSubChunkRequestPacket } = require("../network/packets/ClientSubChunkRequestPacket");
const { Vec3 } = require("vec3");

/**
 * Player Packet Handler
 * @date 8/2/2023 - 4:44:51 PM
 *
 * @class PlayerPacketHandler
 * @typedef {PlayerPacketHandler}
 */
class PlayerPacketHandler {
    client;
    player;

    /** 
     *  @param {Client} client  
     * @param {Player} player 
    */
    constructor(client, player) {
        this.client = client;
        this.player = player;
        this.handle(client);
    }

    handle(client) {
        client.on("spawn", (spawn) => {
            let Event = new SpawnEvent(spawn, this.player.events);
            Event.call();
        });

        client.on("packet", (packet) => {
            const player = this.player;
            switch (packet.data.name) {
                case "play_status":
                    player.client.queue('client_cache_status', { enabled: false })
                    //console.log(this.player.runtime_entity_id)
                    //player.client.queue('set_local_player_as_initialized', { runtime_entity_id: this.player.runtime_entity_id })
                    player.client.queue("request_chunk_radius", {
                        chunk_radius: 12
                    });
                    break;
                case "start_game":
                    let SGP = new StartGameEvent(packet.data.params, this.player.events);
                    SGP.call();
                    break;

                case "inventory_content":
                    let Event = new InventoryContentEvent(packet.data.params, this.player.events);
                    Event.call();
                    break;
                case "inventory_transaction":
                    console.log(packet)
                    let ITEvent = new InventoryTransactionEvent(packet.data.params, this.player.events);
                    ITEvent.call();
                    break;
                case "inventory_slot":
                    let ISEvent = new InventorySlotEvent(packet.data.params, this.player.events);
                    ISEvent.call();
                    break;
                case "set_score":
                    break;
                case "set_display_objective":
                    break;
                case "remove_objective":
                    break;
                case "level_chunk":
                    // console.log(packet.data.params)
                    break;
                case "set_entity_data":
                    break;
                case "set_time":
                    break;
                case "update_block":
                    console.log(packet.data.params);
                    this.player.world.world.setBlock(packet.data.params.position, packet.data.params.block_runtime_id)
                    break;
                case "level_event":
                    break;
                case "text":
                    let textE = new ServerTextEvent(packet.data.params, this.player.events, this.player);
                    textE.call();
                case "move_player":
                    if (packet.data.params.runtime_id == this.player.runtime_entity_id) {
                        //console.log(this.player.runtime_entity_id);
                        if (this.player.playerState !== null) {
                            let pos = this.player.playerState.pos;
                            pos.x = Number(packet.data.params.position.x);
                            pos.y = Number(packet.data.params.position.y);
                            pos.z = Number(packet.data.params.position.z);
                            this.player.playerState.onGround = true
                            this.player.playerState.yaw = packet.yaw
                        }
                    }
                    break;
                default:
                    console.log(packet.data.name)
                    break;
            }
        })
    }
}
module.exports = { PlayerPacketHandler }