const { ServerEvent } = require("../ServerEvent");

class InventoryTransactionEvent extends ServerEvent{
	name = "InventoryTransactionEvent";

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
module.exports = {InventoryTransactionEvent};
