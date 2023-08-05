const { ClientPacket } = require("./type/ClientPacket");

class ClientDropItemPacket extends ClientPacket {
  name = "inventory_transaction";
  isQueued = true;


  /**
   * 
   * @param {Array} item 
   * @param {Number} count 
   * @param {Number} slot 
   */
  constructor(item, count, slot, randomId) {
    super();
    this.slot = slot;
    this.count = count;
    this.item = item;
    console.log(this.item);
    this.randomId = randomId;

    this.newItem = JSON.parse(JSON.stringify(item));
    console.log(this.newItem);
    this.newItem.count = count;

    this.newItem2 = JSON.parse(JSON.stringify(item));
    console.log(this.newItem2);
    this.newItem2.count = Math.floor(item.count - count);
    if (this.newItem2.count === 0) {
      this.newItem2 = this.old_item1;
    }
    console.log(`${count}  ${this.item.count}  ${this.newItem.count}   ${this.newItem2.count}`)
  }


  /** @type {Number} */
  slot;
  /** @private */
  count;
  /** * @type {Array}*/
  item;
  newItem;
  newItem2;
  randomId;


  /** @private */
  old_item1 = {
    network_id: 0,
    count: undefined,
    metadata: undefined,
    has_stack_id: undefined,
    stack_id: undefined,
    block_runtime_id: undefined,
    extra: undefined
  }

  data() {
    /*
      const dataa = {
        transaction: {
          legacy: {
            legacy_request_id: 0,
            legacy_transactions: [
              { container_id: 29, changed_slots: [{ slot_id: this.slot }] }
            ]
          },
          transaction_type: 'normal',
          actions: [
            {
              source_type: 'world_interaction',
              inventory_id: undefined,
              action: undefined,
              flags: 0,
              slot: this.slot,
              old_item: this.old_item1,
              new_item: this.newItem
            },
            {
              source_type: 'container',
              inventory_id: 'inventory',
              action: undefined,
              flags: undefined,
              slot: this.slot,
              old_item: this.item,
              new_item: this.newItem2
            }
          ],
          transaction_data: undefined
        }
      }
      console.log(dataa.transaction.actions);
      */
    return {
      transaction: {
        legacy: {
          legacy_request_id: this.randomId,
          legacy_transactions: [
            { container_id: 29, changed_slots: [{ slot_id: this.slot }] }
          ]
        },
        transaction_type: 'normal',
        actions: [
          {
            source_type: 'world_interaction',
            inventory_id: undefined,
            action: undefined,
            flags: 0,
            slot: 0,
            old_item: this.old_item1,
            new_item: this.newItem
          },
          {
            source_type: 'container',
            inventory_id: 'inventory',
            action: undefined,
            flags: undefined,
            slot: this.slot,
            old_item: this.item,
            new_item: this.newItem2
          }
        ],
        transaction_data: undefined
      }
    };

  }
}
module.exports = { ClientDropItemPacket }



/*
{
transaction: {
legacy: {
  legacy_request_id: -98,
  legacy_transactions: [
    { container_id: 29, changed_slots: [ { slot_id: 0 } ] }
  ]
},
transaction_type: 'normal',
actions: [
  {
    source_type: 'world_interaction',
    inventory_id: undefined,
    action: undefined,
    flags: 0,
    slot: 0,
    old_item: {
      network_id: 0,
      count: undefined,
      metadata: undefined,
      has_stack_id: undefined,
      stack_id: undefined,
      block_runtime_id: undefined,
      extra: undefined
    },
    new_item: {
      network_id: -486,
      count: 1,
      metadata: 0,
      has_stack_id: 0,
      stack_id: undefined,
      block_runtime_id: 2058,
      extra: {
        has_nbt: 0,
        nbt: undefined,
        can_place_on: [],
        can_destroy: []
      }
    }
  },
  {
    source_type: 'container',
    inventory_id: 'inventory',
    action: undefined,
    flags: undefined,
    slot: 0,
    old_item: {
      network_id: -486,
      count: 54,
      metadata: 0,
      has_stack_id: 0,
      stack_id: undefined,
      block_runtime_id: 2058,
      extra: {
        has_nbt: 0,
        nbt: undefined,
        can_place_on: [],
        can_destroy: []
      }
    },
    new_item: {
      network_id: -486,
      count: 53,
      metadata: 0,
      has_stack_id: 0,
      stack_id: undefined,
      block_runtime_id: 2058,
      extra: {
        has_nbt: 0,
        nbt: undefined,
        can_place_on: [],
        can_destroy: []
      }
    }
  }
],
transaction_data: undefined
}
}
*/