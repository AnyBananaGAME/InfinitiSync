class ServerPacket {
	name;
	data;

	constructor(name, data) {
		this.name = name;
		this.data = data;
	}

	data() {
		return this.data;
	}
}
module.exports = { ServerPacket };
