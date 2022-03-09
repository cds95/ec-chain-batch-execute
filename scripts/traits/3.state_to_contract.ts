const fs = require('fs')

import "@nomiclabs/hardhat-ethers";
import { ethers } from "hardhat";
import BitArray from "../../tests/helpers/BitArray";
const traitIdOffset = 101;

async function main() {

    interface TkData {
        [key: string]: any
    }

    const data: TkData = await import('../../data/Processed.json');
    const traitIdToName: TkData = await import('../../data/traits.json');

    const calls: any = [];
    let skipped = 0;

    Object.keys(data).forEach((tokenId: any, index: number) => {
        if(tokenId.toString() !== "default") {
            const traitData = new BitArray(64);

            if (data[tokenId].length > 0) {

                data[tokenId].forEach((traitId: number, index: number) => {
                    const actualTraitId = traitId - traitIdOffset;
                    const traitName = traitIdToName[traitId.toString()];
                    traitData.on(actualTraitId);
                });
            }

            const hexData = traitData.toHexString();
            // console.log("hexData:", traitData.toBinaryString());
            if(hexData !== "0x00") {
                calls.push({ id: tokenId, data: hexData });
            } else {
                skipped++;
                console.log("skipping token id:", tokenId, "because of empty data:", hexData);
            }
        }
    });

    console.log("skipped", skipped, "calls.. since they're empty");
    console.log("not an issue since these get allocated when set, if set at all");


    try {
        fs.writeFileSync('data/BitArrayTokenData.json', JSON.stringify(calls));
        //file written successfully
    } catch (err) {
        console.error(err);
    }

}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });