const { ClientPacket } = require("./type/ClientPacket");

class ClientPlayerAuthInputPacket extends ClientPacket {
	name = "player_auth_input";
	isQueued = true;

	constructor() {
		super();
	}

	pitch = 3;
	yaw = 85;
	tick;

	position;
	move_vector = { x: 0, z: 0 };
	head_yaw = 0;
	input_mode = "mouse";
	play_mode = "screen";
	interaction_model = "touch";
	gaze_direction = undefined;
	delta = { x: 0, y: 0, z: 0 };
	transaction = undefined;
	item_stack_request = undefined;
	block_action = undefined;
	analogue_move_vector = { x: 0, z: 0 };
	input_data = {
		_value: BigInt(0),
		ascend: false,
		descend: false,
		north_jump: false,
		jump_down: false,
		sprint_down: false,
		change_height: false,
		jumping: false,
		auto_jumping_in_water: false,
		sneaking: false,
		sneak_down: false,
		up: false,
		down: false,
		left: false,
		right: false,
		up_left: false,
		up_right: false,
		want_up: false,
		want_down: false,
		want_down_slow: false,
		want_up_slow: false,
		sprinting: false,
		ascend_block: false,
		descend_block: false,
		sneak_toggle_down: false,
		persist_sneak: false,
		start_sprinting: false,
		stop_sprinting: false,
		start_sneaking: false,
		stop_sneaking: false,
		start_swimming: false,
		start_jumping: false,
		start_gliding: false,
		stop_gliding: false,
		item_interact: false,
		block_action: false,
		item_stack_request: false,
		handled_teleport: false,
		emoting: false,
		missed_swing: false,
		start_crawling: false,
		stop_crawling: false
	};


	data(){
		return {
			pitch: this.pitch,        
			yaw: this.yaw,
			position: this.position,
			move_vector: this.move_vector,
			head_yaw: this.head_yaw,
			input_data: this.input_data,
			input_mode: this.input_mode,
			play_mode: this.play_mode,
			interaction_model: this.interaction_model,
			gaze_direction: this.gaze_direction,
			tick: this.tick,
			delta: this.delta,
			transaction: this.transaction,
			item_stack_request: this.item_stack_request,
			block_action: this.block_action,
			analogue_move_vector: this.analogue_move_vector
		};
	}
}
module.exports = {ClientPlayerAuthInputPacket};
