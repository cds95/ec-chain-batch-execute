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

async function main() {

    let gasCost = ethers.BigNumber.from(0);
    let txnCount: number = 0;

    console.log("");
    console.log("    Deployment Report:");

    const table = new cliTable({
        head: [     'ID', 'Name', 'Gas', 'Trait Id', 'Trait Name', 'Chunk', 'Chunks', 'Hash']
      , colWidths: [ 5,   30,     15,    15,         30,           8,       8       , 80]
    });

    deploymentDataArray.forEach((item:any, index:any) => {
        table.push([
            item.id,
            item.name,
            item.gas,
            item.traitId || "",
            item.traitName || "",
            item.chunk || "",
            item.chunkLength || "",
            item.hash,
        ]);

        gasCost = gasCost.add(item.gas);
        txnCount++;
    });


    console.log(table.toString());

    const gasPrice = ethers.BigNumber.from("35000000000");

    console.log("    - transaction Count          ", txnCount);
    console.log("    - Deployment gasCost in wei: ", gasCost.toString())
    console.log("    - Deployment gasPrice:       ", gasPrice.div(10 ** 9).toString(), "GWEI")

    let maxCostWei = gasCost.mul(gasPrice);
    console.log("    - Deployment wei * price:    ", ethers.utils.formatEther(maxCostWei), "ETH")

}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });