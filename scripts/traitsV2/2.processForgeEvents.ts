const fs = require('fs')
import "@nomiclabs/hardhat-ethers";
import { ethers } from "hardhat";
import EtherCardsForge from "./../abi/EtherCardsForge.json";

const { getTraitIdByName } = require("./_traitMap.js");

import { Forge } from "@ethercards/ec-util";
const ecForge = new Forge();

interface ForgeEventArgs {
    0: number,
    1: number,
    2: string,
    src: number,
    dst: number,
    callData: string
}

async function main() {


    interface TkData {
        [key: string]: any
    }
    const origData: TkData = await import('../../data/OrigData.json');
    const data: TkData = await import('../../data/OrigData2.json');


    const forgeProtectorTraitId = getTraitIdByName("Forge Protector");
    const forgedTraitId = getTraitIdByName("Forged");

    const provider = new ethers.providers.JsonRpcProvider("https://mainnet.infura.io/v3/cf4ef5272c3e459390943b6fc01f8ab8");
    const forgeContract = new ethers.Contract("0x119cd999356c59b5e4e49a7993a842e20b20ece8", EtherCardsForge.abi, provider);


    let eventFilter = forgeContract.filters.LayerTransfer();
    let events = await forgeContract.queryFilter(eventFilter, 12476436, "latest");

    events.forEach((ev, index) => {
        const args: any = ev.args;
        const decodedEvent = ecForge.decodeLayerTransfer(args["callData"] as any);

        if (parseInt(decodedEvent.srcTokenId) > 0) {
            const tokenId: number = decodedEvent.srcTokenId;
            // console.log(data[tokenId]);

            const hasForgeProtector = origData[tokenId].includes(forgeProtectorTraitId);
            // const hasForgeProtector = Object.keys(data[tokenId]).includes(forgeProtectorTraitId.toString());
            // console.log("tokenId:",tokenId, Object.keys(data[tokenId]))
            // const forgeProtectorIndex = data[tokenId].indexOf(forgeProtectorTraitId);

            if (hasForgeProtector) {
                delete data[tokenId][forgeProtectorTraitId]; 
                console.log("Removed forge protector from id:", tokenId);
            } else {
                console.log("tokenId did not have Forge Protector on", tokenId);
            }

            // add forged to source card
            data[tokenId][forgedTraitId] = {"id":forgedTraitId, "name":"Forged"};
            console.log("Add forged to", tokenId);

        } else {
            console.log("????", decodedEvent)
        }

        // add forged to receiving card
        if (parseInt(decodedEvent.dstTokenId) > 0) {
            const tokenId: number = decodedEvent.dstTokenId;
            data[tokenId][forgedTraitId] = {"id":forgedTraitId, "name":"Forged"};
            console.log("Add forged to", tokenId);
        }

        

    });


    // data

    try {
        fs.writeFileSync('data/v2/Processed.json', JSON.stringify(data));
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