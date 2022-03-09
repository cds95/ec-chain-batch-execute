const traitIdOffset = 101;

const traits = {
    101: { id: 0, name: "Unicorn" },
    102: { id: 1, name: "Reforge" },
    103: { id: 2, name: "Reforge+" },
    104: { id: 3, name: "Art Drop" },
    105: { id: 4, name: "Redeemable" },
    106: { id: 5, name: "Alpha Upgrade" },
    107: { id: 6, name: "OG Upgrade" },
    109: { id: 7, name: "Forge Protector" },

    110: { id: 8, name: "One Time Discount", value: 50 }, // "50% Discount",
    111: { id: 8, name: "One Time Discount", value: 25 }, // "25% Discount",
    112: { id: 8, name: "One Time Discount", value: 10 }, // "10% Discount",
    113: { id: 8, name: "One Time Discount", value: 5 },  //  "5% Discount",

    135: { id: 9, name: "Discount", value: 25 },  //  "25% Discount",
    136: { id: 9, name: "Discount", value: 15 },  //  "15% Discount",
    137: { id: 9, name: "Discount", value: 5  },  //   "5% Discount",

    114: { id: 10, name: "Free Ticket", value: 1  },  //  "1 Extra Ticket",
    142: { id: 10, name: "Extra Ticket", value: 1 },  //  "1 Extra Ticket",
    143: { id: 10, name: "Extra Ticket", value: 2 },  //  "2 Extra Ticket",
    144: { id: 10, name: "Extra Ticket", value: 3 },  //  "3 Extra Ticket",

    115: { id: 11, name: "Lucky Reroll" },
    116: { id: 12, name: "Rando Dropper" },
    117: { id: 13, name: "Disco Dropper" },
    118: { id: 14, name: "Fluid" },
    119: { id: 15, name: "Selective Layer Reroll" },
    120: { id: 16, name: "Swap" },

    121: { id: 17, name: "Golden Goose" },
    122: { id: 18, name: "Redeem" },
    123: { id: 19, name: "Unstable" },
    124: { id: 20, name: "True Name" },
    125: { id: 21, name: "Warp Rabbit" },
    126: { id: 22, name: "Synthesis Ritual" },
    127: { id: 23, name: "Merch" },

    128: { id: 24, name: "Gravity" },
    129: { id: 25, name: "New Commons" },
    130: { id: 26, name: "Glittery" },
    131: { id: 27, name: "1 UP" },
    132: { id: 28, name: "Good Company" },
    133: { id: 29, name: "Reroll" },
    134: { id: 30, name: "New Fan" },

    138: { id: 31, name: "Free Ticket Creation" },
    139: { id: 32, name: "Free Blind Bag Creation" },
    140: { id: 33, name: "Free Puzzle Creation" },
    141: { id: 34, name: "All Services Free" },
    
    145: { id: 35, name: "Lucky Clover", value: 3 },   // 3 Leaf Lucky Clover
    146: { id: 35, name: "Lucky Clover", value: 5 },   // 5 Leaf Lucky Clover
    147: { id: 35, name: "Lucky Clover", value: 7 },   // 7 Leaf Lucky Clover

    108: { id: 36, name: "Extra Limited Edition Trait Slot" },   // add 1 extra limited trait slot
    148: { id: 36, name: "Limited Trait Slot" },
    149: { id: 37, name: "Punk Battle Ticket" },
    150: { id: 38, name: "Royalty Battle Ticket" },
    151: { id: 39, name: "OG Layer Drop" },
    152: { id: 40, name: "Alpha Layer Drop" },
    153: { id: 41, name: "Artist Trait" },
    154: { id: 42, name: "Phoenix" },
    155: { id: 43, name: "Classic EC" },
    156: { id: 44, name: "Supporter" },
    157: { id: 45, name: "Creator" },
    158: { id: 46, name: "Discord" },
    159: { id: 47, name: "Redemption" },
    160: { id: 48, name: "Perfect" },
    161: { id: 49, name: "Forged" },

}

const traitsNew = [
    { id: 0, name: "Unicorn" },
    { id: 1, name: "Reforge" },
    { id: 2, name: "Reforge+" },
    { id: 3, name: "Art Drop" },
    { id: 4, name: "Redeemable" },
    { id: 5, name: "Alpha Upgrade" },
    { id: 6, name: "OG Upgrade" },
    { id: 7, name: "Forge Protector" },
    { id: 8, name: "One Time Discount" },
    { id: 9, name: "Discount" },
    { id: 10, name: "Free Ticket" },
    { id: 11, name: "Lucky Reroll" },
    { id: 12, name: "Rando Dropper" },
    { id: 13, name: "Disco Dropper" },
    { id: 14, name: "Fluid" },
    { id: 15, name: "Selective Layer Reroll" },
    { id: 16, name: "Swap" },
    { id: 17, name: "Golden Goose" },
    { id: 18, name: "Redeem" },
    { id: 19, name: "Unstable" },
    { id: 20, name: "True Name" },
    { id: 21, name: "Warp Rabbit" },
    { id: 22, name: "Synthesis Ritual" },
    { id: 23, name: "Merch" },
    { id: 24, name: "Gravity" },
    { id: 25, name: "New Commons" },
    { id: 26, name: "Glittery" },
    { id: 27, name: "1 UP" },
    { id: 28, name: "Good Company" },
    { id: 29, name: "Reroll" },
    { id: 30, name: "New Fan" },
    { id: 31, name: "Free Ticket Creation" },
    { id: 32, name: "Free Blind Bag Creation" },
    { id: 33, name: "Free Puzzle Creation" },
    { id: 34, name: "All Services Free" },
    { id: 35, name: "Lucky Clover" },
    { id: 36, name: "Limited Trait Slot" },
    { id: 37, name: "Punk Battle Ticket" },
    { id: 38, name: "Royalty Battle Ticket" },
    { id: 39, name: "OG Layer Drop" },
    { id: 40, name: "Alpha Layer Drop" },
    { id: 41, name: "Artist Trait" },
    { id: 42, name: "Phoenix" },
    { id: 43, name: "Classic EC" },
    { id: 44, name: "Supporter" },
    { id: 45, name: "Creator" },
    { id: 46, name: "Discord" },
    { id: 47, name: "Redemption" },
    { id: 48, name: "Perfect" },
    { id: 49, name: "Forged" },
];

const traitSetup = {
    36: { type: 2, start: 10,   end: 9999 }, // Limited Trait Slot
    37: { type: 2, start: 10,   end: 4923 }, // Punk Battle Ticket
    38: { type: 2, start: 10,   end: 4923 }, // Royalty Battle Ticket
    39: { type: 2, start: 10,   end: 99   }, // OG Layer Drop
    40: { type: 2, start: 100,  end: 999  }, // Alpha Layer Drop
    42: { type: 2, start: 1000, end: 2562 }, // Phoenix
}

function getNewTraitsObject() {
    const newTraits = {};
    const keys = Object.keys(traits);
    for(let i = 0; i < keys.length; i++) {
        let k = keys[i];
        newTraits[traits[k].id] = traits[k];
    }
    return newTraits;
}

function getNewId(oldId) {
    return traits[oldId].id;
}

function getTraitIdByName(name) {
    for(let i = 0; i < traitsNew.length; i++) {
        if(traitsNew[i].name === name) {
            return traitsNew[i].id;
        }
    }
    return -1;
}

function getTraitNameById(id) {
    return traitsNew[id];
}

module.exports = {
    traits: traits,
    traitSetup: traitSetup,
    getNewTraitsObject:getNewTraitsObject,
    getNewId: getNewId,
    getTraitIdByName: getTraitIdByName,
    getTraitNameById: getTraitNameById,
    traitIdOffset: traitIdOffset
}