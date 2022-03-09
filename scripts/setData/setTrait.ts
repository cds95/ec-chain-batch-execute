const fs = require('fs');
const { ZERO_ADDRESS, ROLE, Data } = require('../../tests/helpers/common');
import "@nomiclabs/hardhat-ethers";
import { ethers } from "hardhat";
import cliTable = require('cli-table');

import DeploymentData from "../traitsV3/deployment/contract.json"; 
import DeploymentTraitData from "../traitsV3/deployment/traits.json"; 
import BitArrayTraitData from "../../data/v2/BitArrayTokenData.json";
// import BitArray from "../../tests/helpers/BitArray";

import { Registry } from "@ethercards/ec-util";


const { getNewTraitsObject, traitSetup, getTraitIdByName, getTraitNameById, traitIdOffset } = require("../traitsV2/_traitMap.js");

let ECRegistry: any;
const bytesPerTxn:number = 350;
let txnCount:number = 0;


async function main() {
    
    const accounts = await ethers.getSigners();
    console.log("    Deployer                   ", accounts[0].address);

    const Artifacts = await ethers.getContractFactory("ECRegistryV2");
    // const ECRegistryAddress = "0x4fcB9b38CAC63957C8877667B0aDB9207c890a13";
    const ECRegistryAddress = "0xE4EbA7dcD0C3F0D62f39A8573655531f864F54b5"; // rinkeby
    
    ECRegistry = new ethers.Contract(ECRegistryAddress, Artifacts.interface, accounts[0]);
    console.log("    ECRegistryV2 address:      ", ECRegistry.address)

    //     { id: 5, name: "Alpha Upgrade" },
    const traitID = 5;
    console.log("Before: ");
    await displayIds(traitID);

    // const addonIds = [4682,4707,4732,4757,4782,4807,4832,4857,4882,4907];
    // 5
    // [5500, 5501, 5502, 5503, 5504, 5505, 5506, 5507, 5508, 5509];
    // 5
    // [4682,4707,4732,4757,4782,4807,4832,4857,4882,4907]
    // [true,true,true,true,true,true,true,true,true,true]
    ;
    const values = [];
    for(let i = 0; i < addonIds.length; i++) {
        values.push(true);
    }
    console.log(addonIds);
    console.log(values);

    let tx = await ECRegistry.setTraitOnMultiple(traitID, addonIds, values);

    console.log("After: ");
    await displayIds(traitID);

    let gasCost = ethers.BigNumber.from("0");
    gasCost = gasCost.add( tx.cumulativeGasUsed );

}

async function displayIds(_traitId: number) {

    const TraitData = await ECRegistry.getData(_traitId, 0, 1250);
    const registry = new Registry();
    const idsWithTrait = registry.decodeTraits(TraitData);
    const idsWithTraitKeys:any = Object.keys(idsWithTrait);

    const ids = [];
    for(let i = 0; i < idsWithTraitKeys.length; i++) {
        ids.push(idsWithTraitKeys[i]);
    }

    console.log(ids);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });