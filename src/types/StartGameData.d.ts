import { Client } from "bedrock-protocol/index"

interface PlayerPosition {
    x: number;
    y: number;
    z: number;
}

interface Rotation {
    x: number;
    z: number;
}

interface SpawnPosition {
    x: number;
    y: number;
    z: number;
}

interface Experiment {}

interface BlockProperty {}

interface ItemState {}

interface EduResourceUri {
    button_name: string;
    link_uri: string;
}

interface PropertyData {
    type: string;
    name: string;
    value: any; 
}

interface StartGameData extends Client{
    entity_id: bigint;
    runtime_entity_id: bigint;
    player_gamemode: 'creative' | 'survival' | 'adventure' | 'spectator';
    player_position: PlayerPosition;
    rotation: Rotation;
    seed: bigint;
    biome_type: number;
    biome_name: string;
    dimension: string;
    generator: number;
    world_gamemode: 'creative' | 'survival' | 'adventure' | 'spectator';
    difficulty: number;
    spawn_position: SpawnPosition;
    achievements_disabled: boolean;
    editor_world: boolean;
    created_in_editor: boolean;
    exported_from_editor: boolean;
    day_cycle_stop_time: number;
    edu_offer: number;
    edu_features_enabled: boolean;
    edu_product_uuid: string;
    rain_level: number;
    lightning_level: number;
    has_confirmed_platform_locked_content: boolean;
    is_multiplayer: boolean;
    broadcast_to_lan: boolean;
    xbox_live_broadcast_mode: number;
    platform_broadcast_mode: number;
    enable_commands: boolean;
    is_texturepacks_required: boolean;
    gamerules: any[];
    experiments: Experiment[];
    experiments_previously_used: boolean;
    bonus_chest: boolean;
    map_enabled: boolean;
    permission_level: string;
    server_chunk_tick_range: number;
    has_locked_behavior_pack: boolean;
    has_locked_resource_pack: boolean;
    is_from_locked_world_template: boolean;
    msa_gamertags_only: boolean;
    is_from_world_template: boolean;
    is_world_template_option_locked: boolean;
    only_spawn_v1_villagers: boolean;
    persona_disabled: boolean;
    custom_skins_disabled: boolean;
    emote_chat_muted: boolean;
    game_version: string;
    limited_world_width: number;
    limited_world_length: number;
    is_new_nether: boolean;
    edu_resource_uri: EduResourceUri;
    experimental_gameplay_override: boolean;
    chat_restriction_level: 'none' | 'command' | 'shown' | 'hidden';
    disable_player_interactions: boolean;
    level_id: string;
    world_name: string;
    premium_world_template_id: string;
    is_trial: boolean;
    movement_authority: 'client' | 'server';
    rewind_history_size: number;
    server_authoritative_block_breaking: boolean;
    current_tick: bigint;
    enchantment_seed: number;
    block_properties: BlockProperty[];
    itemstates: ItemState[];
    multiplayer_correlation_id: string;
    server_authoritative_inventory: boolean;
    engine: string;
    property_data: PropertyData;
    block_pallette_checksum: bigint;
    world_template_id: string;
    client_side_generation: boolean;
    block_network_ids_are_hashes: boolean;
    server_controlled_sound: boolean;
}


export = StartGameData;