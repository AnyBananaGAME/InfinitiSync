import { ServerPacket } from "../../network/packets/type/ServerPacket"
import { EventEmitter } from 'events';


declare class StartGameEvent {
  name: string;
  packet: ServerPacket;
  events: EventEmitter;

  constructor(packet: ServerPacket, events: EventEmitter);
  call(): void;
}

export = StartGameEvent;