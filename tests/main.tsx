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


describe("EC Registry", function () {
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

        before(async () => {

            const ECRegistryArtifacts = await ethers.getContractFactory("ECRegistry");
            ECRegistry = await ECRegistryArtifacts.deploy();
            await ECRegistry.deployed();
            console.log("          - ECRegistry:      ", ECRegistry.address);

            let deployTx = await ECRegistry.provider.getTransactionReceipt(ECRegistry.deployTransaction.hash);
            deploymentGasCost = deployTx.cumulativeGasUsed;
            console.log("          - Gas:             ", deployTx.cumulativeGasUsed.toString());
            txnCount++;
        });

        describe("Validate", function () {

            it("contractController[ZERO_ADDRESS] is false", async function () {
                expect(await ECRegistry.contractController(ZERO_ADDRESS)).to.be.equal(false);
            });

            it("traitCount is 0", async function () {
                expect(await ECRegistry.traitCount()).to.be.equal(0);
            });

        });

        describe("Add initial traits", function () {
            
            let traitCount: number;
            let traitIdToName: TkData;
            before(async () => {

                traitIdToName = await import('../data/traits.json');
                traitCount = Object.keys(traitIdToName).length;
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
    
                let tx = await ECRegistry.addTrait(newTraitCallNames, newTraitCallAddresses);
                let txReceit = await tx.wait();
                console.log("          - Gas:             ", txReceit.cumulativeGasUsed.toString());
            });

            it("traitCount is 63", async function () {
                expect(await ECRegistry.traitCount()).to.be.equal(traitCount - 1);
            });

            it("traits[0] matches first trait in json traitIdToName[0 + traitOffset]", async function () {
                const data = await ECRegistry.traits(0);
                expect(data.name).to.be.equal(traitIdToName[0 + traitOffset]);
                expect(data.implementer).to.be.equal(ZERO_ADDRESS);
            });
            

        });


        
        describe("Add a trait controller", function () {
            let traitId = 33;
            
            describe("setTraitControllerAccess", function () {

                it("reverts if called by non-onlyAllowed", async function () {
                    await data.assertInvalidOpcode(async () => {
                        await ECRegistry.connect(testingAccount1).setTraitControllerAccess(testingAccount1.address, traitId, true);
                    }, "Not Authorised");
                });

                it("changes data if called by onlyAllowed", async function () {
                    expect(await ECRegistry.addressCanModifyTrait(testingAccount1.address, traitId)).to.be.equal(false);
                    await ECRegistry.connect(owner).setTraitControllerAccess(testingAccount1.address, traitId, true);
                    expect(await ECRegistry.addressCanModifyTrait(testingAccount1.address, traitId)).to.be.equal(true);
                });

            });

        });

        describe("Update a trait ( name & implementer )", function () {
            
            let traitId = 0;
            let name = "New Trait Name";

            describe("addressCanModifyTrait(address _addr, uint16 traitID)", function () {

                it("returns false if provided address is not implementer", async function () {
                    expect(await ECRegistry.addressCanModifyTrait(testingAccount1.address, traitId)).to.be.equal(false);
                });

                it("updateTrait", async function () {
                    await ECRegistry.updateTrait(traitId, name, testingAccount1.address);
                });

                it("returns true if provided address is implementer", async function () {
                    expect(await ECRegistry.addressCanModifyTrait(testingAccount1.address, traitId)).to.be.equal(true);
                });

                it("trait name also updates", async function () {
                    const data = await ECRegistry.traits(0);
                    expect(data.name).to.be.equal(name);
                });

            });

        });

        describe("Set token traits", function () {

            describe("setData(uint16[], uint8[][])", function () {

                let traitData: BitArray;

                before(async () => {
                    const data = [
                        0, 0, 0, 0, 0, 0, 0, 0,
                        1, 0, 0, 0, 0, 0, 0, 1,
                        1, 1, 0, 0, 0, 0, 1, 1,
                        1, 1, 1, 0, 0, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1,
                    ];
                    traitData = new BitArray(data.length);
                    traitData.set(data);
                    
                });

                it("reverts if called by non-allowed address", async function () {
                    await data.assertInvalidOpcode(async () => {
                        await ECRegistry.connect(testingAccount2).setData([1], [traitData.toArray()]);
                    }, "Not Authorised");
                });

                it("works if called by authorised address", async function () {
                    await ECRegistry.connect(owner).setData([1], [traitData.toArray()]);
                    const traitDataOne = await ECRegistry.getData(1);
                    const traitValidation = BitArray.fromUint8Array(traitDataOne)
                    expect(traitData.toHexString()).to.be.equal(traitValidation.toHexString());
                });

            });

            describe("setTrait(uint16 traitID, uint16 tokenId, bool _value)", function () {

                let traitData: BitArray;
                let tokenId = 2;
                let traitId = 2;

                before(async () => {
                    traitData = new BitArray(8);
                });

                it("reverts if called by non-allowed address", async function () {
                    await data.assertInvalidOpcode(async () => {
                        await ECRegistry.connect(testingAccount2).setTrait(1, 1, false);
                    }, "Not Authorised");
                });

                it("works if called by authorised address", async function () {
                    const traitDataBefore = await ECRegistry.getData(tokenId);

                    expect(await ECRegistry.hasTrait(tokenId, traitId)).to.be.equal(false);
                    await ECRegistry.connect(owner).setTrait(traitId, tokenId, true);
                    expect(await ECRegistry.hasTrait(tokenId, traitId)).to.be.equal(true);

                    const traitDataAfterReturn = await ECRegistry.getData(tokenId);
                    const traitDataAfter = BitArray.fromUint8Array(traitDataAfterReturn)
                    const traitValidation = BitArray.fromUint8Array(traitDataBefore)
                    
                    traitValidation.on(traitId);
                    expect(traitDataAfter.toHexString()).to.be.equal(traitValidation.toHexString());
                });

                it("base call - with byte allocation - true", async function () {
                    let tx = await ECRegistry.connect(owner).setTrait(3, 3, true);
                    let txReceit = await tx.wait();
                    console.log("            - Gas:             ", txReceit.cumulativeGasUsed.toString());
                });

                it("base call - no byte allocation - false", async function () {
                    let tx = await ECRegistry.connect(owner).setTrait(3, 3, false);
                    let txReceit = await tx.wait();
                    console.log("            - Gas:             ", txReceit.cumulativeGasUsed.toString());
                });
                it("base call - no byte allocation - true", async function () {
                    let tx = await ECRegistry.connect(owner).setTrait(3, 3, true);
                    let txReceit = await tx.wait();
                    console.log("            - Gas:             ", txReceit.cumulativeGasUsed.toString());
                });
            
            });

            describe("setTraitOnMultiple(uint16 traitID, uint16[] tokenIds, bool[] _value)", function () {


                it("10x base call - with byte allocation - true", async function () {
                    let tx = await ECRegistry.connect(owner).setTraitOnMultiple(3, [10,11,12,13,14,15,16,17,18,19], [true,true,true,true,true,true,true,true,true,true]);
                    let txReceit = await tx.wait();
                    console.log("            - Gas:             ", txReceit.cumulativeGasUsed.toString());
                });

                it("10x base call - no byte allocation - false", async function () {
                    let tx = await ECRegistry.connect(owner).setTraitOnMultiple(3, [10,11,12,13,14,15,16,17,18,19], [false,false,false,false,false,false,false,false,false,false]);
                    let txReceit = await tx.wait();
                    console.log("            - Gas:             ", txReceit.cumulativeGasUsed.toString());
                });

                it("10x base call - no byte allocation - true", async function () {
                    let tx = await ECRegistry.connect(owner).setTraitOnMultiple(3, [10,11,12,13,14,15,16,17,18,19], [true,true,true,true,true,true,true,true,true,true]);
                    let txReceit = await tx.wait();
                    console.log("            - Gas:             ", txReceit.cumulativeGasUsed.toString());
                });

            });

        });

    });

});