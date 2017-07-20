/**
 * CC scratch extension
 * 
 */

var client = null;
var loadFailed = false;
var connectionUpdateInterval = null;
var statusEnum = Object.freeze({
    NOT_STARTED: { status: 0, msg: "Code Connection not started" },
    NOT_CONNECTED: { status: 1, msg: "Code Connection is not connected to the minecraft" },
    CONNECTED: { status: 2, msg: "Connected" }
});
var connectionStatus = null;

// load cc_client script 
$.getScript("https://mojang.github.io/cc-client.js").done(function () {
    console.log("CC Client loaded");
    client = new cc_client(8080);
    // initialize connection status
    connectionStatus = statusEnum.NOT_STARTED;
    // set connection status update interval
    connectionUpdateInterval = setInterval(() => {
        client.connectionStatusUpdate((result) => {
            if (result) {
                connectionStatus = statusEnum.CONNECTED;
            } else {
                connectionStatus = statusEnum.NOT_CONNECTED;
            }
        }, 1000);
    }, 2000);
    // if load fails
}).fail(function () {
    console.log("Not able to load CC client");
    loadFailed = true;
});

function createBlockPos(x, y, z, isRelative) {
    const prefix = isRelative === 'relative' ? "~" : "";
    // encode unsafe characters
    return encodeURIComponent(`${prefix}${x} ${prefix}${y} ${prefix}${z}`);
}

(function (ext) {
    var blocks = ['air','cobblestone','stonebrick','mossy_cobblestone','planks','brick_block','stone','dirt','podzol','grass','mycelium','clay','hardened_clay','stained_hardened_clay','sandstone','sand','gravel','log', 'log2', 'nether_brick','soul_sand','bedrock','stone_stairs','oak_stairs','spruce_stairs','birch_stairs','jungle_stairs','acacia_stairs', 'dark_oak_stairs', 'brick_stairs','sandstone_stairs','red_sandstone_stairs','stone_brick_stairs','nether_brick_stairs', 'quartz_stairs', 'purpur_stairs', 'stone_slab',  'wooden_slab','stone_slab2','quartz_block', 'prismarine', 'purpur_block','coal_ore','iron_ore','gold_ore','diamond_ore','lapis_ore','redstone_ore','emerald_ore','quartz_ore', 'obsidian', 'ice', 'packed_ice','snow', 'end_bricks', 'end_stone','allow', 'deny', 'border_block',"netherbrick","netherrack","red_sandstone"];

    blocks.sort();
    
    var decorations = ['beacon','cobblestone_wall', 'waterlily', 'sealantern', 'gold_block','iron_block','diamond_block','lapis_block', 'coal_block','emerald_block','redstone_block', 'snow_layer', 'glass','glowstone','vine','ladder','sponge', 'glass_pane','wooden_door','spruce_door','birch_door','jungle_door','acacia_door','dark_oak_door','iron_door','trapdoor','iron_trapdoor','fence','nether_brick_fence','fence_gate', 'spruce_fence_gate','birch_fence_gate','jungle_fence_gate','acacia_fence_gate', 'dark_oak_fence_gate', 'iron_bars','bed','bookshelf','sign','painting','frame','crafting_table','stonecutter','chest','trapped_chest','furnace','brewing_stand', 'cauldron','noteblock','end_portal_frame', 'anvil','yellow_flower', 'red_flower','double_plant','brown_mushroom','red_mushroom','brown_mushroom_block','red_mushroom_block','cactus','melon_block','pumpkin','lit_pumpkin', 'web', 'hay_block', 'tallgrass','deadbush','sapling','leaves', 'leaves2','cake','skull','flower_pot','monster_egg','mob_spawner','enchanting_table', 'slime', 'ender_chest','board','wool','carpet', 'grass_path', "black_glazed_terracotta","blue_glazed_terracotta","brown_glazed_terracotta","cyan_glazed_terracotta","gray_glazed_terracotta","green_glazed_terracotta","light_blue_glazed_terracotta","magenta_glazed_terracotta","lime_glazed_terracotta","silver_glazed_terracotta","white_glazed_terracotta","yellow_glazed_terracotta","orange_glazed_terracotta","pink_glazed_terracotta","purple_glazed_terracotta","red_glazed_terracotta","concrete","concretepowder","end_crystal","dragon_egg","end_rod","shulker_box"];

    decorations.sort();

    var tools = ['rail', 'golden_rail','detector_rail','activator_rail','torch','bucket','tnt', 'lead', 'nametag', 'redstone', 'bow','fishing_rod', 'flint_and_steel','shears', 'clock', 'compass', 'minecart', 'chest_minecart','hopper_minecart','tnt_minecart', 'boat','saddle','horsearmorleather', 'horsearmoriron', 'horsearmorgold', 'horsearmordiamond','spawn_egg','fireball','wooden_sword', 'wooden_hoe','wooden_shovel',  'wooden_pickaxe','wooden_axe',
'stone_sword','stone_hoe','stone_shovel','stone_pickaxe','stone_axe',
'iron_sword', 'iron_hoe','iron_shovel','iron_pickaxe','iron_axe',
'diamond_sword','diamond_hoe','diamond_shovel','diamond_pickaxe','diamond_axe',
'golden_sword','golden_hoe','golden_shovel','golden_pickaxe','golden_axe','leather_helmet','leather_chestplate', 'leather_leggings','leather_boots', 'chainmail_helmet','chainmail_chestplate', 'chainmail_leggings','chainmail_boots','iron_helmet','iron_chestplate', 'iron_leggings','iron_boots', 'diamond_helmet','diamond_chestplate', 'diamond_leggings','diamond_boots', 'golden_helmet','golden_chestplate', 'golden_leggings','golden_boots',  'lever','redstone_lamp',  'redstone_torch','wooden_pressure_plate','stone_pressure_plate','light_weighted_pressure_plate', 'heavy_weighted_pressure_plate','wooden_button',  'stone_button', 'daylight_detector', 'tripwire_hook', 'repeater', 'comparator','dispenser','dropper', 'piston','sticky_piston','observer', 'hopper', 'snowball','ender_pearl','ender_eye', 'camera' , 'portfolio',"elytra","repeating_command_block","chain_command_block","command_block","command_block_minecart","structure_block","totem"];

    tools.sort();

    var miscellaneous = [ 'brick', 'coal','diamond', 'iron_ingot', 'gold_ingot','emerald','stick', 'bowl', 'string', 'feather', 'flint', 'leather',  'rabbit_hide', 'clay_ball', 'sugar', 'quartz', 'paper', 'book', 'arrow','bone', 'emptymap','reeds','wheat', 'wheat_seeds', 'pumpkin_seeds', 'melon_seeds', 'beetroot_seeds', 'egg','apple', 'golden_apple', 'appleenchanted','fish', 'salmon','clownfish', 'pufferfish','cooked_fish', 'cooked_salmon','rotten_flesh','mushroom_stew','bread','porkchop','cooked_porkchop','chicken','cooked_chicken', 'muttonraw',   'muttoncooked', 'beef', 'cooked_beef','melon','carrot', 'potato',  'baked_potato','poisonous_potato','beetroot','cookie','pumpkin_pie','rabbit','cooked_rabbit','rabbit_stew', 'netherstar','magma_cream','blaze_rod','gold_nugget','golden_carrot','speckled_melon','rabbit_foot','ghast_tear','slime_ball', 'blaze_powder', 'nether_wart','gunpowder','glowstone_dust','spider_eye','fermented_spider_eye', 'carrotonastick','experience_bottle','enchanted_book','prismarine_crystals', 'prismarine_shard', 'dye', 'glass_bottle','splash_potion', 'potion',"beetroot_soup" ,"chorus_flower","chorus_fruit","chorus_fruit_popped","chorus_plant","dragon_breath","iron_nugget","lingering_potion","shulker_shell"];
    
    miscellaneous.sort();
    console.log('Item list Sorted');

    function createCommand(commandName, input) {
        let params = Object.keys(input);
        let command = `${commandName}`;
        // Key-value pairs for the input of form 'key=value'
        let keyValuePairs = [];

        params.forEach((key) => {
            let value = input[key];
            if (value != null) {
                keyValuePairs.push(`${key}=${value}`);
            }
        });
        // Command is just commandName, unless it has inputs, in which case it's:
        // 'commandName?paramA=valueA&paramB=valueB' and so on...
        // Stick on parameters if there are any
        if (keyValuePairs.length > 0) {
            command = `${command}?${keyValuePairs.join('&')}`;
        }
        return command;
    }

    // Optional strings can be empty, in which case we won't add them to the query
    function optional(input) {
        return $.trim(input) == '' ? null : input;
    }

    ext.move = function (direction, callback) {
        var command = `move?direction=${direction}`;
        client.async_command(command, callback, "success");
    };

    ext.turn = function (direction, callback) {
        var command = `turn?direction=${direction}`;
        client.async_command(command, callback, "success");
    };

    ext.place = function (slotNum, direction, callback) {
        var command = `place?slotNum=${slotNum}&direction=${direction}`;
        client.async_command(command, callback);
    };

    ext.attack = function (direction, callback) {
        var command = `attack?direction=${direction}`;
        client.async_command(command, callback, "success");
    };

    ext.destroy = function (direction, callback) {
        var command = `destroy?direction=${direction}`;
        client.async_command(command, callback, "success");
    };

    ext.till = function (direction, callback) {
        var command = `till?direction=${direction}`;
        client.async_command(command, callback, "success");
    };

    ext.collect = function (item, callback) {
        var command = `collect?item=${item}`;
        client.async_command(command, callback, "success");
    };

    ext.drop = function (quantity, slotNum, direction, callback) {
        var command = `drop?slotNum=${slotNum}&quantity=${quantity}&direction=${direction}`;
        client.async_command(command, callback, "success");
    };

    ext.dropAll = function (direction, callback) {
        var command = `dropall?direction=${direction}`;
        client.async_command(command, callback, "success");
    };

    ext.detect = function (direction) {
        var command = `detect?direction=${direction}`;
        return client.sync_command(command, "result");
    };

    ext.inspect = function (direction, callback) {
        var command = `inspect?direction=${direction}`;
        client.async_command(command, callback, "blockName");
    };

    ext.inspectdata = function (direction, callback) {
        var command = `inspectdata?direction=${direction}`;
        client.async_command(command, callback, "data");
    };

    ext.detectRedstone = function (direction) {
        var command = `detectredstone?direction=${direction}`;
        return client.sync_command(command, "result");
    };

    ext.getItemDetail = function (slotNum, callback) {
        var command = `getitemdetail?slotNum=${slotNum}`;
        client.async_command(command, callback, "itemName");
    };

    ext.getItemSpace = function (slotNum, callback) {
        var command = `getitemspace?slotNum=${slotNum}`;
        client.async_command(command, callback, "spaceCount");
    };

    ext.getItemCount = function (slotNum, callback) {
        var command = `getitemcount?slotNum=${slotNum}`;
        client.async_command(command, callback, "stackCount");
    };

    ext.transferTo = function (sourceSlotNum, destinationSlotNum, quantity, callback) {
        var command = `transfer?srcSlotNum=${sourceSlotNum}&dstSlotNum=${destinationSlotNum}&quantity=${quantity}`;
        client.async_command(command, callback, "success");
    };

    ext.tpToPlayer = function (callback) {
        var command = `tptoplayer`;
        client.async_command(command, callback, "success");
    }

    ext.tpToTarget = function (victim, destination, callback) {
        var command = `tptargettotarget?victim=${encodeURIComponent(victim)}&destination=${encodeURIComponent(destination)}`;
        client.async_command(command, callback, "success");
    }

    ext.tpToPos = function (victim, isRelative, x, y, z, callback) {
        var command = `tptargettopos?victim=${encodeURIComponent(victim)}&destination=${createBlockPos(x, y, z, isRelative)}`;
        client.async_command(command, callback, "success");
    }

    ext.weather = function (type, callback) {
        var command = `weather?type=${type}`;
        client.async_command(command, callback, "success");
    }

    ext.executeAsOther = function (command, origin, isRelative, x, y, z, callback) {
        var command = `executeasother?origin=${encodeURIComponent(origin)}&position=${createBlockPos(x, y, z, isRelative)}&command=${command}`;
        client.async_command(command, callback, "success");
    }

    ext.kill = function (target, callback) {
        var command = createCommand('kill', { 'target': optional(target) });
        client.async_command(command, callback, "success");
    }

    ext.fill = function (fromIsRelative, fromX, fromY, fromZ, toIsRelative, toX, toY, toZ, tileName, tileData, callback) {
        var command = createCommand('fill', { 'from' : createBlockPos(fromX, fromY, fromZ, fromIsRelative) , 'to' : createBlockPos(toX, toY, toZ, toIsRelative), 'tileName' : tileName, 'tileData' : optional(tileData) });
        client.async_command(command, callback, "success");
    }

    ext.give = function (amount, itemName, player, callback) {
        var command = `give?player=${encodeURIComponent(player)}&itemName=${itemName}&amount=${amount}`;
        client.async_command(command, callback, "success");
    }

    ext.timeSetByNumber = function (time, callback) {
        var command = `timesetbynumber?time=${time}`;
        client.async_command(command, callback, "success");
    }

    ext.timeSetByName = function (time, callback) {
        var command = `timesetbyname?time=${time}`;
        client.async_command(command, callback, "success");
    }

    ext.setBlock = function (isRelative, x, y, z, tileName, tileData, callback) {
        var command = createCommand('setblock', { 'position' : createBlockPos(x,y,z,isRelative) , 'tileName' : tileName, 'tileData' : optional(tileData) });
        client.async_command(command, callback, "success");
    }

    ext.testForBlock = function (tileName, isRelative, x, y, z) {
        var command = `testforblock?position=${createBlockPos(x, y, z, isRelative)}&tileName=${tileName}`;
        return client.sync_command(command, "matches");
    }

    ext.testForBlocks = function (beginIsRelative, beginX, beginY, beginZ, endIsRelative, endX, endY, endZ, destinationIsRelative, destinationX, destinationY, destinationZ) {
        var command = `testforblocks?begin=${createBlockPos(beginX, beginY, beginZ, beginIsRelative)}&end=${createBlockPos(endX, endY, endZ, endIsRelative)}&destination=${createBlockPos(destinationX, destinationY, destinationZ, destinationIsRelative)}`;
        return client.sync_command(command, "matches");
    }

    ext.summon = function (entityType, isRelative, x, y, z, callback) {
        var command = `summon?entityType=${entityType}&spawnPos=${createBlockPos(x, y, z, isRelative)}`;
        client.async_command(command, callback, "success");
    }

    ext.clone = function (beginIsRelative, beginX, beginY, beginZ, endIsRelative, endX, endY, endZ, destinationIsRelative, destinationX, destinationY, destinationZ, callback) {
        var command = `clone?begin=${createBlockPos(beginX, beginY, beginZ, beginIsRelative)}&end=${createBlockPos(endX, endY, endZ, endIsRelative)}&destination=${createBlockPos(destinationX, destinationY, destinationZ, destinationIsRelative)}`;
        client.async_command(command, callback, "success");
    }

    ext.getBlockName = function (blockName) {
        return blockName;
    }

    ext.getDecorationName = function (decoration) {
        return decoration;
    }

    ext.getToolName = function (tool) {
        return tool;
    }

    ext.getMiscellaneousName = function (miscellaneous) {
        return miscellaneous;
    }


    // Status : 0(Red) 1(Yellow) 2(Green)
    ext._getStatus = function () {
        if (loadFailed) {
            return { status: 0, msg: "Failed to load CC client file" }
        } else if (!client)
            // starts with a green to avoid weird pop-up in scratchx side
            return { status: 2, msg: "CC client is not loaded" }
        else
            return connectionStatus;
    };

    ext._shutdown = function () {
        if (connectionUpdateInterval) {
            clearInterval(connectionUpdateInterval);
        }
    };

    // Block and block menu descriptions
    // w : Async command block
    // b : Sync predicate (reporter with boolean) -> Scratch X doesn't support non-blocking predicate
    // R : Async reporter block 
    var descriptor = {
        blocks: [
            ['w', 'Move %m.sixDirections', 'move', 'forward'],
            ['w', 'Turn %m.rotateDirections', 'turn', 'left'],
            ['w', 'Teleport to the player', 'tpToPlayer'],
            ['w', 'Use or place item in inventory slot %n at %m.sixDirections', 'place', 1, 'forward'],
            ['w', 'Destroy %m.sixDirections', 'destroy', 'forward'],
            ['w', 'Till %m.sixDirections', 'till', 'forward'],
            ['w', 'Attack %m.sixDirections', 'attack', 'forward'],
            ['w', 'Collect %s', 'collect', 'all'],
            ['w', 'Drop %n item(s) in inventory slot %n to %m.fourDirections', 'drop', 1, 1, 'forward'],
            ['w', 'Drop all item in inventory to %m.fourDirections', 'dropAll', 'forward'],
            ['b', 'Detect %m.sixDirections', 'detect', 'forward'],
            ['R', 'Inspect at %m.sixDirections', 'inspect', 'forward'],
            ['R', 'Inspect data at %m.sixDirections', 'inspectdata', 'forward'],
            ['r', 'Block name %m.blocks', 'getBlockName', blocks[0] ],
            ['r', 'Decoration name %m.decorations', 'getDecorationName', decorations[0]],
            ['r', 'Tool name %m.tools', 'getToolName', tools[0]],
            ['r', 'Miscellaneous name %m.miscellaneous', 'getMiscellaneousName', miscellaneous[0]],
            ['R', 'Get item detail in the inventory slot %n', 'getItemDetail', 1],
            ['R', 'Get item space in the inventory slot %n', 'getItemSpace', 1],
            ['R', 'Get number of item in the inventory slot %n', 'getItemCount', 1],
            ['w', 'Transfer item from inventory slot %n to %n quantity %n', 'transferTo', 1, 1, 1],
            ['b', 'Detect Redstone at %m.sixDirections', 'detectRedstone', 'forward'],
            ['w', 'Clone blocks from %m.positionType position %n %n %n to %m.positionType position %n %n %n to %m.positionType position %n %n %n', 'clone', 'relative', 1, 1, 1, 'relative', 1, 1, 1, 'relative', 1, 1, 1],
            ['w', 'Execute command %s on behalf of %s at %m.positionType position %n %n %n', 'executeAsOther', ' ', ' ', 'relative', 1, 1, 1],
            ['w', 'Fill from %m.positionType position %n %n %n to %m.positionType position %n %n %n with %s using tile data %n', 'fill', 'relative', 1, 1, 1, 'relative', 1, 1, 1, ' ', 0],
            ['w', 'Give %n item(s) %s to target %s', 'give', 1, ' ', ' '],
            ['w', 'Kill target %s', 'kill', ' '],
            ['w', 'Set block at %m.positionType position %n %n %n to block type %s using tile data %n', 'setBlock', 'relative', 1, 1, 1, ' ', 0],
            ['w', 'Summon entity type %s at %m.positionType position %n %n %n', 'summon', ' ', 'relative', 1, 1, 1],
            ['b', 'Tests whether a block type %s is in a %m.positionType position %n %n %n', 'testForBlock', ' ', 'relative', 1, 1, 1],
            ['b', 'Tests whether the pattern between %m.positionType position %n %n %n to %m.positionType position %n %n %n is matched at %m.positionType position %n %n %n', 'testForBlocks', 'relative', 1, 1, 1, 'relative', 1, 1, 1, 'relative', 1, 1, 1],
            ['w', 'Teleport target %s to target %s', 'tpToTarget', ' ', ' '],
            ['w', 'Teleport target %s to %m.positionType position %n %n %n', 'tpToPos', ' ', 'relative', 1, 1, 1],
            ['w', 'Set time to %m.timeType', 'timeSetByName', 'day'],
            ['w', 'Set time to %n', 'timeSetByNumber', 1],
            ['w', 'Change weather to %m.weatherType', 'weather', 'clear']
        ],
        menus: {
            sixDirections: ['forward', 'back', 'left', 'right', 'up', 'down'],
            fourDirections: ['forward', 'back', 'left', 'right'],
            rotateDirections: ['left', 'right'],
            weatherType: ['clear', 'rain', 'thunder'],
            positionType: ['relative', 'absolute'],
            timeType: ['day', 'night'],
            blocks: blocks,
            decorations: decorations,
            tools: tools,
            miscellaneous: miscellaneous,
            speed: ['normal', 'fast']
        }
    };

    // Register the extension
    ScratchExtensions.register('CC-Scratch', descriptor, ext);
})({});
