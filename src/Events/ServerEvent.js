class ServerEvent {
    name;
    /** @param {ServerPacket}  */
    packet;
    events;


    constructor(packet, events){
        this.packet = packet;
        this.events = events;
    }
    call(){}


}
module.exports = {ServerEvent}