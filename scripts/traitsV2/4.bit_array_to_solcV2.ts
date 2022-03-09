const fs = require('fs');
const { ZERO_ADDRESS, ROLE, Data } = require('../../tests/helpers/common');
import "@nomiclabs/hardhat-ethers";
import { ethers } from "hardhat";
import BitArray from "../../tests/helpers/BitArray";

import BitArrayTraitData from "../../data/v2/BitArrayTokenData.json";

const { getNewTraitsObject, traitSetup, getTraitIdByName, getTraitNameById, traitIdOffset } = require("./_traitMap.js");

async function getBalance(account: any) {
    return await ethers.provider.getBalance(account);
}

async function main() {

    const deploymentData: any = {};
    let txn = 1;

    let gasCost = ethers.BigNumber.from(0);

    const data = new Data();
    // await data.init();

    const accounts = await ethers.getSigners();
    console.log("Deployer            ", accounts[0].address);

    const initialBalance = await getBalance(accounts[0].address)
    console.log("Initial Balance:    ", initialBalance.toString() );

    

    const Artifacts = await ethers.getContractFactory("ECRegistryV2");

    const deployedInstance = await Artifacts.deploy();
    await deployedInstance.deployed();
    
    let tx = await deployedInstance.provider.getTransactionReceipt(deployedInstance.deployTransaction.hash);

    const ECRegistry = new ethers.Contract(deployedInstance.address, Artifacts.interface, accounts[0]);

    deploymentData[txn] = {
        id: txn,
        name: "Contract Deployment",
        hash: tx.transactionHash,
        gas: tx.cumulativeGasUsed.toString(),
    }
    txn++;

    gasCost = gasCost.add(tx.cumulativeGasUsed);


    const traits = getNewTraitsObject();
    let traitCount = Object.keys(traits).length;
    console.log("          - traitCount:      ", traitCount);

    const newTraitCallNames: any = [];
    const newTraitCallAddresses: any = [];
    const newTraitType: any = [];
    const newTraitStart: any = [];
    const newTraitEnd: any = [];

    Object.keys(traits).forEach((key: string, index: number) => {
        if(key.toString() !== "default") {

            const traitName = traits[key.toString()].name;
            const traitId = parseInt(key);

            newTraitCallNames.push(traitName);
            newTraitCallAddresses.push(ZERO_ADDRESS);

            let traitSettings: any = false;
            if(typeof traitSetup[key] !== "undefined"){
                traitSettings = traitSetup[key];
            }

            if(traitSettings.type === 2) {
                newTraitType.push(traitSettings.type);
                newTraitStart.push(traitSettings.start);
                newTraitEnd.push(traitSettings.end);
            } else {
                newTraitType.push(0);
                newTraitStart.push(0);
                newTraitEnd.push(0);
            }
        }
    })

    let tx2 = await ECRegistry.addTrait(newTraitCallNames, newTraitCallAddresses, newTraitType, newTraitStart, newTraitEnd);
    let txReceit = await tx2.wait();
    console.log("          - Gas:             ", txReceit.cumulativeGasUsed.toString());
    console.log("          - Hash:            ", txReceit.transactionHash);

    gasCost = gasCost.add(txReceit.cumulativeGasUsed);

    deploymentData[txn] = {
        id: txn,
        name: "Add traits to contract",
        hash: txReceit.transactionHash,
        gas: txReceit.cumulativeGasUsed.toString(),
    }
    txn++;

    const idsPerTxn = 350;
    let totalTxnCount = 0;
    let ignoredBytes = 0;
    let setBytes = 0;
    let calls:any = [];
    

    BitArrayTraitData.forEach((traitDataArray: any, traitId:Number) => {
        
        let traitCalls:any = [];
        // console.log(traitId, traitDataArray);

        traitDataArray.data.forEach((_value: any, _index:Number) => {
            if(_value !== 0) {
                traitCalls.push({
                    index: _index, 
                    value: _value
                })
                setBytes++;
            } else {
                ignoredBytes++;
            }
        })

        calls.push({ id: traitId, data: traitCalls });
    });

    let cost: number = 0;
    let highestTxnCost: number = 0;
    for(let i = 0; i < calls.length; i++) {
        const traitArray = calls[i];
        const traitId = traitArray.id;
        const traitCalls = traitArray.data;

        const chunks = data.chunk(traitCalls, idsPerTxn);
        totalTxnCount+=chunks.length;

        for (let k = 0; k < chunks.length; k++) {
            
            // console.log(traitId, "chunk", k, "of", chunks.length);

            let indexes:any = [];
            let values:any = [];
    
            for(let j = k*idsPerTxn; j < (k+1)*idsPerTxn; j++) {
                if(typeof traitCalls[j] !== "undefined") {
                    indexes.push(traitCalls[j].index);
                    values.push(traitCalls[j].value);
                }
            }

            // for (let l = 0; l < indexes.length; l++) {
            //     console.log("l:", l, "traitId:", traitId, "idx:", indexes[l], "val:", values[l]);
            // }


            const tx = await ECRegistry.setData(traitId, indexes, values);
            let txReceit = await tx.wait();
            gasCost = gasCost.add(txReceit.cumulativeGasUsed);

            cost = txReceit.cumulativeGasUsed.toNumber();
            if(highestTxnCost < cost) {
                highestTxnCost = cost;
            }
            console.log("txn:", txn, "traitId:", traitId, "chunk", k+1, "of", chunks.length, "gas:", cost, txReceit.transactionHash);
            
            deploymentData[txn] = {
                id: txn,
                name: "Add trait data to contract",
                traitId: traitId,
                traitName: traits[traitId.toString()].name,
                chunk: k+1,
                chunkLength: chunks.length,
                hash: txReceit.transactionHash,
                gas: txReceit.cumulativeGasUsed.toString(),
            }

            txn++;
        }

        if(chunks.length > 0) {
            console.log();
        }

    }

    console.log("setBytes:       ", setBytes);
    console.log("ignoredBytes:   ", ignoredBytes);
    console.log("totalTxnCount:  ", totalTxnCount);
    console.log("highestTxnCost: ", highestTxnCost);
    

    console.log("gasCost:        ", gasCost.toString())

    // gasCost = ethers.BigNumber.from("577208972");
    const gasPrice = ethers.BigNumber.from("20000000000");

    console.log("    Deployment gasCost in wei: ", gasCost.toString())
    console.log("    Deployment gasPrice:       ", gasPrice.div(10 ** 9).toString(), "GWEI")

    let maxCostWei = gasCost.mul(gasPrice);
    console.log("    Deployment wei * price:    ", ethers.utils.formatEther(maxCostWei), "ETH")

    try {
        fs.writeFileSync('data/v2/deploymentData.json', JSON.stringify(deploymentData));
        //file written successfully
    } catch (err) {
        console.error(err);
    }

    const endBalance = await getBalance(accounts[0].address);
    const diffBalance = initialBalance.sub(endBalance);
    console.log("End Balance:        ", initialBalance.toString() );
    console.log("Diff Balance:       ", diffBalance.toString() );


    console.log("Validate:");
    console.log("npx hardhat verify --network rinkeby --contract contracts/ECRegistryV2.sol:ECRegistryV2 "+ECRegistry.address);
    console.log("npx hardhat verify --network mainnet --contract contracts/ECRegistryV2.sol:ECRegistryV2 "+ECRegistry.address);

    // npx hardhat verify --network rinkeby 0xea66b20905de1777d0dd4c7f91435f726dd26fa1
    // npx hardhat verify --network rinkeby --contract contracts/ECRegistryV2.sol:ECRegistryV2 0xea66b20905de1777d0dd4c7f91435f726dd26fa1

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