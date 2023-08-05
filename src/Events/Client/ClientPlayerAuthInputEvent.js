const { ServerEvent } = require("../ServerEvent")

class ClientPlayerAuthInputEvent extends ServerEvent{
    name = "ClientPlayerAuthInputEvent";

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

module.exports = {ClientPlayerAuthInputEvent}