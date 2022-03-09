const fs = require('fs');
const { ZERO_ADDRESS, ROLE, Data } = require('../../tests/helpers/common');
import "@nomiclabs/hardhat-ethers";
import { ethers } from "hardhat";
import cliTable = require('cli-table');
import { BitArray } from "@ethercards/ec-util";

import DeploymentData from "./deployment/contract.json";

const { getNewTraitsObject, traitSetup, getTraitIdByName, getTraitNameById, traitIdOffset } = require("../traitsV2/_traitMap.js");

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

    const traitCount = await ECRegistry.traitCount();
    console.log("          - traitCount:        ", traitCount);

    const table = new cliTable({
        head: ['ID', 'Name', 'Type', 'Start', 'End', 'Implementer', 'setBytes']
      , colWidths: [5, 30, 8, 8, 8, 50, 14]
    });

    for(let i = 0; i < traitCount; i++) {

        const trait = await ECRegistry.traits(i);
        const traitData = await ECRegistry.getData(i, 0, 1250);

        let bytesCount = 0;
        for(let y = 0; y < traitData.length; y++) {
            if(traitData[y] !== 0) {
                bytesCount++;
            }
        }
        // const setTokensData = BitArray.fromUint8Array(traitData);

        // let Bits = setTokensData.toEnabled();

        table.push([
            i,
            trait.name,
            trait.traitType,
            trait.start,
            trait.end,
            trait.implementer,
            bytesCount
        ]);
    }

    console.log(table.toString());

}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });