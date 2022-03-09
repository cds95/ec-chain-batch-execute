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
    const Artifacts = await ethers.getContractFactory("ECRegistryV2");

    const deployedInstance = await Artifacts.deploy();
    await deployedInstance.deployed();
    
    let tx = await deployedInstance.provider.getTransactionReceipt(deployedInstance.deployTransaction.hash);

    console.log("    Deployment hash:           ", deployedInstance.deployTransaction.hash)
    console.log("    Deployment address:        ", deployedInstance.address)

    const ECRegistry = new ethers.Contract(deployedInstance.address, Artifacts.interface, accounts[0]);

    console.log("");
    console.log("    Validate:");
    console.log("npx hardhat verify --network rinkeby --contract contracts/ECRegistryV2.sol:ECRegistryV2 "+ECRegistry.address);

    const deployment = {
        "name": "ECRegistryV2",
        "network": process.env.HARDHAT_NETWORK,
        "address": ECRegistry.address, 
    };
    

    deploymentDataArray.push({
        id: 1,
        name: "Contract Deployment - ECRegistryV2",
        hash: deployedInstance.deployTransaction.hash,
        gas: tx.cumulativeGasUsed.toNumber(),
    });

    try {
        fs.writeFileSync('./scripts/traitsV3/deployment/deploymentData.json', JSON.stringify(deploymentDataArray));
        //file written successfully
    } catch (err) {
        console.error(err);
    }
    
    try {
        fs.writeFileSync('scripts/traitsV3/deployment/contract.json', JSON.stringify(deployment));
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