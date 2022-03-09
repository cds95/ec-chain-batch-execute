const fs = require('fs')

import "@nomiclabs/hardhat-ethers";
import { ethers } from "hardhat";
import BitArray from "../../tests/helpers/BitArray";
const traitIdOffset = 100;

async function main() {

    interface TkData {
        [key: string]: any
    }

    const data: TkData = await import('../../data/Processed.json');
    const traitIdToName: TkData = await import('../../data/traits.json');

    const calls: any = [];
    const counters: any = {};

    let matched = 0;

    Object.keys(data).forEach((tokenId: any, index: number) => {

        const traitData = new BitArray(64);

        if (data[tokenId].length > 0) {

            data[tokenId].forEach((traitId: number, index: number) => {
                const actualTraitId = traitId - traitIdOffset;
                const traitName = traitIdToName[traitId.toString()];
                traitData.on(actualTraitId);
            });
        }

        let hex = traitData.toHexString();
        if(calls.includes(hex)) {
            if(typeof counters[hex] === "undefined") {
                counters[hex] = 0;
            }
            counters[hex]++;
            if(counters[hex] > 1) {
                matched++;
            }
            console.log(hex, "exists")
        } else {
            calls.push(hex);
        }
    });

    console.log(Object.keys(data).length * 64, "bytes");
    console.log(Object.keys(counters).length);
    console.log(matched * 64, "duplicate bytes");

}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });