const { ServerEvent } = require("../ServerEvent");

class InventorySlotEvent extends ServerEvent {
	name = "InventorySlotEvent";

	packet;
	events;

	constructor(packet, events) {
		super();
		this.packet = packet;
		this.events = events;
	}
	call(){
		this.events.emit(this.name, this.packet);
	}
}

module.exports = {InventorySlotEvent};
