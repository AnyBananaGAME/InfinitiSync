
declare class ClientPacket {
    isQueued: boolean;
    name: string;

    constructor(name: string);

    data(): void;
}

export = ClientPacket;
