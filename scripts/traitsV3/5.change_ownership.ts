const fs = require('fs');
const { ZERO_ADDRESS, ROLE, Data } = require('../../tests/helpers/common');
import "@nomiclabs/hardhat-ethers";
import { ethers } from "hardhat";
import cliTable = require('cli-table');

import DeploymentData from "./deployment/contract.json"; 

// import deploymentData from "./deployment/deploymentData.json"; 
// const deploymentDataArray:deploymentDataEntry[] = deploymentData as deploymentDataEntry[];

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
let ECRegistry: any;

function getContractAddressForNetwork(name: string, network: string | undefined) {

    if( DeploymentData.network === network && DeploymentData.name === name  ) {
        return DeploymentData.address;
    }
    throw new Error("deployment data not found");
}

async function main() {

    const accounts = await ethers.getSigners();
    console.log("    Deployer                   ", accounts[0].address);

    const Artifacts = await ethers.getContractFactory("ECRegistryV2");
    const ECRegistryAddress = getContractAddressForNetwork("ECRegistryV2", process.env.HARDHAT_NETWORK );
    ECRegistry = new ethers.Contract(ECRegistryAddress, Artifacts.interface, accounts[0]);
    console.log("    ECRegistryV2 address:      ", ECRegistry.address)

    const traitCount = await ECRegistry.traitCount();
    console.log("    - traitCount:     ", traitCount);

    let traitIDs = [];
    for(let i = 0; i < traitCount; i++) {
        traitIDs.push(i);
    }
 
    let hasAccess = await ECRegistry.addressCanModifyTraits(accounts[0].address, traitIDs);
    console.log("    - hasAccess?:     ", accounts[0].address, hasAccess);

    // set new controller access
    await ECRegistry.setTraitControllerAccessData("0x90Dbd11d4842aE3b51cD0AB1ecC32bD8cD756307", [255,255,255,255,255,255,255,255]);

    // unset controller access for self
    await ECRegistry.setTraitControllerAccessData(accounts[0].address, [0,0,0,0,0,0,0,0]);

    hasAccess = await ECRegistry.addressCanModifyTraits(accounts[0].address, traitIDs);
    console.log("    - hasAccess?:     ", accounts[0].address, hasAccess);

    hasAccess = await ECRegistry.addressCanModifyTraits("0x90Dbd11d4842aE3b51cD0AB1ecC32bD8cD756307", traitIDs);
    console.log("    - hasAccess?:     ", "0x90Dbd11d4842aE3b51cD0AB1ecC32bD8cD756307", hasAccess);

    // transfer Ownership to ledger
    console.log("    - old owner:      ", await ECRegistry.owner());
    await ECRegistry.transferOwnership("0x90Dbd11d4842aE3b51cD0AB1ecC32bD8cD756307");
    console.log("    - new owner:      ", await ECRegistry.owner());

}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });