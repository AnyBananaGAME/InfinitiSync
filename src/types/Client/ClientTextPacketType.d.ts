import ClientPacket from "../ClientPacket";

declare class ClientTextPacketType extends ClientPacket {
    isQueued: boolean;
    message: string;
    type: any; 
    needs_translation: any;
    source_name: any;
    xuid: any;
    platform_chat_id: any;

    data(): {
        message: string;
        type: any;
        needs_translation: any;
        source_name: any;
        xuid: any;
        platform_chat_id: any;
    };
}

export = ClientTextPacketType;
