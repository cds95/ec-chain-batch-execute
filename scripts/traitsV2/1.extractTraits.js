const fs = require('fs')
const BigNumber = require('bignumber.js');

const { getNewId } = require("./_traitMap.js");


const tokenTraits = {};
for (let i = 0; i < 10000; i++) {
    tokenTraits[i] = getTokenTraits(i);
}

try {
    fs.writeFileSync('data/OrigData2.json', JSON.stringify(tokenTraits));
    //file written successfully
} catch (err) {
    console.error(err);
}

function getTokenTraits(tokenId) {
    const id = new BigNumber(tokenId);
    const root = "./data/v2/metadata";
    const folder = id.mod(100).toString();
    const file = root + "/" + folder + "/" + id.toString() + ".json";

    const newTraits = {};
    let obj;
    try {
        const data = fs.readFileSync(file, 'utf8')
        obj = JSON.parse(data);

        // convert traits data to new format
        for (let i = 0; i < obj.traits.length; i++) {
            const traitItem = obj.traits[i];
            let name = traitItem.name;
            let type = traitItem.type;
            let id = traitItem.id;
            let value = 0;
            let add = false;

            if(id === 108) {
                // console.log("tokenId:", tokenId, "has - Extra Limited Edition Trait Slot")
                // '108': { name: 'Extra Limited Edition Trait Slot' },
                name = "Limited Trait Slot";
                value = 1;
                add = true;
            } else if(id === 148) {
                // '108': { name: 'Limited Trait Slot' },
                name = "Limited Trait Slot";
                value = 1;
                add = true;
            }


            // One Time Discount
            if(id === 110) {
                // '110': { name: '50% Discount' },
                name = "One Time Discount";
                value = 50;
            } else if(id === 111) {
                // '111': { name: '25% Discount' },
                name = "One Time Discount";
                value = 25;
            } else if(id === 112) {
                // '112': { name: '10% Discount'},
                name = "One Time Discount";
                value = 10;
            } else if(id === 113) {
                // '113': { name: '5% Discount' },
                name = "One Time Discount";
                value = 5;
            }

            // Discount
            if(id === 135) {
                // '135': { name: '25% Discount'},
                name = "Discount";
                value = 25;
            } else if(id === 136) {
                // '136': { name: '15% Discount'},
                name = "Discount";
                value = 15;
            } else if(id === 137) {
                // '137': { name: '15% Discount'},
                name = "Discount";
                value = 5;
            }

            // Extra Ticket
            if(id === 114 || id === 142 ) {
                // '142': { name: '1 Extra Ticket'},
                name = "Extra Ticket";
                value = 1;
                add = true;
            } else if(id === 143) {
                // '143': { name: '2 Extra Ticket'},
                name = "Extra Ticket";
                value = 2;
                add = true;
            } else if(id === 144) {
                // '144': { name: '3 Extra Ticket'},
                name = "Extra Ticket";
                value = 3;
                add = true;
            }

            // Leaf Lucky Clover
            if(id === 145) {
                // '145': { name: 'Leaf Lucky Clover'},
                name = "Lucky Clover";
                value = 3;
            } else if(id === 146) {
                // '146': { name: 'Leaf Lucky Clover'},
                name = "Lucky Clover";
                value = 5;
            } else if(id === 147) {
                // '147': { name: 'Leaf Lucky Clover'},
                name = "Lucky Clover";
                value = 7;
            }

            // Leaf Lucky Clover
            if(id === 149) {
                // '149': { name: 'Punk Battle Ticket'},
                name = "Punk Battle Ticket";
                value = 1;
                add = true;
            }

            if(id === 150) {
                // '149': { name: 'Punk Battle Ticket'},
                name = "Royalty Battle Ticket";
                value = 1;
                add = true;
            }

            let newID = getNewId(traitItem.id);

            if (typeof newTraits[newID] === "undefined") {
                newTraits[newID] = {
                    "id": newID,
                    "name": name,
                    "type": type,
                    "count": 0,
                    "value": 0
                };
            } 

            newTraits[newID].count++;
            if(add) {
                newTraits[newID].value+=value;
            }
            
        }
            
    } catch (err) {
        console.error(err)
    }


    // retval = {
    //     // traits: [ "Accidental Collaboration", ... obj.traits],
    //     traits: newTraits,
    //     // trait_types: obj.trait_types,
    //     // series: obj.series
    // };

    // console.log(tokenId.toString(), newTraits);


    return newTraits;
}

