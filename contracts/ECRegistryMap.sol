//SPDX-License-Identifier: Unlicensed
pragma solidity =0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
 
contract ECRegistryMap is Ownable {

    using EnumerableSet for EnumerableSet.AddressSet;
    // onlyOwner can change contractControllers and transfer it's ownership
    // any contractController can setData
    EnumerableSet.AddressSet contractController;

    /*
    *   Events
    */
    event contractControllerEvent(address _address, bool mode);

    struct teamStruct {
        uint16  id;
        string  name;
        string  city;
        string  tricode;
        uint256 real_id;
    }

    struct playerStruct {
        uint16  id;
        uint16  team_id;
        uint256 real_id;
        uint256 real_team_id;
        string  full_name;
    }


    mapping(uint16 => teamStruct)   public teams;
    uint16                          public teamCount;
    mapping(uint16 => playerStruct) public players;
    uint16                          public playerCount;



    function addTeam(
        teamStruct[]    calldata _newTeams
    ) public onlyAllowed {
        for (uint16 i = 0; i < _newTeams.length; i++) {
            uint16 newItemId = ++teamCount;
            teams[newItemId] = _newTeams[i];
            // teams[newItemId].id = newItemId;
        }
    }

    function updateTeams(
        uint16[]        calldata _ids,
        teamStruct[]    calldata _newTeams
    ) public onlyAllowed {
        for (uint16 i = 0; i < _ids.length; i++) {
            teams[_ids[i]] = _newTeams[i];
        }
    }

    function addPlayer(
        playerStruct[] calldata _newPlayers
    ) public onlyAllowed {
        for (uint16 i = 0; i < _newPlayers.length; i++) {
            uint16 newItemId = ++playerCount;
            players[newItemId] = _newPlayers[i];
            // players[newItemId].id = newItemId;
        }
    }

    function updatePlayers(
        uint16[]        calldata _ids,
        playerStruct[]  calldata _newPlayers
    ) public onlyAllowed {
        for (uint16 i = 0; i < _ids.length; i++) {
            players[_ids[i]] = _newPlayers[i];
        }
    }


    function getTeams() public view returns (teamStruct[] memory)
    {
        teamStruct[] memory retval = new teamStruct[](teamCount);
        for(uint16 i = 1; i <= teamCount; i++) {
            retval[i-1] = teams[i];
        }
        return retval;
    }

    /// ~3.14m gas for 270 items
    function getPlayers() public view returns (playerStruct[] memory)
    {
        playerStruct[] memory retval = new playerStruct[](playerCount);
        for(uint16 i = 1; i <= playerCount; i++) {
            retval[i-1] = players[i];
        }
        return retval;
    }

    /*
    *   Admin Stuff
    */

    function setContractController(address _controller, bool _mode) public onlyOwner {
        if(_mode) {
            contractController.add(_controller);
        } else {
            contractController.remove(_controller);
        }
        emit contractControllerEvent(_controller, _mode);
    }

    function getContractControllerLength() public view returns (uint256) {
        return contractController.length();
    }

    function getContractControllerAt(uint256 _index) public view returns (address) {
        return contractController.at(_index);
    }

    function getContractControllerContains(address _addr) public view returns (bool) {
        return contractController.contains(_addr);
    }


    modifier onlyAllowed() {
        require(
            msg.sender == owner() || contractController.contains(msg.sender),
            "Not Authorised"
        );
        _;
    }
}