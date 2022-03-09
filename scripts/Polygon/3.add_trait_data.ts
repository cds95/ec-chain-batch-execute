const fs = require('fs');
const { ZERO_ADDRESS, ROLE, Data } = require('../../tests/helpers/common');
import "@nomiclabs/hardhat-ethers";
import { ethers } from "hardhat";
import BitArray from "../../tests/helpers/BitArray";
import LiveTraitData from "./data/liveTraitData.json";

async function main() {

    const bytesPerTxn:number = 350;
    let gasCost = ethers.BigNumber.from(0);
    let txn: number = 1;

    // const contractAddress = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512"; // localhost
    const contractAddress = "0xd4027b9b8942836684cafb1e3c89fa5e92e21409"; // polygon

    const accounts = await ethers.getSigners();
    console.log("    Deployer                   ", accounts[0].address);

    const PolygonArtifacts = await ethers.getContractFactory("ECRegistryV2Polygon");
    const PolygonECRegistry = new ethers.Contract(contractAddress, PolygonArtifacts.interface, accounts[0]);

    console.log("    Polygon ECRegistryV2 address: ", PolygonECRegistry.address)
    const PolygonTraitLength = await PolygonECRegistry.traitCount();
    
    // console.log("");
    console.log("    PolygonTraitLength            ", PolygonTraitLength);

    // const newTraitCallNames: any = [];
    // const newTraitCallAddresses: any = [];
    // const newTraitType: any = [];
    // const newTraitStart: any = [];
    // const newTraitEnd: any = [];


    // for(let i = 0; i < LiveTraitData.length; i++) {
    // for(let i = 0; i < 1; i++) {
        // const trait = LiveTraitData[i];
        // console.log(trait);

    for(let i = 30; i < LiveTraitData.length; i++) {

        const traitId = i;

        const chunks = addTraitData(traitId, LiveTraitData[i], bytesPerTxn);
    
    
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
    
            const gasCostEstimate = await PolygonECRegistry.estimateGas.setData(traitId, indexes, values);
            const tx = await PolygonECRegistry.setData(traitId, indexes, values);
            console.log("txn:", txn, "traitId:", traitId, "chunk", k+1, "of", chunks.length)
            console.log("  - hash:         ", tx.hash);

            let txReceit = await tx.wait();
            gasCost = gasCost.add(txReceit.cumulativeGasUsed);
            let cost = txReceit.cumulativeGasUsed.toNumber();

            console.log("  - gas-used:     ", gasCostEstimate.toNumber());
            console.log("  - gas-estimate: ", cost);

            txn++;
        }
    
    }

    // console.log(newTraitCallNames, newTraitCallAddresses, newTraitType, newTraitStart, newTraitEnd);

    // let tx = await PolygonECRegistry.addTrait(newTraitCallNames, newTraitCallAddresses, newTraitType, newTraitStart, newTraitEnd);
    // console.log("    TX hash:                   ", tx.hash);
    // let receipt1 = await tx.wait();


}

function addTraitData(traitId: number, traitData: any, bytesPerTxn: number): any {
    let setBytes:number = 0;
    let ignoredBytes:number = 0;

    let traitCalls:any = [];
    let chunks: any = [];
    let chunkLen: number = 0;

    console.log("    Preparing data for Trait:  ", traitId);

    traitData.forEach((_value: any, _index:Number) => {
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

    return chunks;
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });