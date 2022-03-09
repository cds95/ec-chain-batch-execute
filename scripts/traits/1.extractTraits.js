const fs = require('fs')
const BigNumber = require('bignumber.js');

const traitIdToName = {

    // Random Edition Traits
    // 100: "Accidental Collaboration",
    
    101: "Unicorn",
    102: "Reforge",
    103: "Reforge + ",
    104: "Art Drop",
    105: "Redeemable",
    106: "Alpha Upgrade",
    107: "OG Upgrade",
    108: "Extra Limited Trait Slot",
    109: "Forge Protector",
    110: "50% Discount",
    111: "25% Discount",
    112: "10% Discount",
    113: "5% Discount",
    114: "Free Ticket",
    115: "Lucky Reroll",
    116: "Rando Dropper",
    117: "Disco Dropper",
    118: "Fluid",
    119: "Selective Layer Reroll",
    120: "Swap",
    121: "Golden Goose",
    122: "Redeem",
    123: "Unstable",
    124: "True Name",
    125: "Warp Rabbit",
    126: "Synthesis Ritual",
    127: "Merch",
    128: "Gravity",
    129: "New Commons",
    130: "Glittery",
    131: "1 UP",
    132: "Good Company",
    133: "Reroll",
    134: "New Fan",

    // Limited Edition Traits
    135: "25% Discount",
    136: "15% Discount",
    137: "5% Discount",
    138: "Free Ticket Creation",
    139: "Free Blind Bag Creation",
    140: "Free Puzzle Creation",
    141: "All Services Free",
    142: "1 Extra Ticket",
    143: "2 Extra Ticket",
    144: "3 Extra Ticket",
    145: "3 Leaf Lucky Clover",
    146: "5 Leaf Lucky Clover",
    147: "7 Leaf Lucky Clover",

    // Conditional Traits
    148: "Limited Trait Slot",
    149: "Punk Battle Ticket",
    150: "Royalty Battle Ticket",
    151: "OG Layer Drop",
    152: "Alpha Layer Drop",
    153: "Artist Trait",
    154: "Phoenix",
    155: "Classic EC",
    156: "Supporter",
    157: "Creator",
    158: "Discord",
    159: "Redemption",
    160: "Perfect",
    161: "Forged",
}

let traitNameToId = {};

let traitUsage = {};


Object.keys(traitIdToName).forEach((item, index) => {
    const name = traitIdToName[item]
    traitNameToId[name] = item;
});


const allTraits = [];
const TokenIdToTraitIds = {};


for (let i = 0; i < 10000; i++) {
    allTraits[i] = getTokenTraits(i);

    TokenIdToTraitIds[i] = [];

    for (let j = 0; j < allTraits[i].traits.length; j++) {

        const item = allTraits[i].traits[j];
        if (traitNameToId[item] !== "undefined") {
            console.log("token id:" + i + " item:" + item + " found id: " + traitNameToId[item])
            if (typeof traitUsage[item] === "undefined") {
                traitUsage[item] = 0;
            }
            traitUsage[item]++;

            TokenIdToTraitIds[i].push(parseInt(traitNameToId[item]));

        } else {
            console.log("trait id:" + i + " item:" + item + " not found")
        }
    }

}

console.log(traitUsage)
Object.keys(traitNameToId).forEach((item, index) => {
    if (typeof traitUsage[item] === "undefined") {
        console.log(item + " not used");
    }
});




try {
    fs.writeFileSync('data/OrigData.json', JSON.stringify(TokenIdToTraitIds));
    //file written successfully
} catch (err) {
    console.error(err);
}


function getTokenTraits(tokenId) {
    tokenId = new BigNumber(tokenId);
    const og_rand = new BigNumber("8449680988540440215");
    const alpha_rand = new BigNumber("10566023106710594524");
    const founder_rand = new BigNumber("12403320775077705976");

    let id = tokenId;
    if (tokenId < 10) {
        //
    } else if (tokenId < 100) {
        // id = ((tokenId + og_rand) % 90) + 10;
        id = tokenId.plus(og_rand).mod(90).plus(10);
    } else if (tokenId < 1000) {
        // id = ((tokenId + alpha_rand) % 900) + 100;
        id = tokenId.plus(alpha_rand).mod(900).plus(100);
    } else if (tokenId < 10000) {
        // id = ((tokenId + founder_rand) % 9000) + 1000;
        id = tokenId.plus(founder_rand).mod(9000).plus(1000);
    }

    const root = "./data/QmfC87yxZKPSU3vQdsh8CBdgJttrLDJmS1HSfFfYqeRyUQ";
    const folder = id.mod(100).toString();
    const file = root + "/" + folder + "/" + id.toString() + ".json";

    let retval = '';
    try {
        const data = fs.readFileSync(file, 'utf8')
        const obj = JSON.parse(data);
        retval = {
            traits: [ "Accidental Collaboration", ... obj.traits],
            trait_types: obj.trait_types,
            series: obj.series
        };
        // console.log(retval);

    } catch (err) {
        console.error(err)
    }
    return retval;
}


