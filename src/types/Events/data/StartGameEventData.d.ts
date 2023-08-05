import { StartGameData } from "../../../../index";

/**
 * StartGameEventData data.
 */
declare class StartGameEventData {
    private position: StartGameData['player_position'];
    private entity_id: StartGameData['entity_id'];
    private runtime_entity_id: StartGameData['runtime_entity_id'];
    private engine: StartGameData['engine'];
    private dimension: StartGameData['dimension'];
  
    constructor(packet: StartGameData);
    getUsername(): string;
    getEntityId(): bigint;
    getEntityRuntimeId(): bigint;
    getPosition(): StartGameData['player_position'];
    getDimension(): StartGameData['dimension'];
}
  
export = StartGameEventData;