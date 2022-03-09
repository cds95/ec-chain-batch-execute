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
// import BitArrayTraitData from "../data/BitArrayTokenData.json";
import BitArrayTraitData from "../../data/v2/BitArrayTokenData.json";

const registryAddress = "0xE4EbA7dcD0C3F0D62f39A8573655531f864F54b5"; // rinkeby
// const registryAddress = "0x4fcb9b38cac63957c8877667b0adb9207c890a13"; // mainnet

function getTraitIds(traitData: any, itemsPerTxn: number) {

    let traitCalls:any = [];
    let chunks: any = [];
    let chunkLen: number = 0;
    let setBytes:number = 0;


    traitData.forEach((_value: any, _index:Number) => {
        if(_value) {
            traitCalls.push({
                value: _index
            })
            setBytes++;
            chunkLen++;

            if(chunkLen === itemsPerTxn) {
                chunkLen = 0;
                chunks.push(traitCalls);
                traitCalls = [];
            }
        }
    })

    if(chunkLen > 0) {
        chunks.push(traitCalls);
    }

    return chunks;
}

async function main() {

    // const ethersProvider = new ethers.providers.JsonRpcProvider("https://rinkeby.nowlive.ro/");

    const accounts = await ethers.getSigners();
    console.log("    Deployer                      ", accounts[0].address);

    const Artifacts = await ethers.getContractFactory("ECRegistryV2");
    const TraitRegistry = new ethers.Contract("0xc7c27535f81C6c15Ee2648fEe00D0831FE071891", Artifacts.interface, accounts[0]);

    console.log("    ECRegistryV2 address:         ", TraitRegistry.address);

    const itemsPerTxn:number = 250;
    const _traitId = 3;  // ArtDrop
    const _traitData = BitArray.fromUint8Array(BitArrayTraitData[_traitId].data);
    const _chunks = getTraitIds(_traitData, itemsPerTxn);
    const traitData = [];
    for (let k = 0; k < _chunks.length; k++) {
        let values:any = [];
        let thisCalls = _chunks[k];
        for(let i = 0; i < itemsPerTxn; i++) {
            if(typeof thisCalls[i] !== "undefined") {
                values.push(thisCalls[i].value);
            }

            traitData.push(thisCalls[i].value);
        }

        // let tx = await Contract.batchAdd(values);
        // let rct = await tx.wait();
    }


    const dataStart = 10;
    const dataEND = 10000;
    const ranges: any = {};

    let prevExists = false;
    let lastRange = 0;

    for(let i = dataStart; i < dataEND; i++) {
        
        if( traitData.includes(i) ) {
            // console.log("i:", i, 'exists');
            if(prevExists) {
                // increase prev range
                ranges[lastRange].end++;
                ranges[lastRange].count++;
            } else {
                // create new range
                lastRange++;
                ranges[lastRange] = {
                    start:i,
                    end:i,
                    count:1
                }
            }
            prevExists = true;
        } else {
            // console.log("i:", i, 'not found');
            prevExists = false;
        }
    }

    const rangeKeys = Object.keys(ranges);
    let totalCount = 0;
    let largest = 0;
    let largestRange: any;

    for(let i = 0; i < rangeKeys.length; i++) {
        const key = rangeKeys[i];
        const range = ranges[key];
        if(largest < range.count) {
            largest = range.count;
            largestRange = range;
        }
        totalCount+=range.count;
    }

    // console.log("ranges:       ", ranges);
    // console.log("largest range:", largestRange);
    console.log("total items:  ", totalCount);

    console.log("Giveaway SETS");
    // console.log("- og range:      ", ranges["1"]);
    // console.log("- alpha range:   ", ranges["2"]);
    // console.log("- founder range: ", ranges["3"]);
    console.log("  - extra data:  ", totalCount - largest - ranges["1"].count - ranges["2"].count);

    // prepare trait data outside range    

    const ExtraData = [];
    for(let i = dataStart; i < dataEND; i++) {
        if(traitData.includes(i)) {
            ExtraData.push(i);
        } 
    }
    
    console.log("Trait bit SETS");
    console.log("ExtraData length:  ", ExtraData.length);
    console.log( ExtraData.join(","));


    const bytesPerTxn:number = 305;
    let ignoredBytes = 0;
    let setBytes = 0;
    let txn: number = 0;

    let traitCalls:any = [];
    let chunks: any = [];
    let chunkLen: number = 0;

    const newTraitData_OG = new BitArray(100);
    const newTraitData_Alpha = new BitArray(1000);
    const newTraitData_Founder = new BitArray(10000);

    for(let i = 0; i < ExtraData.length; i++) {
        const val = ExtraData[i];
        if(val < 100) {
            newTraitData_OG.on(val);
        } else if(val >= 100 && val < 1000) {
            newTraitData_Alpha.on(val);
        } else {
            newTraitData_Founder.on(val);
        }
    }

    console.log("finalTraitData OG      ", newTraitData_OG.toHexString());
    console.log("finalTraitData Alpha   ", newTraitData_Alpha.toHexString());
    console.log("finalTraitData Founder ", newTraitData_Founder.toHexString());

    // const endTraitDataHex = newTraitData_OG.toHexString();
    // const finalTraitData = BitArray.fromHexString(endTraitDataHex);



    // finalTraitData.toArray().forEach((_value: any, _index:Number) => {
    //     // do range and invert trait setup
    //     if(_value !== 0) {
    //         traitCalls.push({
    //             index: _index, 
    //             value: _value
    //         })
    //         setBytes++;
    //         chunkLen++;
    //         if(chunkLen === bytesPerTxn) {
    //             chunkLen = 0;
    //             chunks.push(traitCalls);
    //             traitCalls = [];
    //         }
    //     } else {
    //         ignoredBytes++;
    //     }
    // })

    // if(setBytes > 0) {
    //     chunks.push(traitCalls);
    // }


    // console.log("    setBytes:                  ", traitCalls.length);
    // console.log("    ignored bytes ( b === 0 ): ", ignoredBytes);
    // console.log("    transaction count:         ", chunkLen);

    // for(let i = 0; i < chunks.length; i++) {
    //     console.log("      - bytes in chunk["+i+"]:     ", chunks[i].length);
    // }

    // for (let k = 0; k < chunks.length; k++) {
    //     let indexes:any = [];
    //     let values:any = [];

    //     let thisCalls = chunks[k];
    //     for(let i = 0; i < bytesPerTxn; i++) {
    //         if(typeof thisCalls[i] !== "undefined") {
    //             indexes.push(thisCalls[i].index);
    //             values.push(thisCalls[i].value);
    //         }
    //     }

    //     txn++;
    // }



    
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });