const fs = require('fs')
import "@nomiclabs/hardhat-ethers";
import { ethers } from "hardhat";
import EtherCardsForge from "./../abi/EtherCardsForge.json";





const ecutils = require("ec-util");
const ecForge = new ecutils.Forge();

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
    const data: TkData = await import('../../data/OrigData.json');


    const forgeProtectorTraitId = 109; // : "Forge Protector",

    const provider = new ethers.providers.JsonRpcProvider("https://mainnet.infura.io/v3/cf4ef5272c3e459390943b6fc01f8ab8");
    const forgeContract = new ethers.Contract("0x119cd999356c59b5e4e49a7993a842e20b20ece8", EtherCardsForge.abi, provider);


    let eventFilter = forgeContract.filters.LayerTransfer();
    let events = await forgeContract.queryFilter(eventFilter, 12476436, "latest");

    events.forEach((ev, index) => {
        const args: any = ev.args;
        const decodedEvent = ecForge.decodeLayerTransfer(args["callData"] as any);

        if (parseInt(decodedEvent.srcTokenId) > 0) {
            const tokenId: number = decodedEvent.srcTokenId;
            const hasForgeProtector = data[tokenId].includes(forgeProtectorTraitId);
            const forgeProtectorIndex = data[tokenId].indexOf(forgeProtectorTraitId);

            if (hasForgeProtector) {
                data[tokenId].splice(forgeProtectorIndex, 1);
                console.log("Removed forge protector from id:", tokenId);
            } else {
                console.log("tokenId did not have Forge Protector on", tokenId);

            }

        } else {
            console.log("????", decodedEvent)
        }
    });


    // data

    try {
        fs.writeFileSync('data/Processed.json', JSON.stringify(data));
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