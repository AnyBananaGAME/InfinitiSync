const { ServerEvent } = require("../ServerEvent");

class SpawnEvent extends ServerEvent {
    name = "SpawnEvent";

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
module.exports = {SpawnEvent}