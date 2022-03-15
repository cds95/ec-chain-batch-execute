# ec-chain-batch-execute


    Network polygonMumbai

    Player and Team Mappings  - 0x139B522955D54482E7662927653ABb0bFB6F19BA
    ECRegistryV3              - 0x163883263274e8Ef6332cFa84F35B23c6C51dF72
    ChainBatchWriteAdapter    - 0xB57fba975C89492B016e0215E819B4d489F0fbcD

```
    Data structure:
    We have 270 players, each player can have any number of tokens assigned to them, thus we store the data at their position.
    I.e. 
      id - 1
      name - "LeBron James"
      Any trait will store data for this player at position 1.
        - for trait type == 0, a boolean using ECRegistryV3.setData(traitId, _positionIds, _values);
        - for trait type == 3, a uint8 using implementer.setData(traitId[], _positionIds, _values);
    
    Flow:
    0. receive data request
    1. read player / team maps frrom ECRegistryMap.getTeams() / ECRegistryMap.getPlayers()
    2. read traits from ECRegistryV3.getTraits(); to find out types and implementers.
    3. read NFT_Nightly_Achievements_2021_06_02.json and index by trait id, rewrite achievement_id to player_id / team_id, maintaining order
    4. read existing data from ECRegistryV3 for type 0 traits / trait.implementer for type 3 and EXCLUDE already existing data
    5. prepare transactions that would need to be made to ECRegistryV3 and each trait.implementer
        - a txn sets data on 1 trait for multiple tokens
    6. combine them `see tests/batchWriter.ts:119 callsToRequestData`
    7. run an eth_estimate to make sure the transaction will not fail.
    8. if estimation results in a fail, 

    *** Note: we've requested that each element in NFT_Nightly_Achievements_2021_06_02 should have an auto incremented event_id,
    and if added to the data adapter should be able to specify that in the payload and use it as a check point in case
    the transaction required is too big

```