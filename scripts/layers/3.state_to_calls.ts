const fs = require('fs')

import "@nomiclabs/hardhat-ethers";
import { ethers } from "hardhat";


import imgData from '../../data/ImageData.json';


async function main() {

    const calls: any = [];

    for(let i = 0; i < imgData.length; i++) {
        const tokenLayer = imgData[i];
        const tokenId = i;
        const HexData = [];
        HexData[0] = tokenLayer.substr(0, 2);
        HexData[1] = tokenLayer.substr(2, 2);
        HexData[2] = tokenLayer.substr(4, 2);
        HexData[3] = tokenLayer.substr(6, 2);
        HexData[4] = tokenLayer.substr(8, 2);

        const DecData = [];
        DecData[0] = parseInt('0x' + tokenLayer.substr(0, 2), 16);
        DecData[1] = parseInt('0x' + tokenLayer.substr(2, 2), 16);
        DecData[2] = parseInt('0x' + tokenLayer.substr(4, 2), 16);
        DecData[3] = parseInt('0x' + tokenLayer.substr(6, 2), 16);
        DecData[4] = parseInt('0x' + tokenLayer.substr(8, 2), 16);

        // check for uints higher than 255 and error out
        for(let j = 0; j < DecData.length; j++) {
            if(DecData[j] > 255) {
                console.error("Error:", DecData[j]);
            }
        }

        calls.push({ id: tokenId, data: DecData });

        // console.log("TokenId:", tokenId, tokenLayer, HexData.join(","), DecData.join(","));
    }

    console.log("CallCount:", calls.length);

    try {
        fs.writeFileSync('data/LayerDataCalls.json', JSON.stringify(calls));
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