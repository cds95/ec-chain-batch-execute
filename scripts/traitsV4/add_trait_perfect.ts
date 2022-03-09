const fs = require('fs');
const { ZERO_ADDRESS, ROLE, Data } = require('../../tests/helpers/common');
import "@nomiclabs/hardhat-ethers";
import { ethers } from "hardhat";
import BitArray from "../../tests/helpers/BitArray";
const { getNewTraitsObject, traitSetup, getTraitIdByName, getTraitNameById, traitIdOffset } = require("../traitsV2/_traitMap.js");
import chai from "chai";
import { solidity } from "ethereum-waffle";
chai.use(solidity);
const { expect } = chai;
const BigNumber = ethers.BigNumber;

// const registryAddress = "0xE4EbA7dcD0C3F0D62f39A8573655531f864F54b5"; // rinkeby
const registryAddress = "0x4fcb9b38cac63957c8877667b0adb9207c890a13"; // mainnet

async function main() {

    // const ethersProvider = new ethers.providers.JsonRpcProvider("https://rinkeby.nowlive.ro/");

    const accounts = await ethers.getSigners();
    console.log("    Deployer                      ", accounts[0].address);


    const Artifacts = await ethers.getContractFactory("ECRegistryV2");
    let ECRegistry: any;
    let traitId: any;

    // Perfects
    traitId = 48;
    ECRegistry = new ethers.Contract(registryAddress, Artifacts.interface, accounts[0]);
    console.log("    ECRegistryV2 address:         ", ECRegistry.address);

    const traitData = [122, 147, 163, 392, 560, 692, 784, 807, 826, 856, 883, 958, 977, 990, 1003, 1324, 1346, 1376,
         1414, 1585, 1736, 1784, 1808, 1946, 2098, 2477, 2711, 3083, 3286, 3476, 3478, 3479, 3718, 3882, 3965, 4071,
         4288, 4322, 4416, 4434, 4442, 4623, 4717, 4820, 4821, 4861, 4902, 4942, 5055, 5207, 5271, 5275, 5394, 5472,
         5542, 5552, 5780, 5847, 6062, 6228, 6264, 6338, 6418, 6607, 6695, 6785, 6897, 6904, 6978, 7174, 7260, 7639,
         7801, 8104, 8224, 8277, 8370, 8758, 9046, 9173, 9307, 9327, 9547, 9587, 9643, 9654, 9863, 9877, 9904];
    
    console.log( traitData.join(","));

    const bytesPerTxn:number = 350;
    let ignoredBytes = 0;
    let setBytes = 0;
    let txn: number = 0;

    let traitCalls:any = [];
    let chunks: any = [];
    let chunkLen: number = 0;

    const newTraitData = new BitArray(10000);
    for(let i = 0; i < traitData.length; i++) {
        // console.log("set trait on", traitData[i]);
        newTraitData.on(traitData[i]);
    }

    const endTraitDataHex = newTraitData.toHexString();
    console.log("finalTraitData", endTraitDataHex);
    const finalTraitData = BitArray.fromHexString(endTraitDataHex);

    finalTraitData.toArray().forEach((_value: any, _index:Number) => {
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

    let gasPrice = BigNumber.from(100000000000);
    let gasCost = BigNumber.from(0);

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

        const call = {
            "indexes": indexes,
            "values": values,
        }

        console.log("thisCalls", thisCalls);
        console.log("call", JSON.stringify(call));


        const gasCostEstimate = await ECRegistry.estimateGas.setData(traitId, indexes, values);

        const tx = await ECRegistry.setData(traitId, indexes, values);
        let txReceit = await tx.wait();
        gasCost = gasCost.add(gasCostEstimate);

        console.log("txn:", txn, "traitId:", traitId, "chunk", k+1, "of", chunks.length,
         "gas:", gasCostEstimate.toNumber(), txReceit.cumulativeGasUsed.toNumber(), txReceit.transactionHash);
        
        // deploymentDataArray.push({
        //     id: txn,
        //     name: "Add trait data to contract",
        //     traitId: traitId,
        //     traitName: trait.name,
        //     chunk: k+1,
        //     chunkLength: chunks.length,
        //     hash: txReceit.transactionHash,
        //     gas: gasCostEstimate.toString(),
        // })

    
        txn++;
    }


    console.log("          - gasPrice:        ", gasPrice.div(10**9).toString(), "GWEI");
    console.log("          - Total Gas:       ", gasCost.toString());
    let maxCostWei = gasCost.mul(gasPrice);
    console.log("          - Gas in ETH:      ", ethers.utils.formatEther(maxCostWei), "ETH")

    
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });