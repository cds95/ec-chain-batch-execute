const { ZERO_ADDRESS, ROLE, Data } = require('./helpers/common');
import "@nomiclabs/hardhat-ethers";
import { ethers } from "hardhat";
import chai from "chai";
import { solidity } from "ethereum-waffle";
chai.use(solidity);
const { expect } = chai;
import { BitArray } from "@ethercards/ec-util";
// make sure to have ethers.js 5.X required, else this will fail!
const BigNumber = ethers.BigNumber;

const { getNewTraitsObject, traitSetup, getTraitIdByName, getTraitNameById, traitIdOffset } = require("../scripts/traitsV2/_traitMap.js");
import BitArrayTraitData from "../data/v2/BitArrayTokenData.json";


interface TkData {
    [key: string]: any
}

const traitOffset = 101;


describe("EC Registry V2", function () {
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

            const ECRegistryArtifacts = await ethers.getContractFactory("ECRegistryV2");
            ECRegistry = await ECRegistryArtifacts.deploy();
            await ECRegistry.deployed();
            console.log("          - ECRegistry:      ", ECRegistry.address);

            let deployTx = await ECRegistry.provider.getTransactionReceipt(ECRegistry.deployTransaction.hash);
            deploymentGasCost = deployTx.cumulativeGasUsed;
            console.log("          - Gas:             ", deployTx.cumulativeGasUsed.toString());
            txnCount++;
        });

        describe("Validate", function () {

            it("getContractControllerLength() is 0", async function () {
                expect(await ECRegistry.getContractControllerLength()).to.be.equal(0);
            });

            it("getContractControllerContains(ZERO_ADDRESS) is false", async function () {
                expect(await ECRegistry.getContractControllerContains(ZERO_ADDRESS)).to.be.equal(false);
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
                const newTraitType: any = [];
                const newTraitStart: any = [];
                const newTraitEnd: any = [];

                Object.keys(traitIdToName).forEach((key: string, index: number) => {
                    if(key.toString() !== "default") {
                        newTraitCallNames.push(traitIdToName[key.toString()]);
                        newTraitCallAddresses.push(ZERO_ADDRESS);
                        newTraitType.push(0);
                        newTraitStart.push(0);
                        newTraitEnd.push(0);
                    }
                })
    
                let tx = await ECRegistry.addTrait(newTraitCallNames, newTraitCallAddresses, newTraitType, newTraitStart, newTraitEnd);
                let txReceit = await tx.wait();
                console.log("          - Gas:             ", txReceit.cumulativeGasUsed.toString());
            });

            it("traitCount is 62", async function () {
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

                it("allows trait changes for address if set to true", async function () {
                    expect(await ECRegistry.addressCanModifyTrait(testingAccount1.address, traitId)).to.be.equal(false);
                    await ECRegistry.connect(owner).setTraitControllerAccess(testingAccount1.address, traitId, true);
                    expect(await ECRegistry.addressCanModifyTrait(testingAccount1.address, traitId)).to.be.equal(true);
                });

                it("disallows trait changes for address if set to false", async function () {
                    expect(await ECRegistry.addressCanModifyTrait(testingAccount1.address, traitId)).to.be.equal(true);
                    await ECRegistry.connect(owner).setTraitControllerAccess(testingAccount1.address, traitId, false);
                    expect(await ECRegistry.addressCanModifyTrait(testingAccount1.address, traitId)).to.be.equal(false);
                });

                it("disallows trait changes for address if it can change other traits but not selected", async function () {
                    // 4x8 => 32 traits
                    await ECRegistry.connect(owner).setTraitControllerAccessData(testingAccount1.address, [255,255,255,255]);
                    expect(await ECRegistry.addressCanModifyTrait(testingAccount1.address, 30)).to.be.equal(true);
                    await ECRegistry.connect(owner).setTraitControllerAccess(testingAccount1.address, 30, false);
                    expect(await ECRegistry.addressCanModifyTrait(testingAccount1.address, 30)).to.be.equal(false);
                    expect(await ECRegistry.addressCanModifyTrait(testingAccount1.address, 29)).to.be.equal(true);
                    expect(await ECRegistry.addressCanModifyTrait(testingAccount1.address, 31)).to.be.equal(true);
                });

            });

        });

        describe("Update a trait ( name & implementer )", function () {
            
            let traitId = 0;
            let name = "New Trait Name";

            describe("addressCanModifyTrait(address _addr, uint16 traitID)", function () {

                it("returns false if provided address is not implementer", async function () {
                    expect(await ECRegistry.addressCanModifyTrait(testingAccount2.address, traitId)).to.be.equal(false);
                });

                it("updateTrait", async function () {
                    await ECRegistry.updateTrait(traitId, name, testingAccount2.address, 0, 0, 0);
                });

                it("returns true if provided address is implementer", async function () {
                    expect(await ECRegistry.addressCanModifyTrait(testingAccount2.address, traitId)).to.be.equal(true);
                });

                it("trait name also updates", async function () {
                    const data = await ECRegistry.traits(0);
                    expect(data.name).to.be.equal(name);
                });

            });

        });

        describe("Set token traits", function () {

            describe("setData(uint8, uint16[], uint8[])", function () {

                let traitData: BitArray;
                let traitValues: any = [];
                let traitIndexes: any = [];

                before(async () => {
                    const data = [
                        0, 0, 0, 0, 0, 0, 0, 0,
                        1, 0, 0, 0, 0, 0, 0, 1,
                        1, 1, 0, 0, 0, 0, 1, 1,
                        1, 1, 1, 0, 0, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 0,
                    ];
                    traitData = new BitArray(data.length);
                    traitData.set(data);
                    
                    traitValues = traitData.toArray();
                    for(let i = 0; i < traitValues.length; i++) {
                        traitIndexes.push(i);
                    }

                });

                it("reverts if called by non-allowed address", async function () {
                    await data.assertInvalidOpcode(async () => {
                        await ECRegistry.connect(testingAccount2).setData(0, traitIndexes, traitValues);
                    }, "Not Authorised");
                });

                it("works if called by authorised address", async function () {
                    await ECRegistry.connect(owner).setData(0, traitIndexes, traitValues);

                    const chaintraitValues = await ECRegistry.getData(0, 0, 5);
                    const traitValidation = BitArray.fromUint8Array(chaintraitValues)
                    expect(traitValidation.toHexString()).to.be.equal(traitData.toHexString());
                });

            });

            describe("setTrait(uint8 traitID, uint16 tokenId, bool _value)", function () {

                let traitData: BitArray;
                let tokenId = 2;
                let traitId = 2;

                before(async () => {
                    // traitData = new BitArray(8);
                });

                it("reverts if called by non-allowed address", async function () {
                    await data.assertInvalidOpcode(async () => {
                        await ECRegistry.connect(testingAccount2).setTrait(1, 1, false);
                    }, "Not Authorised");
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

            describe("addTrait(string[] calldata _name, address[] calldata _implementer, bool[] calldata _inverted)", function () {

                describe("Adding a trait to a token", function () {

                    let initialCount: any, endCount: any, newtraitId: any;

                    before(async () => {

                        initialCount = await ECRegistry.traitCount();
                        await ECRegistry.connect(owner).addTrait(["New TestTrait"], ["0x0000000000000000000000000000000000000002"], [0], [0], [0]);
                        endCount = await ECRegistry.traitCount();
                        newtraitId = endCount-1;
                    });

                    it("traitCount increases by 1", async function () {
                        expect(initialCount + 1).to.be.equal(endCount);
                    });

                    it("new trait properties match", async function () {
                        const trait = await ECRegistry.traits(endCount-1);
                        expect(trait.name).to.be.equal("New TestTrait");
                        expect(trait.implementer).to.be.equal("0x0000000000000000000000000000000000000002");
                        expect(trait.traitType).to.be.equal(0);
                    });

                    it("hasTrait(uint16, 0) returns false", async function () {
                        expect(await ECRegistry.hasTrait(newtraitId, 0)).to.be.equal(false);
                    });

                    it("hasTrait(uint16, 65535) returns false", async function () {
                        expect(await ECRegistry.hasTrait(newtraitId, 65535)).to.be.equal(false);
                    });

                    it("hasTrait(uint16, 1) returns false ( since it was never set )", async function () {
                        expect(await ECRegistry.hasTrait(newtraitId, 1)).to.be.equal(false);
                    });

                    it("inverting trait works", async function () {
                        await ECRegistry.updateTrait(newtraitId, "New TestTrait", "0x0000000000000000000000000000000000000002", 1, 0, 0);
                    });

                    it("hasTrait(uint16, 0) returns true", async function () {
                        expect(await ECRegistry.hasTrait(newtraitId, 0)).to.be.equal(true);
                    });

                    it("hasTrait(uint16, 65535) returns true", async function () {
                        expect(await ECRegistry.hasTrait(newtraitId, 65535)).to.be.equal(true);
                    });

                    it("hasTrait(uint16, 1) returns true ( since it was never set )", async function () {
                        expect(await ECRegistry.hasTrait(newtraitId, 1)).to.be.equal(true);
                    });

                    it("changing value to true 0 / false 65535", async function () {
                        await ECRegistry.connect(owner).setTrait(newtraitId, 0, true);
                        await ECRegistry.connect(owner).setTrait(newtraitId, 65535, false);
                    });

                    it("hasTrait(uint16, 0) returns true", async function () {
                        expect(await ECRegistry.hasTrait(newtraitId, 0)).to.be.equal(true);
                    });

                    it("hasTrait(uint16, 65535) returns false", async function () {
                        expect(await ECRegistry.hasTrait(newtraitId, 65535)).to.be.equal(false);
                    });

                    it("then inverting trait preserves values for tokens with set value ( but inverted )", async function () {
                        await ECRegistry.updateTrait(newtraitId, "New TestTrait", "0x0000000000000000000000000000000000000002", 0, 0, 0);
                    });

                    it("hasTrait(uint16, 0) returns false", async function () {
                        expect(await ECRegistry.hasTrait(newtraitId, 0)).to.be.equal(false);
                    });

                    it("hasTrait(uint16, 65535) returns true", async function () {
                        expect(await ECRegistry.hasTrait(newtraitId, 65535)).to.be.equal(true);
                    });  

                    it("hasTrait(uint16, 1) returns false ( since it was never set )", async function () {
                        expect(await ECRegistry.hasTrait(newtraitId, 1)).to.be.equal(false);
                    });

                });

            });

            describe("getTokenData(uint16 tokenId)", function () {
                
                let traitData: BitArray;
                let tokenId = 100;
                let newtraitId: any, endCount:any;

                before(async () => {
                    const ECRegistryArtifacts = await ethers.getContractFactory("ECRegistryV2");
                    ECRegistry = await ECRegistryArtifacts.deploy();
                    await ECRegistry.deployed();
                    // console.log("          - ECRegistry:      ", ECRegistry.address);

                    await ECRegistry.connect(owner).addTrait(["New TestTrait"], ["0x0000000000000000000000000000000000000001"], [0], [0], [0]);
                    endCount = await ECRegistry.traitCount();
                    newtraitId = endCount - 1;
                });

                it("1 trait - message length is 8", async function () {
                    let tokenData = await ECRegistry.getTokenData(tokenId);
                    let traitValidation = BitArray.fromUint8Array(tokenData);
                    expect(traitValidation.toBinaryString().length).to.be.greaterThanOrEqual(endCount);
                    expect(traitValidation.toBinaryString().length).to.be.equal(8);
                });

                it("8 traits - message length is 8", async function () {
                    await ECRegistry.connect(owner).addTrait([
                        "New TestTrait 2",
                        "New TestTrait 3",
                        "New TestTrait 4",
                        "New TestTrait 5",
                        "New TestTrait 6",
                        "New TestTrait 7",
                        "New TestTrait 8",
                    ], [
                        "0x0000000000000000000000000000000000000002",
                        "0x0000000000000000000000000000000000000003",
                        "0x0000000000000000000000000000000000000004",
                        "0x0000000000000000000000000000000000000005",
                        "0x0000000000000000000000000000000000000006",
                        "0x0000000000000000000000000000000000000007",
                        "0x0000000000000000000000000000000000000008",
                    ], 
                    [0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0]
                    );

                    let tokenData = await ECRegistry.getTokenData(tokenId);
                    let traitValidation = BitArray.fromUint8Array(tokenData);
                    expect(traitValidation.toBinaryString().length).to.be.greaterThanOrEqual(endCount);
                    expect(traitValidation.toBinaryString().length).to.be.equal(8);
                });

                it("9 traits - message length is 16", async function () {
                    await ECRegistry.connect(owner).addTrait(["New TestTrait 9"], ["0x0000000000000000000000000000000000000009"], [0], [0], [0]);
                    let tokenData = await ECRegistry.getTokenData(tokenId);
                    let traitValidation = BitArray.fromUint8Array(tokenData);
                    expect(traitValidation.toBinaryString().length).to.be.greaterThanOrEqual(endCount);
                    expect(traitValidation.toBinaryString().replace(" ", "").length).to.be.equal(16);
                });

            });

            describe("getData(uint16 traitId, uint8 _page, uint16 _perPage) ", function () {

                let traitData: BitArray;
                let tokenId = 100;
                let newtraitId: any, endCount:any;

                before(async () => {
                    endCount = await ECRegistry.traitCount();
                    newtraitId = endCount - 1;
                });

                it("returned number of uint8 bytes matches _perPage parameter", async function () {
                    const _perPage = 8;
                    const chaintraitValues = await ECRegistry.getData(newtraitId, 0, _perPage);
                    expect(chaintraitValues.length).to.be.equal(_perPage);
                });

                it("setting trait true for token 0 is reflected in getData", async function () {
                    let thisTokenId = 0;
                    await ECRegistry.connect(owner).setTrait(newtraitId, thisTokenId, true);
                    const chaintraitValues = await ECRegistry.getData(newtraitId, 0, 8);
                    const traitValidation = BitArray.fromUint8Array(chaintraitValues);
                    expect(traitValidation.get(thisTokenId)).to.be.equal(true);
                });

                it("setting trait true for token 8 is reflected in getData", async function () {
                    let thisTokenId = 8;
                    await ECRegistry.connect(owner).setTrait(newtraitId, thisTokenId, true);
                    const chaintraitValues = await ECRegistry.getData(newtraitId, 0, 8);
                    const traitValidation = BitArray.fromUint8Array(chaintraitValues);
                    expect(traitValidation.get(thisTokenId)).to.be.equal(true);
                });

            });

            describe("ranged trait 10-5000 - hasTrait(uint16, 0) ", function () {
                let tokenId = 100;
                let newtraitId: any;
                let endCount:any;
                let traitStart:any;
                let traitEnd:any;

                before(async () => {
                    await ECRegistry.connect(owner).addTrait(["Ranged Trait"], ["0x0000000000000000000000000000000000000009"], [2], [10], [5000]);
                    endCount = await ECRegistry.traitCount();
                    newtraitId = endCount - 1;
                });

                it("before range - hasTrait(uint16, 9) returns false", async function () {
                    expect(await ECRegistry.hasTrait(newtraitId, 9)).to.be.equal(false);
                });

                it("after range end - hasTrait(uint16, 5001) returns false", async function () {
                    expect(await ECRegistry.hasTrait(newtraitId, 5001)).to.be.equal(false);
                });

                it("at range start - hasTrait(uint16, 10) returns true", async function () {
                    expect(await ECRegistry.hasTrait(newtraitId, 10)).to.be.equal(true);
                });

                it("at range end - hasTrait(uint16, 5000) returns true", async function () {
                    expect(await ECRegistry.hasTrait(newtraitId, 5000)).to.be.equal(true);
                });


                it("hasTrait(uint16, 100) - default - returns true", async function () {
                    expect(await ECRegistry.hasTrait(newtraitId, tokenId)).to.be.equal(true);
                });

                it("set trait to false ( consume it on token 100 )", async function () {
                    let tx = await ECRegistry.connect(owner).setTrait(newtraitId, tokenId, false);
                });

                it("hasTrait(uint16, 100) - set to false - returns false", async function () {
                    expect(await ECRegistry.hasTrait(newtraitId, tokenId)).to.be.equal(false);
                });

                it("set trait to true ( reset it on token 100 )", async function () {
                    let tx = await ECRegistry.connect(owner).setTrait(newtraitId, tokenId, true);
                });

                it("hasTrait(uint16, 100) - set to true - returns true", async function () {
                    expect(await ECRegistry.hasTrait(newtraitId, tokenId)).to.be.equal(true);
                });
            });



            describe.skip("getTokenData on actual data", function () {
                
                let traitData: BitArray;
                let tokenId = 9998;
                let newtraitId: any, endCount:any;

                const newTraitCallNames: any = [];
                const newTraitCallAddresses: any = [];
                const newTraitType: any = [];
                const newTraitStart: any = [];
                const newTraitEnd: any = [];

                before(async () => {
                    const ECRegistryArtifacts = await ethers.getContractFactory("ECRegistryV2");
                    ECRegistry = await ECRegistryArtifacts.deploy();
                    await ECRegistry.deployed();
                    // console.log("          - ECRegistry:      ", ECRegistry.address);

                    const traits = getNewTraitsObject();

                    Object.keys(traits).forEach((key: string, index: number) => {
                        if(key.toString() !== "default") {
                
                            const traitName = traits[key.toString()].name;

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
                    await tx2.wait();


                    const idsPerTxn = 350;

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
                            }
                        })
                
                        calls.push({ id: traitId, data: traitCalls });
                    });
                
                    let txn: number = 0;
                    let cost: number = 0;
                    let highestTxnCost: number = 0;
                    for(let i = 0; i < calls.length; i++) {
                        const traitArray = calls[i];
                        const traitId = traitArray.id;
                        const traitCalls = traitArray.data;
                        const chunks = data.chunk(traitCalls, idsPerTxn);
                
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
                
                            cost = txReceit.cumulativeGasUsed.toNumber();
                            if(highestTxnCost < cost) {
                                highestTxnCost = cost;
                            }
                            // console.log("txn:", txn, "traitId:", traitId, "chunk", k+1, "of", chunks.length, "gas:", cost, txReceit.transactionHash);
                            

                            txn++;
                        }



                
                    }

                    endCount = await ECRegistry.traitCount();
                    newtraitId = endCount - 1;
                });

                it("1 trait - message length is 8", async function () {
                    let tokenData = await ECRegistry.getTokenData(tokenId);
                    let traitValidation = BitArray.fromUint8Array(tokenData);
                    console.log(traitValidation.toBinaryString().length, traitValidation.toBinaryString())
                    expect(traitValidation.toBinaryString().length).to.be.greaterThanOrEqual(endCount);
                    // expect(traitValidation.toBinaryString().length).to.be.equal(8);
                });

            });

        });

    });

});