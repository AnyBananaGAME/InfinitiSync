const { ClientPacket } = require("./type/ClientPacket");

class ClientSubChunkRequestPacket extends ClientPacket {
	name = "subchunk_request";
	isQueued = true;

	dimension;
	origin;
	requests;

	constructor(player) {
		super();
	}


	data() {
		return {
			dimension: this.dimension,
			origin: this.origin,
			requests: this.requests
		};
	}
}
module.exports = { ClientSubChunkRequestPacket };
