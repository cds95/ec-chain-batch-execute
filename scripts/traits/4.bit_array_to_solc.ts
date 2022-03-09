const { ZERO_ADDRESS, ROLE, Data } = require('../../tests/helpers/common');
import "@nomiclabs/hardhat-ethers";
import { ethers } from "hardhat";
import BitArray from "../../tests/helpers/BitArray";

import BitArrayTokenData from "../../data/BitArrayTokenData.json";

async function main() {

    let gasCost = ethers.BigNumber.from(0);

    const data = new Data();
    // await data.init();

    const accounts = await ethers.getSigners();
    console.log("Deployer", accounts[0].address);

    const Artifacts = await ethers.getContractFactory("ECRegistry");

    const deployedInstance = await Artifacts.deploy();
    await deployedInstance.deployed();
    let tx = await deployedInstance.provider.getTransactionReceipt(deployedInstance.deployTransaction.hash);

    const ECRegistry = new ethers.Contract(deployedInstance.address, Artifacts.interface, accounts[0]);

    const idsPerTxn = 120;
    const txnCount = Math.ceil(BitArrayTokenData.length / idsPerTxn);
    const chunks = data.chunk(BitArrayTokenData, idsPerTxn);


    interface TkData {
        [key: string]: any
    }

    let traitIdToName: TkData = await import('../../data/traits.json');
    let traitCount = Object.keys(traitIdToName).length;
    let traitOffset = 101;
    console.log("          - traitCount:      ", traitCount);
    console.log("          - traitOffset:     ", traitOffset);

    const newTraitCallNames: any = [];
    const newTraitCallAddresses: any = [];

    Object.keys(traitIdToName).forEach((key: string, index: number) => {
        if(key.toString() !== "default") {
            newTraitCallNames.push(traitIdToName[key.toString()]);
            newTraitCallAddresses.push(ZERO_ADDRESS);
        }
    })

    let tx2 = await ECRegistry.addTrait(newTraitCallNames, newTraitCallAddresses);
    let txReceit = await tx2.wait();
    console.log("          - Gas:             ", txReceit.cumulativeGasUsed.toString());


    console.log("chunks: ", chunks.length);
    for (let i = 0; i < chunks.length; i++) {

        const idsArray: any = [];
        const dataArray: any = [];

        for (let j = 0; j < chunks[i].length; j++) {
            const traitData = BitArray.fromHexString(chunks[i][j].data);
            if (parseInt(chunks[i][j].id) > 0) {
                idsArray.push(chunks[i][j].id);
                dataArray.push(traitData.toArray());
            }
        };

        const tx = await ECRegistry.setData(idsArray, dataArray);
        let txReceit = await tx.wait();
        gasCost = gasCost.add(txReceit.cumulativeGasUsed);

        console.log(i, txReceit.cumulativeGasUsed.toString())
    }

    console.log("gasCost:", gasCost.toString())

    // gasCost = ethers.BigNumber.from("577208972");
    const gasPrice = ethers.BigNumber.from("15000000000");

    console.log("    Deployment gasCost in wei: ", gasCost.toString())
    console.log("    Deployment gasPrice:       ", gasPrice.div(10 ** 9).toString(), "GWEI")

    let maxCostWei = gasCost.mul(gasPrice);
    console.log("    Deployment wei * price:    ", ethers.utils.formatEther(maxCostWei), "ETH")

    // npx hardhat verify --network rinkeby 0x0c994c9f733c854a83e90711510b80ea0afe4024

    // gasCost: 667629485
    // Deployment gasCost in wei:  667629485
    // Deployment gasPrice:        2 GWEI
    // Deployment wei * price:     1.33525897 ETH
    
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });