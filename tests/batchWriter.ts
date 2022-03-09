const { ZERO_ADDRESS, ROLE, Data } = require('./helpers/common');
import "@nomiclabs/hardhat-ethers";
import { ethers } from "hardhat";
import chai from "chai";
import { solidity } from "ethereum-waffle";
chai.use(solidity);
const { expect } = chai;
import { BitArray } from "@ethercards/ec-util";
import { ByteArray } from "@ethercards/ec-util";

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

function callsToRequestData(calls: any) {

    let bytes: string = ""; 
    const header = new ByteArray(Buffer.alloc(2));
    // add call num
    header.writeUnsignedShort(calls.length);
    bytes = header.toString("hex");

    for(let i = 0; i < calls.length; i++) {
        const callLen = callLentoHex(removeZeroX(calls[i][1]).length);
        const address = addresstoCallData(calls[i][0]);
        const callData = removeZeroX(calls[i][1]);
        const packet = callLen + address + callData;

        bytes+= packet;
    }
    return bytes;
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

        before(async () => {

            const ECRegistryArtifacts = await ethers.getContractFactory("ECRegistryV2");
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




            await ECRegistry.connect(owner).setTraitControllerAccessData(BatchWriter.address, [255, 255]);


        });

        describe("Batch Writer", function () {

            it("test", async function () {

                // await ECRegistry.setData( 3, [0, 1], [255, 255] );

                console.log("canUpdate 0", await ECRegistry.addressCanModifyTrait( BatchWriter.address, 0))
                console.log("canUpdate 9", await ECRegistry.addressCanModifyTrait( BatchWriter.address, 9))
                console.log("canUpdate 16", await ECRegistry.addressCanModifyTrait( BatchWriter.address, 16))


                let calls = [];

                calls.push( 
                    [
                        ECRegistry.address,
                        ECRegistry.interface.encodeFunctionData("setData", [ 0, [0, 1], [255, 255] ])
                    ]
                );
                calls.push( 
                    [
                        ECRegistry.address,
                        ECRegistry.interface.encodeFunctionData("setData", [ 1, [0, 1], [255, 255] ])
                    ]
                );

                const bytes = callsToRequestData(calls);
                let reqId = "0x";
                for(let z = 0; z < 32; z++) {
                    reqId+="00";
                }

                let tx = await BatchWriter.fulfillBytes(reqId, "0x"+bytes);
                console.log("tx", await tx.wait());

            });

        });

    });

});