# InfinitiSync 

> [!WARNING]
> This is not a fully working/finished project so don't blame me for anything that happens.


## To contribute just open a PR it will be reviewed and if it works and is clear it will be merged and you will be credited. (Formatting code isnt included)

> [!IMPORTANT]
> This tool was only tested on MCBE 1.20.10 and most likely will **ONLY** Work on 1.20.10+ and might break at any version above.
> This was only testes on PocketMineMP. And most stuff wont work or may crash on Non PMMP servers.

> [!NOTE]
> This project is strictly non-commercial and not for distribution with any exchange. Making money from this project is prohibited. Please respect these terms and use the project responsibly.

# Cool stuff?
_BetterIS.js file (plugin) Will start an Express server that will allow you to view players inventory and drop items using buttons.
_ http://localhost:3000//api/drop
# API
  - Sending messages.
    - {String} message
    ```js
      player.sendMessage(message);
    ```
  - Dropping items.
    - {Number} count
    - {Number} Slot
    ```js
      player.dropItem(count, slot);
    ```
  - Set Item in slot.
    > [!WARNING]
    > You should not use this if you dont know what it may cause
    - {Number} slot
    - {Array} item
    ```js
      player.setSlot(slot, item);
    ```
  - Get the item from slot.
    - {Number} slot
    ```js
      player.getSlot(slot);
    ```
  - Get Players position
    ```js
      player.getPosition();
    ```
  - Get block in world.
    - {Array} position
      - The Array must be {x,y,z} positions
    ```js
      player.world.world.getBlock(position);
    ```
 # Credits.
  - [SineVector241](https://github.com/SineVector241) For showing some examples of Physics.
  - [CreeperG16](https://github.com/CreeperG16) For some types. in ./src/types/types.d.ts
  - baghii [discord name] For 1.20.10 blocks list

