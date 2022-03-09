const fs = require('fs');
const { ZERO_ADDRESS, ROLE, Data } = require('../../tests/helpers/common');
import "@nomiclabs/hardhat-ethers";
import { ethers } from "hardhat";

import DeploymentData from "./deployment/contract.json"; 
import DeploymentTraitData from "./deployment/traits.json"; 
const DeploymentTraitArray:DeploymentTrait[] = DeploymentTraitData as DeploymentTrait[];
import deploymentData from "./deployment/deploymentData.json"; 
const deploymentDataArray:deploymentDataEntry[] = deploymentData as deploymentDataEntry[];

import BitArrayTraitData from "../../data/v2/BitArrayTokenData.json";

const { getNewTraitsObject, traitSetup, getTraitIdByName, getTraitNameById, traitIdOffset } = require("../traitsV2/_traitMap.js");

let ECRegistry: any;
const bytesPerTxn:number = 350;
let txnCount:number = 0;

let gasCost = ethers.BigNumber.from(0);
let txn: number = 3;

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

interface DeploymentTrait {
    "id": number,
    "setBytes": number,
    "ignoredBytes": number,
    "txns": number
}

function getContractAddressForNetwork(name: string, network: string | undefined) {

    if( DeploymentData.network === network && DeploymentData.name === name  ) {
        return DeploymentData.address;
    }
    throw new Error("deployment data not found");
}

function getTraitCount() {
    return DeploymentTraitArray.length;
}

async function addTraitData(traitId: number) {
    const trait = await ECRegistry.traits(traitId);
    const traitData = await ECRegistry.getData(traitId, 0, 1250);
    let setBytes:number = 0;
    let ignoredBytes:number = 0;

    let traitCalls:any = [];
    let chunks: any = [];
    let chunkLen: number = 0;

    console.log("    Preparing data for Trait:  ", traitId, trait.name);

    BitArrayTraitData[traitId].data.forEach((_value: any, _index:Number) => {
        // do range and invert trait setup
        if(_value !== 0) {
            traitCalls.push({
                index: _index, 
                value: _value
            })
            setBytes++;
            chunkLen++;
            if(chunkLen === bytesPerTxn) {
                chunkLen = 0;
                chunks.push(traitCalls);
                traitCalls = [];
            }
        } else {
            ignoredBytes++;
        }
    })

    if(setBytes > 0) {
        chunks.push(traitCalls);
    }


    console.log("    setBytes:                  ", traitCalls.length);
    console.log("    ignored bytes ( b === 0 ): ", ignoredBytes);
    console.log("    transaction count:         ", chunkLen);

    for(let i = 0; i < chunks.length; i++) {
        console.log("      - bytes in chunk["+i+"]:     ", chunks[i].length);
    }


    for (let k = 0; k < chunks.length; k++) {
        let indexes:any = [];
        let values:any = [];

        let thisCalls = chunks[k];
        for(let i = 0; i < bytesPerTxn; i++) {
            if(typeof thisCalls[i] !== "undefined") {
                indexes.push(thisCalls[i].index);
                values.push(thisCalls[i].value);
            }
        }

        // if(txn > 28) {
        //     console.log("txn:", txn, " skipped.");
        // }
        // else
        // {

            const gasCostEstimate = await ECRegistry.estimateGas.setData(traitId, indexes, values);

            const tx = await ECRegistry.setData(traitId, indexes, values);
            let txReceit = await tx.wait();
            gasCost = gasCost.add(txReceit.cumulativeGasUsed);
            let cost = txReceit.cumulativeGasUsed.toNumber();

            console.log("txn:", txn, "traitId:", traitId, "chunk", k+1, "of", chunks.length, "gas:", gasCostEstimate.toNumber(), txReceit.transactionHash);
            
            deploymentDataArray.push({
                id: txn,
                name: "Add trait data to contract",
                traitId: traitId,
                traitName: trait.name,
                chunk: k+1,
                chunkLength: chunks.length,
                hash: txReceit.transactionHash,
                gas: gasCostEstimate.toString(),
            })

        // }
        txn++;
    }


    txnCount+= chunks.length;

    console.log("");

    DeploymentTraitArray.push({
        "id": traitId,
        "setBytes": traitCalls.length,
        "ignoredBytes": ignoredBytes,
        "txns": chunks.length
    })
}

async function main() {

    const accounts = await ethers.getSigners();
    console.log("    Deployer                   ", accounts[0].address);

    const Artifacts = await ethers.getContractFactory("ECRegistryV2");
    const ECRegistryAddress = getContractAddressForNetwork("ECRegistryV2", process.env.HARDHAT_NETWORK );
    ECRegistry = new ethers.Contract(ECRegistryAddress, Artifacts.interface, accounts[0]);
    console.log("    ECRegistryV2 address:      ", ECRegistry.address)

    // for(let z = 0; z <= 12; z++) {
    for(let z = 0; z < BitArrayTraitData.length; z++) {
        await addTraitData(z);
    }

    try {
        fs.writeFileSync('./scripts/traitsV3/deployment/deploymentData.json', JSON.stringify(deploymentDataArray));
        //file written successfully
    } catch (err) {
        console.error(err);
    }


    try {
        fs.writeFileSync('./scripts/traitsV3/deployment/traits.json', JSON.stringify(DeploymentTraitArray));
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