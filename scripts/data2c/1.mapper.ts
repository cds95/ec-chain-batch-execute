const fs = require('fs');
const { ZERO_ADDRESS, ROLE, Data } = require('../../tests/helpers/common');
import "@nomiclabs/hardhat-ethers";
import { ethers } from "hardhat";
import BitArray from "../../tests/helpers/BitArray";
const BigNumber = ethers.BigNumber;

import JTeam_Mapping from '../../data/NFT_Team_Mapping.json';
import JPlayer_Mapping from '../../data/NFT_Player_Mapping.json';
import Trait_Mapping from '../../data/NFT_Acheivement_Mapping.json';
import { expect } from "chai";

function getNewTeamID(teams: any, real_id: number): number {

    for(let i = 0; i < teams.length; i++) {
        if(teams[i].real_id === real_id) {
            return teams[i].id;
        }
    }
    return -1;
}

async function main() {

    const accounts = await ethers.getSigners();
    console.log("    Deployer                   ", accounts[0].address);

    const teams: any = [];
    const players: any = [];

    let teamId = 1;
    JTeam_Mapping.forEach((obj: any, index: number) => {
        teams.push({
            id:        teamId++,
            name:      obj.team_name,
            city:      obj.team_city,
            tricode:   obj.team_tricode,
            real_id:   obj.team_id,
        });
    });

    let playerId = 1;
    JPlayer_Mapping.forEach((obj: any, index: number) => {
        players.push({
            id:             playerId++,
            team_id:        getNewTeamID(teams, obj.team_id),
            real_id:        obj.player_id,
            real_team_id:   obj.team_id,
            full_name:      obj.full_name,
        });
    });


    const Artifacts = await ethers.getContractFactory("ECRegistryMap");

    const deployedInstance = await Artifacts.deploy();
    await deployedInstance.deployed();
    console.log("    Part 1 - Player and Team Mappings");

    let tx: any = await deployedInstance.provider.getTransactionReceipt(deployedInstance.deployTransaction.hash);
    console.log("    Deployment hash:           ", deployedInstance.deployTransaction.hash)
    console.log("    Deployment address:        ", deployedInstance.address)

    const ECRegistryMap = new ethers.Contract(deployedInstance.address, Artifacts.interface, accounts[0]);
    
    console.log("");
    console.log("    Validate:");
    console.log("      npx hardhat verify --network matic --contract contracts/ECRegistryMap.sol:ECRegistryMap "+ECRegistryMap.address);

    console.log("    Add Mapping Data ");

    tx = await ECRegistryMap.addTeam(
        teams
    );
    console.log("      Teams ");
    await tx.wait();


    const perChunk = 100;
    const chunks = [];
    let ci = 0;
    let chunk = [];
    for(let i = 0; i < players.length; i++) {
        chunk.push(players[i]);
        ci++;
        if(ci === perChunk) {
            chunks.push(chunk);
            chunk = [];
            ci = 0;
        }
    }

    if(ci > 0) {
        chunks.push(chunk);
    }

    console.log("      Players - txns", chunks.length);

    for(let i = 0; i < chunks.length; i++) {
        console.log("      - chunks[i]", i, chunks[i].length);
        tx = await ECRegistryMap.addPlayer(
            chunks[i]
        );
        await tx.wait();
    }

    // validate mapping
   
    const inContractPlayers = await ECRegistryMap.getPlayers();
    for(let i = 0; i < inContractPlayers.length; i++) {
        // console.log("inContractPlayers", i, inContractPlayers[i]);
        expect(inContractPlayers[i].id).to.equal(players[i].id);
        expect(inContractPlayers[i].team_id).to.equal(players[i].team_id);
        expect(inContractPlayers[i].real_id).to.equal(players[i].real_id);
        expect(inContractPlayers[i].real_team_id).to.equal(players[i].real_team_id);
        expect(inContractPlayers[i].full_name).to.equal(players[i].full_name);
    }

    const inContractTeams = await ECRegistryMap.getTeams();
    for(let i = 0; i < inContractTeams.length; i++) {
        // console.log("inContractTeams", i, inContractTeams[i]);
        expect(inContractTeams[i].id).to.equal(teams[i].id);
        expect(inContractTeams[i].name).to.equal(teams[i].name);
        expect(inContractTeams[i].city).to.equal(teams[i].city);
        expect(inContractTeams[i].tricode).to.equal(teams[i].tricode);
        expect(inContractTeams[i].real_id).to.equal(teams[i].real_id);
    }
    console.log("    Part 1 Done ");
    console.log("");
    console.log("    Part 2 - Trait Registry");


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
    
    const ECRegistryArtifacts = await ethers.getContractFactory("ECRegistryV3");

    const ECRegistrydeployedInstance = await ECRegistryArtifacts.deploy();
    await ECRegistrydeployedInstance.deployed();
    
    tx = await ECRegistrydeployedInstance.provider.getTransactionReceipt(ECRegistrydeployedInstance.deployTransaction.hash);
    console.log("    Deployment hash:           ", ECRegistrydeployedInstance.deployTransaction.hash)
    console.log("    Deployment address:        ", ECRegistrydeployedInstance.address)

    const ECRegistry = new ethers.Contract(ECRegistrydeployedInstance.address, ECRegistryArtifacts.interface, accounts[0]);
    
    console.log("");
    console.log("    Validate:");
    console.log("      npx hardhat verify --network matic --contract contracts/ECRegistryV3.sol:ECRegistryV3 "+ECRegistry.address);

    console.log("    Add Traits ");

    tx = await ECRegistry.addTrait(
        traits
    );
    await tx.wait();

    const chainTraits = await ECRegistry.getTraits();
    for(let i = 0; i < chainTraits.length; i++) {
        expect(chainTraits[i].id).to.equal(traits[i].id);
        expect(chainTraits[i].traitType).to.equal(traits[i].traitType);
        expect(chainTraits[i].start).to.equal(traits[i].start);
        expect(chainTraits[i].end).to.equal(traits[i].end);
        expect(chainTraits[i].name).to.equal(traits[i].name);
        if(chainTraits[i].traitType === 3) {
            expect(chainTraits[i].implementer).to.not.equal(traits[i].implementer);
        }
    };

    console.log("    Part 2 Done ");

    console.log("    Part 3 - ChainBatchWriteAdapter ");
    
    const ChainBatchWriteAdapterArtifacts = await ethers.getContractFactory("ChainBatchWriteAdapter");

    const ChainBatchWriteAdapterdeployedInstance = await ChainBatchWriteAdapterArtifacts.deploy();
    await ChainBatchWriteAdapterdeployedInstance.deployed();
    
    tx = await ChainBatchWriteAdapterdeployedInstance.provider.getTransactionReceipt(ChainBatchWriteAdapterdeployedInstance.deployTransaction.hash);
    console.log("    Deployment hash:           ", ChainBatchWriteAdapterdeployedInstance.deployTransaction.hash)
    console.log("    Deployment address:        ", ChainBatchWriteAdapterdeployedInstance.address)

    const ChainBatchWriteAdapter = new ethers.Contract(ChainBatchWriteAdapterdeployedInstance.address, ChainBatchWriteAdapterArtifacts.interface, accounts[0]);
    
    console.log("");
    console.log("    Validate:");
    console.log("      npx hardhat verify --network matic --contract contracts/ChainBatchWriteAdapter.sol:ChainBatchWriteAdapter "+ChainBatchWriteAdapter.address);

    console.log("    Give ChainBatchWriteAdapter write permissions to ECRegistry");
    tx = await ECRegistry.setTraitControllerAccessData(
        ChainBatchWriteAdapter.address,
        [255,255,255,255]
    );
    await tx.wait();
    console.log("    Part 3 Done ");

    console.log("    Validate Writer access. ");
    const addressCanModifyTraits = await ECRegistry.addressCanModifyTraits(ChainBatchWriteAdapter.address, [0, 2, 9, 12, 16, 25, 31]);
    expect(addressCanModifyTraits).to.equal(true);
    console.log("    Done. ");

}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });