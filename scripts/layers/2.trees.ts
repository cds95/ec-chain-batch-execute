const fs = require('fs')

import "@nomiclabs/hardhat-ethers";
import { ethers } from "hardhat";
import BitArray from "../../tests/helpers/BitArray";
const traitIdOffset = 101;

import imgData from '../../data/ImageData.json';

async function main() {


    const counters: any = {};

    for(let i = 0; i < imgData.length; i++) {
        const tokenLayer = imgData[i];
        const tokenId = i + 1;

        if(typeof counters[tokenLayer] === "undefined") {
            counters[tokenLayer] = 1;
        } else {
            counters[tokenLayer]++;
        }
    }

    let matched = 0;
    Object.keys(counters).forEach((key: any, count: number) => {

        if(counters[key] > 1) {
            console.log(key, counters[key] )
            matched++;
        }

    });
    console.log(matched);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });