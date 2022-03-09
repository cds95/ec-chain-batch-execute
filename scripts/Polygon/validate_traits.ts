const fs = require('fs');
const { ZERO_ADDRESS, ROLE, Data } = require('../../tests/helpers/common');
import "@nomiclabs/hardhat-ethers";
import { ethers } from "hardhat";

import chai from "chai";
import { solidity } from "ethereum-waffle";
chai.use(solidity);
const { expect } = chai;

async function main() {

    const LiveEthersProvider = new ethers.providers.JsonRpcProvider("https://mainnet.infura.io/v3/1fc164b9a9054e4bab0f54e3d8d312b8");
    const LiveArtifacts = await ethers.getContractFactory("ECRegistryV2");
    const LiveECRegistry = new ethers.Contract("0x4fcb9b38cac63957c8877667b0adb9207c890a13", LiveArtifacts.interface, LiveEthersProvider);

    const PolygonEthersProvider = new ethers.providers.JsonRpcProvider("https://polygon-mainnet.infura.io/v3/1fc164b9a9054e4bab0f54e3d8d312b8");
    const PolygonArtifacts = await ethers.getContractFactory("ECRegistryV2Polygon");
    const PolygonECRegistry = new ethers.Contract("0xd4027b9b8942836684cafb1e3c89fa5e92e21409", PolygonArtifacts.interface, PolygonEthersProvider);



    console.log("    Mainnet ECRegistryV2 address: ", LiveECRegistry.address)
    console.log("    Polygon ECRegistryV2 address: ", PolygonECRegistry.address)

    const MainnetTraitLength = await LiveECRegistry.traitCount();
    const PolygonTraitLength = await PolygonECRegistry.traitCount();

    const traitLengthMatches = (MainnetTraitLength === PolygonTraitLength);
    console.log("    - traitCount matches       ", traitLengthMatches);
    expect(traitLengthMatches).to.be.equal(true);

    for(let i = 0; i < MainnetTraitLength; i++) {
        const traitDataOld = await PolygonECRegistry.getData(i, 0, 1250);
        const traitDataNew = await LiveECRegistry.getData(i, 0, 1250);
        const traitDataMatches = (traitDataOld.join(",") === traitDataNew.join(","));
        console.log("    - traitData["+i+"] matches        ", traitDataMatches);

        // forge events don't match as we update them
        // if(i !== 49) {
        //     expect(traitDataMatches).to.be.equal(true);
        // }
        
        // if(!traitDataMatches && i !== 49) {
        //     console.log(traitDataOld.join(","));
        //     console.log(traitDataNew.join(","));
        // }
    
    }

}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });