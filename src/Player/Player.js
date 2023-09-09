const { Client } = require("bedrock-protocol/src/client");
const { StartGameData, ClientPacket, ClientTextPacketType } = require("../../index");
const { EventEmitter } = require("events");
const { PlayerPacketHandler } = require("./PlayerPacketHandler");
const { ClientTextPacket } = require("../network/packets/ClientTextPacket");
const { ClientDropItemPacket } = require("../network/packets/ClientDropItemPacket");
const { ClientPlayerAuthInputPacket } = require("../network/packets/ClientPlayerAuthInputPacket");
const { Vec3 } = require("vec3");
const { World } = require("../World/World");

const version = require("prismarine-registry")("bedrock_1.19.70");
const mcData = require("minecraft-data")(version.version.majorVersion);

class Player {
	/** @type {Client} client */
	client;

	/** @type {boolean} */
	isConnected;
	/** @type {any[]} @todo */
	events;
	/** @type {number} */
	randomId = -2;
	/** @type {StartGameData | undefined} */
	startGameData;
	/** @type {any} @todo */
	inventory = { slots: [] };
	/** @type {number} */
	tick = 0;

	/** @type {any} @todo */
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
	};

	/** @type {number} */
	jumpTicks = 0;
	/** @type {boolean} */
	jumpQueued = false;
	/** @type {any} @todo */
	version = mcData.version.version;
	/** @type {any} @todo */
	moveVector = { x: 0, z: 0 }; /** @todo Vec2 */
	/** @type {any} @todo */
	controls = {
		forward: false,
		back: false,
		left: false,
		right: false,
		jump: false,
		sprint: false,
		sneak: false,
	};
	/** @type {any} @todo */
	playerState;
	/** @type {World}  */
	world;
	/** @type {number} */
	runtime_entity_id;

	/** @param {Client} client */
	constructor(client) {
		this.client = client;
		this.name = client.username;

		this.events = new EventEmitter();
		this.packetHandler = new PlayerPacketHandler(this.client, this);

		setInterval(() => {
			this.tick++;
		}, 50);
	}

	getUsername() {
		return this.client.username;
	}

	/** @param {Vec3} position */
	moveTo(position) {
		this.entity.position.x = position.x;
		this.entity.position.y = position.y;
		this.entity.position.z = position.z;

		const packet = new ClientPlayerAuthInputPacket(this);
		packet.position = position;
		packet.tick = BigInt(this.tick);
		this.sendPacket(PAIMpkt);
	}

	/**
	 * @param {boolean} [forward=false]
	 * @param {boolean} [back=false]
	 * @param {boolean} [left=false]
	 * @param {boolean} [right=false]
	 * @param {boolean} [jump=false]
	 * @param {boolean} [sprint=false]
	 * @param {boolean} [sneak=false]
	 */
	move(forward = false, back = false, left = false, right = false, jump = false, sprint = false, sneak = false) {
		this.controls.forward = back;
		this.controls.back = forward;
		this.controls.left = right;
		this.controls.right = left;
		this.controls.jump = jump;
		this.controls.sprint = sprint;
		this.controls.sneak = sneak;

		this.moveVector.z = forward ? 1 : (back ? -1 : 0);
		this.moveVector.x = right ? -1 : (left ? 1 : 0);
	}

	/** 
	 * @param {Number} slot 
	 * @param {any} item @todo
	  */
	setSlot(slot, item) {
		this.inventory.slots[slot] = item;
	}

	/** @returns {any} @todo */
	getSlot(slot) {
		return this.inventory.slots[slot];
	}

	/** @param {Array} position */
	setPosition(position) {
		this.position = position;
	}

	/** @return {Vec3} */
	getPosition() {
		return this.playerState.pos;
	}

	/** @param {ClientPacket} packet */
	sendPacket(packet) {
		if (packet.isQueued) {
			this.client.queue(packet.name, packet.data());
		} else {
			this.client.write(packet.name, packet.data());
		}
	}

	/** @param {string} message */
	sendMessage(message) {
		const packet = new ClientTextPacket();
		packet.type = "chat";
		packet.needs_translation = false;
		packet.xuid = "";
		packet.platform_chat_id = "";
		packet.message = message.toString();
		packet.source_name = this.getUsername();
		packet.isQueued = true;

		this.sendPacket(pkt);
	}

	/**
   * Drop an item from inventory
   *
   * @param {number} count
   * @param {number} slot
   */
	dropItem(count, slot) {
		if (isNaN(count)) throw new Error("dropItem => Count value must be a number!");
		if (count <= 0) throw new Error("dropItem => Count value must be greater than 0!");
		
		const item = this.getSlot(slot);
		
		if (!item.count) throw new Error("Item count is at 0!");
		if (count > item.count) throw new Error("dropItem => Count value must be less than items count!");
		
		const dropPacket = new ClientDropItemPacket(item, count, slot, this.randomId);
		
		this.sendPacket(dropPacket);
		this.randomId = this.randomId - 2;
	}

	/**
	 * @param {string} name 
  	 * @param {any} data 
  	 */
	on(name, data) {
		this.events.on(name, data);
	}

	/**
	 * @param {string} name 
  	 * @param {any} data 
  	 */
	once(name, data) {
		this.events.once(name, data);
	}
}
module.exports = { Player };
