const fs = require('fs');
const { ZERO_ADDRESS, ROLE, Data } = require('../../tests/helpers/common');
import "@nomiclabs/hardhat-ethers";
import { ethers } from "hardhat";
import cliTable = require('cli-table');

import DeploymentData from "./deployment/contract.json"; 

import deploymentData from "./deployment/deploymentData.json"; 
const deploymentDataArray:deploymentDataEntry[] = deploymentData as deploymentDataEntry[];

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

    const contractControllerLength = await ECRegistry.getContractControllerLength();
    console.log("    - ContractControllerLength: ", contractControllerLength.toString());
    for(let i = 0; i < contractControllerLength; i++) {
        console.log("      - ["+i+"]:                   ", await ECRegistry.getContractControllerAt(i));
    }

    const traitControllerLength = await ECRegistry.traitControllerCount();
    console.log("    - TraitControllerLength:    ", traitControllerLength.toString());
    for(let i = 1; i <= traitControllerLength; i++) {
        const addr = await ECRegistry.traitControllerById(i);
        const cid = await ECRegistry.traitControllerByAddress(addr);
        const access = await ECRegistry.getTraitControllerAccessData(addr);
        console.log("      - ["+i+"]:                   ", cid, addr, access.join(","));
    }


}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });