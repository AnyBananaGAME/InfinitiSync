const { ServerPacket } = require("../../network/packets/type/ServerPacket");
const {EventEmitter} = require("events");
const {StartGameData} = require("../../../index");
const { ServerEvent } = require("../ServerEvent");

/**
 * StartGameEvent
 */
class StartGameEvent extends ServerEvent{
    name = "StartGameEvent";
    /** @param {ServerPacket}  */
    packet;
    events;
    /**
     * 
     * @param {ServerPacket} packet 
     * @param {EventEmitter} events
     */
    constructor(packet, events){
        super()
        this.packet = packet;
        this.events = events;
    }
    call(){
        /** @var {StartGameEventData} data */
        let data = new StartGameEventData(this.packet);
        this.events.emit(this.name, data);
    }
}
class StartGameEventData {
    position;
    entity_id;
    runtime_entity_id;
    engine;
    dimension;



    /** @param {StartGameData} packet */
    constructor(packet){
        this.position = packet.player_position;
        this.entity_id = packet.entity_id;
        this.runtime_entity_id = packet.runtime_entity_id;
        this.engine = packet.engine;
        this.dimension = packet.dimension;

        // console.log(packet)
    }

    getUsername(){
        return this.packet.username;
    }

    getEntityId(){
        return this.entity_id;
    }
    getEntityRuntimeId(){
        return this.runtime_entity_id;
    }


    getPosition(){
        return this.position;
    }

    /**
     * Returns the dimension player spawned in
     * 
     * @returns Player dimension
     */
    getDimension() {
        return this.dimension;
    }

}
module.exports = {StartGameEvent, StartGameEventData}