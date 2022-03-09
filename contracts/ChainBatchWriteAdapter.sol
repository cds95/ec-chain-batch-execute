//SPDX-License-Identifier: MIT
pragma solidity =0.8.7;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
 
import "./interfaces/IECRegistry.sol";

contract ChainBatchWriteAdapter is Ownable {

    error CallFailed(uint16 id);

    event RequestFulfilled(
        bytes32 indexed requestId,
        bytes indexed data
    );

    /**
     * @notice Request variable bytes from the oracle
     */
    function requestBytes() public
    {
        // bytes32 specId = "b3b68ecd35464833a16613742640ae89";
        // uint256 payment = 100000000000000000;
        // Chainlink.Request memory req = buildChainlinkRequest(specId, address(this), this.fulfillBytes.selector);
        // req.add("get","https://ipfs.io/ipfs/QmZgsvrA1o1C8BGCrx6mHTqR1Ui1XqbCrtbMVrRLHtuPVD?filename=big-api-response.json");
        // req.add("path", "image");
        // sendOperatorRequest(req, payment);
    }

    /**
     * @notice Fulfillment function for variable bytes
     * @dev This is called by the oracle. recordChainlinkFulfillment must be used.
     */
    function canCall(address _addr) public view returns (bool) {
        // @TODO: implement this,
        // should hold registry implementers? GAS would be insane.. hmm

        return true;
    }

    // 0x010203040506070809
    // bytes - position - description
    // 2     - 0:1      - number of calls
    // ------ call 1 ------------------------------------
    // 2     - 2:3      - call data length
    // N     - 4:4+N    - arbitrary length call data
    // ------ call 2 ------------------------------------
    // N2    - 2:3      - call data length
    // N     - 4:4+N    - arbitrary length call data

    /**
     * @notice Fulfillment function for variable bytes
     * @dev This is called by the oracle. recordChainlinkFulfillment must be used.
     */
    function fulfillBytes(
        bytes32 requestId,
        bytes memory bytesData
    )
        public 
        recordChainlinkFulfillment(requestId) 
        returns (bool[] memory)
    {
        emit RequestFulfilled(requestId, bytesData);

        uint16 numberOfCalls;
        uint256 ptr;
  
        assembly {

            // set read pointer
            ptr := add( bytesData, 32 )

             // get number of calls -> mul first byte by 256 and add the rest from byte 2
            numberOfCalls := add(
                mul( byte( 0, mload( add( ptr, 0 ) ) ), 256),
                byte( 0, mload( add( ptr, 1 ) ) )
            )

            // move free memory pointer
            mstore(0x40, msize()) 

            // shift pointer to call start
            ptr := add( ptr, 2 )
        }

        bool[] memory results = new bool[](numberOfCalls);

        for(uint8 i = 0; i < numberOfCalls; i++) {
            uint256 dataLength;
            address toAddress;
            assembly {

                // ( 2 bytes ) load calldata length 
                dataLength := add(
                    mul( byte( 0, mload( add( ptr, 0 ) ) ), 256),
                    byte( 0, mload( add( ptr, 1 ) ) )
                )
                ptr := add( ptr, 2 )

                // ( 32 bytes ) load our address into a stack variable that our call can use
                toAddress := mload( ptr )
                ptr := add( ptr, 32 )
            }

            require(canCall(toAddress), "Not authorized to call address");

            bool success;
            assembly {

                // do we really need this ?
                let x := mload(0x40)

                // call(g, a, v, in, insize, out, outsize)
                success := call(      
                    gas(),     
                    toAddress,      // To addr
                    0,
                    ptr,            // Inputs are stored at current ptr location
                    dataLength,     // input length
                    x,          
                    0
                )

                // move to next call area
                ptr := add( ptr, dataLength )
            }

            if(!success) {
                revert CallFailed({id: i});
            }
            results[i] = success;
        }

        return results;

    }



    modifier recordChainlinkFulfillment(bytes32) {
        // require(
        //     addressCanModifyTrait(msg.sender, traitID),
        //     "Not Authorised"
        // );
        _;
    }
}
