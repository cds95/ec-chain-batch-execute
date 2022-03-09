const fs = require('fs');
const { ZERO_ADDRESS, ROLE, Data } = require('../../tests/helpers/common');
import "@nomiclabs/hardhat-ethers";
import { ethers } from "hardhat";
import cliTable = require('cli-table');

import DeploymentData from "./deployment/contract.json"; 
import DeploymentTraitData from "./deployment/traits.json"; 
import BitArrayTraitData from "../../data/v2/BitArrayTokenData.json";

const { getNewTraitsObject, traitSetup, getTraitIdByName, getTraitNameById, traitIdOffset } = require("../traitsV2/_traitMap.js");

let ECRegistry: any;
const bytesPerTxn:number = 350;
let txnCount:number = 0;


async function main() {
    
    const accounts = await ethers.getSigners();
    console.log("    Deployer                   ", accounts[0].address);

    const Artifacts = await ethers.getContractFactory("ECRegistryV2");
    const ECRegistryAddress = "0x4fcB9b38CAC63957C8877667B0aDB9207c890a13";
    ECRegistry = new ethers.Contract(ECRegistryAddress, Artifacts.interface, accounts[0]);
    console.log("    ECRegistryV2 address:      ", ECRegistry.address)

//    { id: 28, name: "Good Company" },

    const TraitData = await ECRegistry.getData(7, 0, 1250);
    const chunks = Data.chunk(TraitData, 100);

    console.log(chunks);

}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });