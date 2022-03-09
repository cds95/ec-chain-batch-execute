const fs = require('fs');
const { ZERO_ADDRESS, ROLE, Data } = require('../../tests/helpers/common');
import "@nomiclabs/hardhat-ethers";
import { ethers } from "hardhat";

import chai from "chai";
import { solidity } from "ethereum-waffle";
chai.use(solidity);
const { expect } = chai;

async function main() {

    const ethersProvider = new ethers.providers.JsonRpcProvider("https://rinkeby.nowlive.ro/");

    const accounts = await ethers.getSigners();
    console.log("    Deployer                      ", accounts[0].address);

    const Artifacts = await ethers.getContractFactory("ECRegistryV2");

    const RinkebyECRegistry = new ethers.Contract("0xc7c27535f81C6c15Ee2648fEe00D0831FE071891", Artifacts.interface, ethersProvider);
    const LiveECRegistry = new ethers.Contract("0x4fcb9b38cac63957c8877667b0adb9207c890a13", Artifacts.interface, accounts[0]);

    console.log("    Rinkeby ECRegistryV2 address: ", RinkebyECRegistry.address)
    console.log("    Live ECRegistryV2 address:    ", LiveECRegistry.address)

    const traitLength = await RinkebyECRegistry.traitCount();
    const newtraitLength = await LiveECRegistry.traitCount();

    const traitLengthMatches = (traitLength === newtraitLength);
    console.log("    - traitCount matches       ", traitLengthMatches);
    expect(traitLengthMatches).to.be.equal(true);

    for(let i = 0; i < traitLength; i++) {
        const traitDataOld = await RinkebyECRegistry.getData(i, 0, 1250);
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