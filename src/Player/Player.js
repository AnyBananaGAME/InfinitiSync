const { Client } = require("bedrock-protocol/src/client");
const { StartGameData, ClientPacket, ClientTextPacketType } = require("../../index");
const { EventEmitter } = require("events");
const { PlayerPacketHandler } = require("./PlayerPacketHandler");
const { ClientTextPacket } = require("../network/packets/ClientTextPacket");
const { ClientDropItemPacket } = require("../network/packets/ClientDropItemPacket");
const { ClientPlayerAuthInputEvent } = require("../Events/Client/ClientPlayerAuthInputEvent");
const { ClientPlayerAuthInputPacket } = require("../network/packets/ClientPlayerAuthInputPacket");
const { Vec3 } = require("vec3");
const { PlayerState } = require("prismarine-physics");
const { World } = require("../World/World");


const version = require('prismarine-registry')('bedrock_1.19.70');
const mcData = require("minecraft-data")(version.version.majorVersion);
const block = require('prismarine-block')(version);

class Player {
  /** @var {Client} client */
  client;
  isConnected;
  /**
   * @date 8/3/2023 - 12:21:28 AM
   * @type {Array};
   */
  events;
  /** 
   * Data from start_game Packet.
   * @type {StartGameData} 
   */
  randomId = Number(-2);
  startGameData;
  inventory = { slots: [] };
  tick = 0;
  entity = {
    position: new Vec3(this.client?.startGameData.player_position.x, this.client?.startGameData.player_position.y, this.client?.startGameData.player_position.z),
    velocity: new Vec3(0, 0, 0),
    onGround: false,
    isInWater: false,
    isInLava: false,
    isInWeb: false,
    isCollidedHorizontally: false,
    isCollidedVertically: false,
    yaw: 0,
    effects: [],
  }

  jumpTicks = 0;
  jumpQueued = false;
  version = mcData.version.version;
  moveVector = { x: 0, z: 0 }
  controls = {
    forward: false,
    back: false,
    left: false,
    right: false,
    jump: false,
    sprint: false,
    sneak: false,
  };
  playerState;
  /** @type {World}  */
  world;
  runtime_entity_id;
  
  /** @param {Client} client */
  constructor(client) {
    this.client = client;
    this.name = client.username;
    this.events = new EventEmitter();
    this.PacketHandler = new PlayerPacketHandler(this.client, this)

    // this.startGameData = client.startGameData;
    // this.position = this.startGameData?.player_position;
    setInterval(() => {
      this.tick = this.tick++;
    }, 50);
  }

  getUsername() {
    return this.client.username;
  }
  /**
   * Move to specific coordinates
   * 
   * @param {Array} position 
   */
  moveTo(position) {
    let PAIMpkt = new ClientPlayerAuthInputPacket(this);
    this.entity.position.x = position.x;
    this.entity.position.y = position.y;
    this.entity.position.z = position.z;
    PAIMpkt.position = position;
    PAIMpkt.tick = BigInt(this.tick);
    this.sendPacket(PAIMpkt);

  }

  move(forward = false, back = false, left = false, right = false, jump = false, sprint = false, sneak = false) {
    this.controls.forward = back;
    this.controls.back = forward;
    this.controls.left = right;
    this.controls.right = left;
    this.controls.jump = jump;
    this.controls.sprint = sprint;
    this.controls.sneak = sneak;

    if (forward) {
      this.moveVector.z = 1;
    }
    else if (back) {
      this.moveVector.z = -1;
    }
    else if (!forward && !back) {
      this.moveVector.z = 0;
    }

    if (right) {
      this.moveVector.x = -1;
    }
    else if (left) {
      this.moveVector.x = 1;
    }
    else if (!left && !right) {
      this.moveVector.x = 0;
    }
  }

  /**
   * Set item to a slot
   * 
   * @param {Number} slot 
   * @param {Array} item 
   */
  setSlot(slot, item) {
    this.inventory.slots[slot] = item;
  }

  /**
   * Get the item from the slot
   * @date 8/2/2023 - 4:47:03 PM
   *
   * @param {number} slot
   * @returns {*}
   */
  getSlot(slot) {
    return this.inventory.slots[slot];
  }

  /**
   * Set Players position.
   * @date 8/3/2023 - 12:24:47 AM
   *
   * @param {Array} position
   */
  setPosition(position) {
    this.position = position;
  }
  /**
     * getPosition
     * @date 8/3/2023 - 12:25:09 AM
     *
     * @param {*} packet
     */
  getPosition() {
    return this.playerState.pos;
  }

  /** 
   * Send a packet to player 
   * @param {ClientPacket} packet */
  sendPacket(packet) {
    if (packet.isQueued) {
      this.client.queue(packet.name, packet.data());
    } else {
      this.client.write(packet.name, packet.data());
    }
  }
  /**
   * Send a message as a player.
   * 
   * @param {String} message 
   */
  sendMessage(message) {
    /** @type {ClientTextPacketType}  */
    let pkt = new ClientTextPacket();
    pkt.type = "chat";
    pkt.needs_translation = false;
    pkt.xuid = '';
    pkt.platform_chat_id = '';
    pkt.message = String(message);
    pkt.source_name = this.getUsername();
    pkt.isQueued = true;
    this.sendPacket(pkt)
  }

  /**
   * Drop an item from inventory
   * @date 8/2/2023 - 6:23:43 PM
   *
   * @param {number} count
   * @param {number} slot
   * @public 
   */
  dropItem(count, slot) {
    if (isNaN(count)) return console.log("dropItem => Count value mut be a number!");
    if (count <= 0) return console.log("dropItem => Count value must be greater than 0!");
    let item = this.getSlot(slot);
    if (item.count === 0 || item.count === undefined || item.count === null) return console.log("Item count is at 0 unable to drop!")
    if (count > item.count) return console.log("dropItem => Count value must be less than items count!");
    let DropPacket = new ClientDropItemPacket(item, count, slot, this.randomId);
    this.sendPacket(DropPacket);
    this.randomId = this.randomId - 2;
  }
  /**
   * 
   * @param {String} name  
   */
  on(name, data) {
    this.events.on(name, data);
  }

  /**
  * 
  * @param {String} name 
  * @param {Array} data 
  */
  once(name, data) {
    this.events.once(name, data);
  }
}
module.exports = { Player }