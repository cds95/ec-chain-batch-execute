const fs = require('fs');
const { ZERO_ADDRESS, ROLE, Data } = require('../../tests/helpers/common');
import "@nomiclabs/hardhat-ethers";
import { ethers } from "hardhat";
import { BitArray } from "@ethercards/ec-util";
// import BitArray from "../../tests/helpers/BitArray";

import BitArrayTraitData from "../../data/v2/BitArrayTokenData.json";

const { getNewTraitsObject, traitSetup, getTraitIdByName, getTraitNameById, traitIdOffset } = require("./_traitMap.js");

// build trait data arrays
const BitArrayTraits: any = [];
const BitArrayTraitsChain: any = [];

function hasTrait(traitID: number, tokenId: number) {
    return BitArrayTraitsChain[traitID][tokenId];
}

function getLocalTraitData(id: any) {
    let retval: any = [];
    for(let j = 0; j < BitArrayTraitsChain.length; j++) {
        retval[j] = BitArrayTraitsChain[j][id];
        // console.log("token id", id, "trait", j, "data", BitArrayTraitsChain[j][id]);
    }
    return retval;
}

function fromTraitsData(id: any) {
    let retval: any = [];

    for(let i = 0; i < BitArrayTraitData.length; i++) {
        const hasTrait = BitArrayTraits[i].get(id);
        if(hasTrait) {
            retval.push({ id:i, name:getTraitNameById(i) });
        }
    }    
    return retval;
}

function toTraits(arr: any) {
    let retval: any = [];

    Object.keys(arr).forEach(item => {
        retval.push({ id:item, name:getTraitNameById(item) });
    })

    return retval;
}

function localTraits(tokenId: any) {
    let retval: any = [];
    let tokenLocalData = getLocalTraitData(tokenId);
    
    let nextSpace = 8;
    let output = "";
    for(let i = 0; i < tokenLocalData.length; i++) {
        
        if(nextSpace === i) {
            output+=" ";
            nextSpace+=8;
        }
        output+=tokenLocalData[i];
    }
    console.log(output);
    
    for(let i = 0; i < tokenLocalData.length; i++) {
        if(tokenLocalData[i] === "1") {
            retval.push({ id:i, name:getTraitNameById(i) });
        }
    }
    return retval;
}

async function showData(ECRegistry: any, id: any) {
    
    let tokenId = id;
    console.log("Show Token Data:", tokenId);
    let chainTokenData = await ECRegistry.getTokenData(tokenId);
    let tokenData = BitArray.fromUint8Array(chainTokenData);    
    console.log(tokenId, tokenData.toBinaryString());
    
    console.log("traits using getTokenData:");
    console.log(toTraits(tokenData.toEnabled()) );
    
    console.log("traits using BitArrayTokenData:");
    console.log(fromTraitsData(tokenId) );

    console.log("traits using javascriptGetTokenData:");
    console.log(localTraits(tokenId) );
    console.log();   

}

async function main() {

    const accounts = await ethers.getSigners();

    const Artifacts = await ethers.getContractFactory("ECRegistryV2");
    const ECRegistry = new ethers.Contract("0x69018e3733c787342e80ba99121e76dc9c521031", Artifacts.interface, accounts[0]);

    for(let i = 0; i < BitArrayTraitData.length; i++) {
    // for(let i = 40; i < 41; i++) {
        // console.log(i, "length", BitArrayTraitData[i].data.length)

        if(BitArrayTraitData[i].data.length > 1) {
            BitArrayTraits[BitArrayTraitData[i].id] = BitArray.fromUint8Array(BitArrayTraitData[i].data);
        } else {
            BitArrayTraits[BitArrayTraitData[i].id] = new BitArray(10000);
            // console.log("made new empty bitArray")
        }
        
        const traitData = await ECRegistry.getData(i, 0, 1250);
        const str = BitArray.fromUint8Array(traitData);    
        BitArrayTraitsChain[i] = str.toBinaryString("");
    }


    await showData(ECRegistry, 9);
    await showData(ECRegistry, 10);
    await showData(ECRegistry, 11);
    await showData(ECRegistry, 12);
    await showData(ECRegistry, 13);
    await showData(ECRegistry, 14);
    await showData(ECRegistry, 15);
    await showData(ECRegistry, 16);

    await showData(ECRegistry, 9994);
    await showData(ECRegistry, 9995);
    await showData(ECRegistry, 9996);
    await showData(ECRegistry, 9997);
    await showData(ECRegistry, 9998);
    await showData(ECRegistry, 9999);
    await showData(ECRegistry, 10000);

}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });

