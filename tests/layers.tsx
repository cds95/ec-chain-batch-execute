const { ZERO_ADDRESS, ROLE, Data } = require('./helpers/common');
import "@nomiclabs/hardhat-ethers";
import { ethers } from "hardhat";
import chai from "chai";
import { solidity } from "ethereum-waffle";
chai.use(solidity);
const { expect } = chai;
import BitArray from "./helpers/BitArray";
// make sure to have ethers.js 5.X required, else this will fail!
const BigNumber = ethers.BigNumber;

interface TkData {
    [key: string]: any
}

const traitOffset = 100;


describe("Layers", function () {
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
        let traitID = 0;
        let ECRegistry: any, ACTrait: any;

        before(async () => {

            const ECRegistryArtifacts = await ethers.getContractFactory("ECRegistry");
            ECRegistry = await ECRegistryArtifacts.deploy();
            await ECRegistry.deployed();
            console.log("          - ECRegistry:      ", ECRegistry.address);

            let deployTx = await ECRegistry.provider.getTransactionReceipt(ECRegistry.deployTransaction.hash);
            deploymentGasCost = deployTx.cumulativeGasUsed;
            console.log("          - Gas:             ", deployTx.cumulativeGasUsed.toString());
            txnCount++;

            const AccidentalCollaborationArtifacts = await ethers.getContractFactory("AccidentalCollaboration");
            ACTrait = await AccidentalCollaborationArtifacts.deploy(
                ECRegistry.address,
                traitID
            );

            await ECRegistry.addTrait(["AccidentalCollaboration"], [ACTrait.address]);


        });

        describe("Validate Trait access", function () {

            it("traitCount is 1", async function () {
                expect(await ECRegistry.traitCount()).to.be.equal(1);
            });

            it("returns true if provided address is implementer", async function () {
                expect(await ECRegistry.addressCanModifyTrait(ACTrait.address, traitID)).to.be.equal(true);
            });

        });

        describe("setData()", function () {

            it("Gas usage:", async function () {

                let tx = await ACTrait.setData([1], [[3]]);
                let txReceit = await tx.wait();
                console.log("            - Gas:             ", txReceit.cumulativeGasUsed.toString());

            });

        });

        describe("setData2()", function () {

            it("Gas usage:", async function () {

                let tx = await ACTrait.setData2([2], [[3]]);
                let txReceit = await tx.wait();
                console.log("            - Gas:             ", txReceit.cumulativeGasUsed.toString());

            });

        });

        describe("setValue()", function () {

            it("Gas usage:", async function () {

                let tx = await ACTrait.setValue(11, [3]);
                let txReceit = await tx.wait();
                console.log("            - Gas:             ", txReceit.cumulativeGasUsed.toString());

            });

        });

        describe("setValue2()", function () {

            it("Gas usage:", async function () {

                let tx = await ACTrait.setValue2(12, [3]);
                let txReceit = await tx.wait();
                console.log("            - Gas:             ", txReceit.cumulativeGasUsed.toString());

            });

        });


        describe("setValue3()", function () {

            it("Gas usage:", async function () {

                let tx = await ACTrait.setValue3(13, [3]);
                let txReceit = await tx.wait();
                console.log("            - Gas:             ", txReceit.cumulativeGasUsed.toString());

            });

        });

    });

    describe("Contract Deployment V2", function () {
       
        let deploymentGasCost = BigNumber.from(0);
        let txnCount = 0;
        let traitID = 0;
        let ECRegistry: any, ACTrait: any;

        before(async () => {

            const ECRegistryArtifacts = await ethers.getContractFactory("ECRegistry");
            ECRegistry = await ECRegistryArtifacts.deploy();
            await ECRegistry.deployed();
            console.log("          - ECRegistry:      ", ECRegistry.address);

            let deployTx = await ECRegistry.provider.getTransactionReceipt(ECRegistry.deployTransaction.hash);
            deploymentGasCost = deployTx.cumulativeGasUsed;
            console.log("          - Gas:             ", deployTx.cumulativeGasUsed.toString());
            txnCount++;

            const AccidentalCollaborationArtifacts = await ethers.getContractFactory("AccidentalCollaborationV2");
            ACTrait = await AccidentalCollaborationArtifacts.deploy(
                ECRegistry.address,
                traitID
            );

            await ECRegistry.addTrait(["AccidentalCollaboration"], [ACTrait.address]);


        });

        describe("Validate Trait access", function () {

            it("traitCount is 1", async function () {
                expect(await ECRegistry.traitCount()).to.be.equal(1);
            });

            it("returns true if provided address is implementer", async function () {
                expect(await ECRegistry.addressCanModifyTrait(ACTrait.address, traitID)).to.be.equal(true);
            });

        });

        describe("setData()", function () {

            it("Gas usage:", async function () {

                let tx = await ACTrait.setData([1], [[3]]);
                let txReceit = await tx.wait();
                console.log("            - Gas:             ", txReceit.cumulativeGasUsed.toString());

            });

        });

        describe("setData2()", function () {

            it("Gas usage:", async function () {

                let tx = await ACTrait.setData2([2], [[3]]);
                let txReceit = await tx.wait();
                console.log("            - Gas:             ", txReceit.cumulativeGasUsed.toString());

            });

        });

        describe("setValue()", function () {

            it("Gas usage:", async function () {

                let tx = await ACTrait.setValue(11, [3]);
                let txReceit = await tx.wait();
                console.log("            - Gas:             ", txReceit.cumulativeGasUsed.toString());

            });

        });

        describe("setValue2()", function () {

            it("Gas usage:", async function () {

                let tx = await ACTrait.setValue2(12, [3]);
                let txReceit = await tx.wait();
                console.log("            - Gas:             ", txReceit.cumulativeGasUsed.toString());

            });

        });


        describe("setValue3()", function () {

            it("Gas usage:", async function () {

                let tx = await ACTrait.setValue3(13, [3]);
                let txReceit = await tx.wait();
                console.log("            - Gas:             ", txReceit.cumulativeGasUsed.toString());

            });

        });

        describe("setValue4()", function () {

            it("Gas usage:", async function () {

                let tx = await ACTrait.setValue4(14, [3]);
                let txReceit = await tx.wait();
                console.log("            - Gas:             ", txReceit.cumulativeGasUsed.toString());

            });

        });

    });


});