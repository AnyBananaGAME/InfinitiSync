const { ClientPacket } = require("./type/ClientPacket");

class ClientTextPacket extends ClientPacket {
    name = "text";

    
    isQueued = false;
    message;
    type;
    needs_translation;
    source_name;
    xuid;
    platform_chat_id;

    data(){
        return {
            message: this.message,
            type: this.type,
            needs_translation: this.needs_translation,
            source_name: this.source_name,
            xuid: this.xuid,
            platform_chat_id: this.platform_chat_id
        };
    }
}
module.exports = {ClientTextPacket}