const fs = require('fs');
const { ZERO_ADDRESS, ROLE, Data } = require('../../tests/helpers/common');
import "@nomiclabs/hardhat-ethers";
import { ethers } from "hardhat";
import BitArray from "../../tests/helpers/BitArray";

const deploymentDataArray:deploymentDataEntry[] = [];

import BitArrayTraitData from "../../data/v2/BitArrayTokenData.json";

const { getNewTraitsObject, traitSetup, getTraitIdByName, getTraitNameById, traitIdOffset } = require("../traitsV2/_traitMap.js");

interface deploymentDataEntry {
    "id": number,
    "name": string,
    "hash": string,
    "gas": number,
    "traitId"?: number,
    "traitName"?: string,
    "chunk"?: number,
    "chunkLength"?: number,
}

async function getBalance(account: any) {
    return await ethers.provider.getBalance(account);
}

async function main() {

    const accounts = await ethers.getSigners();
    console.log("    Deployer                   ", accounts[0].address);

    const LiveEthersProvider = new ethers.providers.JsonRpcProvider("https://mainnet.infura.io/v3/1fc164b9a9054e4bab0f54e3d8d312b8");
    const LiveArtifacts = await ethers.getContractFactory("ECRegistryV2");
    const LiveECRegistry = new ethers.Contract("0x4fcb9b38cac63957c8877667b0adb9207c890a13", LiveArtifacts.interface, LiveEthersProvider);

    console.log("    Mainnet ECRegistryV2 address: ", LiveECRegistry.address)

    const LiveTraitLength = await LiveECRegistry.traitCount();
    
    console.log("");
    console.log("    LiveTraitLength               ", LiveTraitLength);

    const traitData = [];
    for(let i = 0; i < LiveTraitLength; i++) {
        const trait = await LiveECRegistry.traits(i);
        traitData.push(trait);
    }

    try {
        fs.writeFileSync('./scripts/Polygon/data/liveTraits.json', JSON.stringify(traitData));
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