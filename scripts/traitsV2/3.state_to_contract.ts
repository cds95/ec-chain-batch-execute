const fs = require('fs')

import "@nomiclabs/hardhat-ethers";
import { ethers } from "hardhat";
import BitArray from "../../tests/helpers/BitArray";

const { getNewTraitsObject, traitSetup, getTraitIdByName, getTraitNameById, traitIdOffset } = require("./_traitMap.js");

function getTokenTraitData(tokenTraits: any, _traitId: number) {
    const keys = Object.keys(tokenTraits);
    for(let i = 0; i < keys.length; i++) {
        const traitKey = keys[i];
        if(traitKey.toString() === _traitId.toString()) {
            return tokenTraits[traitKey];
        }
    }
    return false;
}

async function main() {

    interface TkData {
        [key: string]: any
    }

    const tokenData: TkData = await import('../../data/v2/Processed.json');

    const calls: any = [];
    let skipped = 0;
    const traits = getNewTraitsObject();
    const summary: any = [];


    const traitTokenValues: any = {};

    Object.keys(traits).forEach((key: any, idx: number) => {
        if(key.toString() !== "default") {

            
            const traitId = parseInt(key);
            traitTokenValues[traitId] = {};
            const traitName = traits[key.toString()].name;
            let traitSettings: any = false;
            if(typeof traitSetup[traitId] !== "undefined"){
                traitSettings = traitSetup[traitId];
            }
            const traitData = new BitArray(10000);

            let traitUsage = 0;
            let traitRealUsage = 0;

            Object.keys(tokenData).forEach((tokenId: any, index: number) => {
                if(tokenId.toString() !== "default") {

                    let trait = getTokenTraitData(tokenData[tokenId], traitId);
                    
                    if(traitSettings !== false) {

                        if(traitSettings.type === 2) {

                            // token in range 
                            if(traitSettings.start <= tokenId && tokenId <= traitSettings.end) {
                                // for tokens in range that DO NOT have trait, we need to set it to true
                                // as hasTrait inverts the value that is stored

                                if( trait !== false) {
                                    // trait exists.. since this is inverted, do nothing
                                    traitUsage++;
                                    traitRealUsage+= trait.value || 0;
                                    
                                    // save value for value trait implementer
                                    if(parseInt(trait.value) > 0) {
                                        traitTokenValues[traitId][tokenId] = trait.value;
                                    }
        
                                } else {
                                    // trait does not exist, since it is inverted, set On
                                    traitData.on(tokenId);
                                }

                            } else {
                                // outside range do nothing
                            }

                        }

                    } else {

                        if( trait !== false) {
                            traitData.on(tokenId);
                            traitUsage++;
                            traitRealUsage+= parseInt(trait.value) || 0;

                            // save value for value trait implementer
                            if(parseInt(trait.value) > 0) {
                                traitTokenValues[traitId][tokenId] = trait.value;
                            }

                        }
                    }
                }
            });

            // console.log("usage:", key, traitName, traitUsage, traitRealUsage);

            const endTraitDataHex = traitData.toHexString();
            const endTraitData = BitArray.fromHexString(endTraitDataHex);
            if(endTraitData.length > 0) {
                calls.push({ id: traitId, data: endTraitData.toArray() });
            } else {
                skipped++;
                console.log("skipping token id:", traitId, "because of empty data:", endTraitData);
            }

            summary.push({id:traitId, name:traitName, usage:traitUsage, real: traitRealUsage});
        };

    });

    for(let i = 0; i < summary.length; i++) {
        console.log(summary[i].id, summary[i].name, summary[i].usage, summary[i].real);
    }

    try {
        fs.writeFileSync('data/v2/BitArrayTokenData.json', JSON.stringify(calls));
        fs.writeFileSync('data/v2/traitTokenValues.json', JSON.stringify(traitTokenValues));
        
        //file written successfully
    } catch (err) {
        console.error(err);
    }

    // const testHex = "0x00009e9cd15604f54fe681edc6a44c44e290d80379e05928a115a159b50b5c2f0c018cfe1442b286d103db19a8005580d84a1f1bf1832a48170452f2dbc40fe9da460dc0fd4e7c9288751c3d00403f88c8b07d1d195104e2564a6b029d3be3a5fad97870a8280a50c1b4ceaa441106129e04ac282098fb8361611ebf169a0a142080801c80802ba0221100204024442448084a000110801228c1420109";
    // const endTraitData = BitArray.fromHexString(testHex);
    // console.log(endTraitData);

    // const traitData = new BitArray(10000);
    // traitData.on(9999);
    // console.log(traitData.toBinaryString());

}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });