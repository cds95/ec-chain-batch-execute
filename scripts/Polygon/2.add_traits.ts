const fs = require('fs');
const { ZERO_ADDRESS, ROLE, Data } = require('../../tests/helpers/common');
import "@nomiclabs/hardhat-ethers";
import { ethers } from "hardhat";
import BitArray from "../../tests/helpers/BitArray";
import LiveTraitData from "./data/liveTraits.json";

async function main() {

    const contractAddress = "0xd4027b9b8942836684cafb1e3c89fa5e92e21409";

    const accounts = await ethers.getSigners();
    console.log("    Deployer                   ", accounts[0].address);

    const PolygonArtifacts = await ethers.getContractFactory("ECRegistryV2Polygon");
    const PolygonECRegistry = new ethers.Contract(contractAddress, PolygonArtifacts.interface, accounts[0]);

    console.log("    Polygon ECRegistryV2 address: ", PolygonECRegistry.address)
    const PolygonTraitLength = await PolygonECRegistry.traitCount();
    
    // console.log("");
    console.log("    PolygonTraitLength            ", PolygonTraitLength);

    const newTraitCallNames: any = [];
    const newTraitCallAddresses: any = [];
    const newTraitType: any = [];
    const newTraitStart: any = [];
    const newTraitEnd: any = [];

    for(let i = 0; i < LiveTraitData.length; i++) {
        const trait = LiveTraitData[i];
        newTraitCallNames.push(trait[0]);
        newTraitCallAddresses.push(trait[1]);
        newTraitType.push(trait[2]);
        newTraitStart.push(trait[3]);
        newTraitEnd.push(trait[4]);
    }

    // console.log(newTraitCallNames, newTraitCallAddresses, newTraitType, newTraitStart, newTraitEnd);

    // let tx = await PolygonECRegistry.addTrait(newTraitCallNames, newTraitCallAddresses, newTraitType, newTraitStart, newTraitEnd);
    // console.log("    TX hash:                   ", tx.hash);
    // let receipt1 = await tx.wait();
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });