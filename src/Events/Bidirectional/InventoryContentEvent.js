const { ServerEvent } = require("../ServerEvent");

class InventoryContentEvent extends ServerEvent {
    name = "InventoryContentEvent";

    packet;
    events;

    constructor(packet, events) {
        super()
        this.packet = packet;
        this.events = events;
    }
    call(){
        this.events.emit(this.name, this.packet);
    }
}

module.exports = {InventoryContentEvent}