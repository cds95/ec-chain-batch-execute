const fs = require('fs');
const { ZERO_ADDRESS, ROLE, Data } = require('../../tests/helpers/common');
import "@nomiclabs/hardhat-ethers";
import { ethers } from "hardhat";
import BitArray from "../../tests/helpers/BitArray";

import BitArrayTraitData from "../../data/v2/BitArrayTokenData.json";

const { getNewTraitsObject, traitSetup, getTraitIdByName, getTraitNameById, traitIdOffset } = require("./_traitMap.js");


async function main() {

    interface TkData {
        [key: string]: any
    }

    const deploymentData: TkData = await import('../../data/v2/deploymentData.json');
    // console.log( deploymentData ); 

    let reportKeys = [
        "id",
        "name",
        "traitId",
        "traitName",
        "chunk",
        "chunkLength",
        "gas",
        "hash"
    ];
    // Generate Deployment Report CSV
    let DeploymentCSV = "";
    
    // Add Headers
    for(let i = 0; i < reportKeys.length; i++) {
        DeploymentCSV = reportKeys.join(",")+"\n";
    }

    // Add Items
    const items = Object.keys(deploymentData);
    for(let j = 1; j < items.length; j++) {
        const item: any = deploymentData[j.toString()];

        for(let i = 0; i < reportKeys.length; i++) {
            const key: any = reportKeys[i];
            let value: any = "";

            if(typeof item[key] !== "undefined") {
                if(key === "hash") {
                    value = "https://rinkeby.etherscan.io/tx/"+item[key];
                } else {
                    value = item[key];
                }
            } else {
                value = "";
            }

            if(i > 0) {
                DeploymentCSV+= ",";
            }
            DeploymentCSV+= value;
        }
        DeploymentCSV+="\n";
    }

    // console.log(DeploymentCSV);
    
    try {
        fs.writeFileSync('data/v2/report.csv', DeploymentCSV);
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