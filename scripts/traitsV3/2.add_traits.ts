const fs = require('fs');
const { ZERO_ADDRESS, ROLE, Data } = require('../../tests/helpers/common');
import "@nomiclabs/hardhat-ethers";
import { ethers } from "hardhat";

import DeploymentData from "./deployment/contract.json";
import deploymentData from "./deployment/deploymentData.json"; 
const deploymentDataArray:deploymentDataEntry[] = deploymentData as deploymentDataEntry[];

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
    const ECRegistry = new ethers.Contract(ECRegistryAddress, Artifacts.interface, accounts[0]);
    console.log("    ECRegistryV2 address:      ", ECRegistry.address)

    
    const traits = getNewTraitsObject();
    let traitCount = Object.keys(traits).length;
    console.log("          - traitCount:      ", traitCount);

    const newTraitCallNames: any = [];
    const newTraitCallAddresses: any = [];
    const newTraitType: any = [];
    const newTraitStart: any = [];
    const newTraitEnd: any = [];

    Object.keys(traits).forEach((key: string, index: number) => {
        if(key.toString() !== "default") {

            const traitName = traits[key.toString()].name;
            const traitId = parseInt(key);

            newTraitCallNames.push(traitName);
            newTraitCallAddresses.push(ZERO_ADDRESS);

            let traitSettings: any = false;
            if(typeof traitSetup[key] !== "undefined"){
                traitSettings = traitSetup[key];
            }

            if(traitSettings.type === 2) {
                newTraitType.push(traitSettings.type);
                newTraitStart.push(traitSettings.start);
                newTraitEnd.push(traitSettings.end);
            } else {
                newTraitType.push(0);
                newTraitStart.push(0);
                newTraitEnd.push(0);
            }
        }
    })

    let tx2 = await ECRegistry.addTrait(newTraitCallNames, newTraitCallAddresses, newTraitType, newTraitStart, newTraitEnd);
    let txReceit = await tx2.wait();
    console.log("          - Gas:             ", txReceit.cumulativeGasUsed.toString());
    console.log("          - Hash:            ", txReceit.transactionHash);


    deploymentDataArray.push({
        id: 2,
        name: "Add traits to contract",
        hash: txReceit.transactionHash,
        gas: txReceit.cumulativeGasUsed.toNumber(),
    });

    try {
        fs.writeFileSync('./scripts/traitsV3/deployment/deploymentData.json', JSON.stringify(deploymentDataArray));
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