const { Player } = require("../../Player/Player");
const { ServerEvent } = require("../ServerEvent");
const {EventEmitter} = require("events")
class ServerTextEvent extends ServerEvent {
    name = "ServerTextEvent";

    packet;
    events;

    /**
     * @param {Packet} packet 
     * @param {EventEmitter} events 
     * @param {Player} player 
     */
    constructor(packet, events, player) {
        super()
        this.packet = packet;
        this.events = events;

        if ((packet.parameters[1])?.includes("!cinfo")) {
            player.sendMessage("This client runs InfinitySync created by bonanoo (<- discord)")
        }
    }
    call() {
        this.events.emit(this.name, this.packet);
    }
}
module.exports = { ServerTextEvent }