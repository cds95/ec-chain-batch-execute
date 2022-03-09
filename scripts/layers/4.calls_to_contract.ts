const { ZERO_ADDRESS, ROLE, Data } = require('../../tests/helpers/common');
import "@nomiclabs/hardhat-ethers";
import { ethers } from "hardhat";

import LayerDataCalls from "../../data/LayerDataCalls.json";

async function main() {

    let gasCost = ethers.BigNumber.from(0);

    const data = new Data();
    // await data.init();

    const accounts = await ethers.getSigners();
    console.log("Deployer", accounts[0].address);

    let traitID = 0;

    // 0x26af8a1438308c52ec02b52feefff9236248913a

    const ECRegistryArtifacts = await ethers.getContractFactory("ECRegistry");
    const AccidentalCollaborationArtifacts = await ethers.getContractFactory("AccidentalCollaboration");

    const ECDeployedInstance = await ECRegistryArtifacts.deploy();
    await ECDeployedInstance.deployed();
    let tx = await ECDeployedInstance.provider.getTransactionReceipt(ECDeployedInstance.deployTransaction.hash);

    // const ECRegistry = new ethers.Contract("0x26af8a1438308c52ec02b52feefff9236248913a", ECRegistryArtifacts.interface, accounts[0]);
    const ECRegistry = new ethers.Contract(ECDeployedInstance.address, ECRegistryArtifacts.interface, accounts[0]);
    
    console.log("ECRegistry deployed");

    const AccidentalCollaborationdeployedInstance = await AccidentalCollaborationArtifacts.deploy(
        ECRegistry.address,
        traitID
    );

    await AccidentalCollaborationdeployedInstance.deployed();
    tx = await AccidentalCollaborationdeployedInstance.provider.getTransactionReceipt(AccidentalCollaborationdeployedInstance.deployTransaction.hash);
    const ACTrait = new ethers.Contract(AccidentalCollaborationdeployedInstance.address, AccidentalCollaborationArtifacts.interface, accounts[0]);

    console.log("ACTrait deployed");

    // add the trait into registry and set implementer access
    await ECRegistry.updateTrait(0, "Accidental Collaboration", AccidentalCollaborationdeployedInstance.address );

    // allow our deployer to add data into Trait Contract
    // await ECRegistry.setTraitControllerAccess(accounts[0].address, traitID, true);
    // no need.. already owner
    
    console.log("setTraitControllerAccess");


    const idsPerTxn = 120;
    const chunks = data.chunk(LayerDataCalls, idsPerTxn);

    console.log("chunks: ", chunks.length);

    for (let i = 0; i < chunks.length; i++) {

        const idsArray: any = [];
        const dataArray: any = [];

        for (let j = 0; j < chunks[i].length; j++) {
            idsArray.push(chunks[i][j].id);
            dataArray.push(chunks[i][j].data);
            console.log(chunks[i][j].id, chunks[i][j].data.length)
        };

        console.log(idsArray.length, dataArray);

        const prep = ACTrait.interface.encodeFunctionData("setData(uint16[] memory _tokenIds, uint8[][] memory _value)", [idsArray, dataArray]);
        console.log(prep);

        const tx = await ACTrait.setData(idsArray, dataArray);
        let txReceit = await tx.wait();
        gasCost = gasCost.add(txReceit.cumulativeGasUsed);

        console.log(i, txReceit.cumulativeGasUsed.toString());
    }

    console.log("gasCost:", gasCost.toString());

    // gasCost = ethers.BigNumber.from("577208972");
    const gasPrice = ethers.BigNumber.from("2000000000");

    console.log("    Deployment gasCost in wei: ", gasCost.toString());
    console.log("    Deployment gasPrice:       ", gasPrice.div(10 ** 9).toString(), "GWEI");

    let maxCostWei = gasCost.mul(gasPrice);
    console.log("    Deployment wei * price:    ", ethers.utils.formatEther(maxCostWei), "ETH");

    // npx hardhat verify --network rinkeby 0x0c994c9f733c854a83e90711510b80ea0afe4024


}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });