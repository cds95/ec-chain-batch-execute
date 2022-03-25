const { ZERO_ADDRESS, ROLE, Data } = require('./helpers/common');
import "@nomiclabs/hardhat-ethers";
import { ethers } from "hardhat";
import chai from "chai";
import { solidity } from "ethereum-waffle";
chai.use(solidity);
const { expect } = chai;
import { BitArray } from "@ethercards/ec-util";
import { ByteArray } from "@ethercards/ec-util";
import Trait_Mapping from '../data/NFT_Acheivement_Mapping.json';



// make sure to have ethers.js 5.X required, else this will fail!
const BigNumber = ethers.BigNumber;

function removeZeroX(string: string): string {
    return string.replace("0x", "");
}

function addresstoCallData(string: string): string {
    return "000000000000000000000000"+removeZeroX(string);
}

function callLentoHex(number: number): string {
    const data = new ByteArray(Buffer.alloc(2));
    data.writeUnsignedShort(number/2);
    return removeZeroX(data.toString("hex"));
}

function callsToRequestData(calls: any, dataRecordId: number) {

    let bytes: string = ""; 
    const header = new ByteArray(Buffer.alloc(2));
    // add call num
    header.writeUnsignedShort(calls.length);
    // add record id
    header.writeUnsignedInt(dataRecordId);
    bytes = header.toString("hex");

    for(let i = 0; i < calls.length; i++) {
        const callLen = callLentoHex(removeZeroX(calls[i][1]).length);
        const address = addresstoCallData(calls[i][0]);
        const callData = removeZeroX(calls[i][1]);
        const packet = callLen + address + callData;
        bytes+= packet;
    }

    // console.log("bytes", bytes);

    return bytes;
}

function randomIntFromInterval(min: number, max: number): number { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function randomIntFromIntervalExceptUsed(used: any, min: number, max: number): number { // min and max included 
    let res = randomIntFromInterval(min, max);
    if(used.includes(res)) {
        return randomIntFromIntervalExceptUsed(used, min, max);
    } else {
        return res;
    }
}

  

describe("batchWriter", function () {
    let data: any, owner: any, testingAccount1: any, testingAccount2: any;

    before(async () => {

        data = new Data();
        await data.init();

        owner = data.deployerSigner;
        testingAccount1 = data.user1Signer;
        testingAccount2 = data.user2Signer;

    });

    describe("Contract Deployment", function () {
       
        let deploymentGasCost = BigNumber.from(0);
        let txnCount = 0;
        let ECRegistry: any;
        let BatchWriter: any;
        let chainTraits: any;

        before(async () => {

            const ECRegistryArtifacts = await ethers.getContractFactory("ECRegistryV3");
            ECRegistry = await ECRegistryArtifacts.deploy();
            await ECRegistry.deployed();
            console.log("          - ECRegistry:      ", ECRegistry.address);

            let deployTx = await ECRegistry.provider.getTransactionReceipt(ECRegistry.deployTransaction.hash);
            deploymentGasCost = deployTx.cumulativeGasUsed;
            console.log("          - Gas:             ", deployTx.cumulativeGasUsed.toString());
            txnCount++;

            const BatchWriterArtifacts = await ethers.getContractFactory("ChainBatchWriteAdapter");
            BatchWriter = await BatchWriterArtifacts.deploy();
            await BatchWriter.deployed();
            console.log("          - BatchWriter:     ", BatchWriter.address);

            const traits:any = [];
            let traitId = 1;
            Trait_Mapping.forEach((obj: any, index: number) => {
        
                const trait = {
                    id: traitId++,
                    traitType: 0, // bool traits
                    start: 0,
                    end: 0,
                    implementer: "0x0000000000000000000000000000000000000000",
                    name: obj.trigger_title + " - " + obj.trigger_description,
                }
        
                // uint8 traits
                if(obj.tier_2 !== null) {
                    trait.traitType = 3;
                }
                traits.push(trait);
            });

            let tx = await ECRegistry.addTrait(
                traits
            );
            await tx.wait();

            await ECRegistry.connect(owner).setTraitControllerAccessData(BatchWriter.address, [255, 255, 255, 255]);

            chainTraits = await ECRegistry.getTraits();
        });

        describe("Batch Writer", function () {

            // let dataSet: any;
            // before(async () => {
            //     dataSet.push({

            //     });

            // });

            it("test record Id saving", async function () {

                const dataId = 5

                let calls: any = [];
                calls.push( 
                    [
                        ECRegistry.address,
                        ECRegistry.interface.encodeFunctionData("setData", [ 0, [0], [255] ])
                    ]
                );

                let bytes = callsToRequestData(calls, dataId);
                let reqId = "0x";
                for(let z = 0; z < 32; z++) {
                    reqId+="00";
                }

                let tx = await BatchWriter.fulfillBytes(reqId, "0x"+bytes);
                await tx.wait()

                let LastDataRecordId = await BatchWriter.LastDataRecordId();
                expect(LastDataRecordId).to.be.equal(dataId);


                const dataId2 = 321312

                calls = [];
                calls.push( 
                    [
                        ECRegistry.address,
                        ECRegistry.interface.encodeFunctionData("setData", [ 0, [0], [0] ])
                    ]
                );

                bytes = callsToRequestData(calls, dataId2 );
                reqId = "0x";
                for(let z = 0; z < 32; z++) {
                    reqId+="00";
                }

                tx = await BatchWriter.fulfillBytes(reqId, "0x"+bytes);
                await tx.wait()

                LastDataRecordId = await BatchWriter.LastDataRecordId();
                expect(LastDataRecordId).to.be.equal(dataId2);


            });

            it("test", async function () {

                const accounts = await ethers.getSigners();
                const TraitUint8ValueImplementerArtifacts = await ethers.getContractFactory("TraitUint8ValueImplementer");

                let reqId = "0x";
                for(let z = 0; z < 32; z++) {
                    reqId+="00";
                }

                let bytesUpdated = 0;
                let valuesUpdated = 0;

                // await ECRegistry.setData( 3, [0, 1], [255, 255] );

                // console.log("canUpdate 0", await ECRegistry.addressCanModifyTrait( BatchWriter.address, 0))
                // console.log("canUpdate 9", await ECRegistry.addressCanModifyTrait( BatchWriter.address, 9))
                // console.log("canUpdate 16", await ECRegistry.addressCanModifyTrait( BatchWriter.address, 16))


                let calls = [];

                for(let i = 0; i < chainTraits.length; i++) {

                    let trait = chainTraits[i];
                    let resultingCall: any;

                    console.log("trait.traitType", trait.id, trait.traitType, trait.name);

                    if(trait.traitType === 0) {
                        // Data in ECRegistry is stored in a BitMap which means we need
                        // to load existing data, check for differences and only update the
                        // new key uint8's that have been changed

                        // Load existing trait data from chain
                        const chainData = await ECRegistry.getData(trait.id, 0, 320);

                        // Convert to bit array
                        const updatedTraitData = BitArray.fromUint8Array(chainData);

                        // Update positions that are marked true / false

                        // random testing
                        // const used: any = [];
                        // for(let y = 0; y < 10; y++) {
                        //     const tokenId = randomIntFromIntervalExceptUsed(used, 1, 320);
                        //     used.push(tokenId);

                        //     const boolVal = randomIntFromInterval(0, 1);
                        //     if(boolVal === 1) {
                        //         updatedTraitData.on(tokenId);
                        //     } else {
                        //         updatedTraitData.off(tokenId);
                        //     }
                        // }

                        // maximize used storage by making sure no id ends up in the same slot
                        // and all values are true
                        for(let y = 0; y < 10; y++) {
                            // random testing
                            // const tokenId = randomIntFromIntervalExceptUsed(used, 1, 320);

                            const tokenId = (y + 1) * 8;
                            updatedTraitData.on(tokenId);
                        }


                        // Find only the differences between original and new data
                        const updatedTraitArray = updatedTraitData.toArray();
                        
                        const newDataIndexes: number[] = [];
                        const newDataValues: number[] = [];

                        for(let z = 0; z < updatedTraitArray.length; z++) {
                            if(chainData[z] !== updatedTraitArray[z]) {
                                newDataIndexes.push(z);
                                newDataValues.push(updatedTraitArray[z]);

                                bytesUpdated++;
                            }
                        }

                        // console.log("newDataIndexes", newDataIndexes);
                        // console.log("newDataValues ", newDataValues);

                        resultingCall = [
                            ECRegistry.address,
                            ECRegistry.interface.encodeFunctionData("setData", [ trait.id, newDataIndexes, newDataValues ])
                        ];
                    } else if(trait.traitType === 3) {
                        // Data is uint8, no need to load existing data, just update new values

                        const newDataIndexes: number[] = [];
                        const newDataValues: number[] = [];

                        const used: any = [];
                        for(let y = 0; y < 10; y++) {
                            const tokenId = randomIntFromIntervalExceptUsed(used, 1, 320);
                            used.push(tokenId);

                            const uint8Val = randomIntFromInterval(1, 10);
                            newDataIndexes.push(tokenId);
                            newDataValues.push(uint8Val);
                            
                            bytesUpdated++;
                        }

                        // console.log("newDataIndexes", newDataIndexes);
                        // console.log("newDataValues ", newDataValues);

                        const implementer = new ethers.Contract(trait.implementer, TraitUint8ValueImplementerArtifacts.interface, accounts[0])

                        resultingCall = [
                            implementer.address,
                            implementer.interface.encodeFunctionData("setData", [ newDataIndexes, newDataValues ])
                        ];

                    }

                    calls.push( 
                        resultingCall
                    );

                    const gasCostEstimate = await BatchWriter.estimateGas.fulfillBytes(reqId, "0x"+callsToRequestData(calls, 123));
                    console.log("  - bytesUpdated", bytesUpdated, " / gasEstimate:", gasCostEstimate.toNumber());
                }

                const bytes = callsToRequestData(calls, 123);

                let tx = await BatchWriter.fulfillBytes(reqId, "0x"+bytes);
                let txReceit = await tx.wait();
                console.log("");
                console.log("            - bytesUpdated     ", bytesUpdated);
                console.log("            - Gas:             ", txReceit.cumulativeGasUsed.toString());

            });

        });

    });

});