/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  Signer,
  utils,
  BigNumberish,
  Contract,
  ContractFactory,
  Overrides,
} from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  TraitUint8ValueImplementer,
  TraitUint8ValueImplementerInterface,
} from "../TraitUint8ValueImplementer";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_registry",
        type: "address",
      },
      {
        internalType: "uint16",
        name: "_traitId",
        type: "uint16",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint16",
        name: "_tokenId",
        type: "uint16",
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "_newData",
        type: "uint8",
      },
    ],
    name: "updateTraitEvent",
    type: "event",
  },
  {
    inputs: [],
    name: "ECRegistry",
    outputs: [
      {
        internalType: "contract IECRegistry",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint16",
        name: "",
        type: "uint16",
      },
    ],
    name: "data",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint16",
        name: "_tokenId",
        type: "uint16",
      },
    ],
    name: "getValue",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint16[]",
        name: "_tokenIds",
        type: "uint16[]",
      },
      {
        internalType: "uint8[]",
        name: "_value",
        type: "uint8[]",
      },
    ],
    name: "setData",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint16[]",
        name: "_tokenIds",
        type: "uint16[]",
      },
      {
        internalType: "uint8[]",
        name: "_value",
        type: "uint8[]",
      },
    ],
    name: "setData2",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint16",
        name: "_tokenId",
        type: "uint16",
      },
      {
        internalType: "uint8",
        name: "_value",
        type: "uint8",
      },
    ],
    name: "setValue",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "traitId",
    outputs: [
      {
        internalType: "uint16",
        name: "",
        type: "uint16",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x60a06040523480156200001157600080fd5b5060405162000fc838038062000fc88339818101604052810190620000379190620000c0565b8061ffff1660808161ffff1660f01b81525050816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550505062000182565b600081519050620000a3816200014e565b92915050565b600081519050620000ba8162000168565b92915050565b60008060408385031215620000da57620000d962000149565b5b6000620000ea8582860162000092565b9250506020620000fd85828601620000a9565b9150509250929050565b6000620001148262000129565b9050919050565b600061ffff82169050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600080fd5b620001598162000107565b81146200016557600080fd5b50565b62000173816200011b565b81146200017f57600080fd5b50565b60805160f01c610e12620001b6600039600081816101b0015281816103ea0152818161055d01526105be0152610e126000f3fe608060405234801561001057600080fd5b506004361061007c5760003560e01c8063384f4a131161005b578063384f4a13146100e95780635bf63c88146101195780639859481814610137578063dc535c52146101535761007c565b8062e7adde146100815780630df584f11461009d578063133f67f5146100cd575b600080fd5b61009b60048036038101906100969190610938565b610171565b005b6100b760048036038101906100b291906109dd565b61038b565b6040516100c49190610b28565b60405180910390f35b6100e760048036038101906100e29190610a0a565b6103ab565b005b61010360048036038101906100fe91906109dd565b610529565b6040516101109190610b28565b60405180910390f35b61012161055b565b60405161012e9190610b0d565b60405180910390f35b610151600480360381019061014c9190610938565b61057f565b005b61015b610799565b6040516101689190610ad2565b60405180910390f35b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663201b1cc8337f00000000000000000000000000000000000000000000000000000000000000006040518363ffffffff1660e01b81526004016101ec929190610aa9565b60206040518083038186803b15801561020457600080fd5b505afa158015610218573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061023c91906109b0565b61027b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161027290610aed565b60405180910390fd5b60005b82518161ffff16101561038657818161ffff16815181106102a2576102a1610ceb565b5b602002602001015160016000858461ffff16815181106102c5576102c4610ceb565b5b602002602001015161ffff1661ffff16815260200190815260200160002060006101000a81548160ff021916908360ff160217905550828161ffff168151811061031257610311610ceb565b5b602002602001015161ffff167f59e36a51ef2e8e13e64329fb6b5fbf7374047b9ea243ba010d54c737a726f8bd838361ffff168151811061035657610355610ceb565b5b602002602001015160405161036b9190610b28565b60405180910390a2808061037e90610c91565b91505061027e565b505050565b60016020528060005260406000206000915054906101000a900460ff1681565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663201b1cc8337f00000000000000000000000000000000000000000000000000000000000000006040518363ffffffff1660e01b8152600401610426929190610aa9565b60206040518083038186803b15801561043e57600080fd5b505afa158015610452573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061047691906109b0565b6104b5576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104ac90610aed565b60405180910390fd5b80600160008461ffff1661ffff16815260200190815260200160002060006101000a81548160ff021916908360ff1602179055508161ffff167f59e36a51ef2e8e13e64329fb6b5fbf7374047b9ea243ba010d54c737a726f8bd8260405161051d9190610b28565b60405180910390a25050565b6000600160008361ffff1661ffff16815260200190815260200160002060009054906101000a900460ff169050919050565b7f000000000000000000000000000000000000000000000000000000000000000081565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663201b1cc8337f00000000000000000000000000000000000000000000000000000000000000006040518363ffffffff1660e01b81526004016105fa929190610aa9565b60206040518083038186803b15801561061257600080fd5b505afa158015610626573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061064a91906109b0565b610689576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161068090610aed565b60405180910390fd5b60005b82518161ffff16101561079457818161ffff16815181106106b0576106af610ceb565b5b602002602001015160016000858461ffff16815181106106d3576106d2610ceb565b5b602002602001015161ffff1661ffff16815260200190815260200160002060006101000a81548160ff021916908360ff160217905550828161ffff16815181106107205761071f610ceb565b5b602002602001015161ffff167f59e36a51ef2e8e13e64329fb6b5fbf7374047b9ea243ba010d54c737a726f8bd838361ffff168151811061076457610763610ceb565b5b60200260200101516040516107799190610b28565b60405180910390a2808061078c90610c91565b91505061068c565b505050565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60006107d06107cb84610b68565b610b43565b905080838252602082019050828560208602820111156107f3576107f2610d4e565b5b60005b858110156108235781610809888261090e565b8452602084019350602083019250506001810190506107f6565b5050509392505050565b600061084061083b84610b94565b610b43565b9050808382526020820190508285602086028201111561086357610862610d4e565b5b60005b8581101561089357816108798882610923565b845260208401935060208301925050600181019050610866565b5050509392505050565b600082601f8301126108b2576108b1610d49565b5b81356108c28482602086016107bd565b91505092915050565b600082601f8301126108e0576108df610d49565b5b81356108f084826020860161082d565b91505092915050565b60008151905061090881610d97565b92915050565b60008135905061091d81610dae565b92915050565b60008135905061093281610dc5565b92915050565b6000806040838503121561094f5761094e610d58565b5b600083013567ffffffffffffffff81111561096d5761096c610d53565b5b6109798582860161089d565b925050602083013567ffffffffffffffff81111561099a57610999610d53565b5b6109a6858286016108cb565b9150509250929050565b6000602082840312156109c6576109c5610d58565b5b60006109d4848285016108f9565b91505092915050565b6000602082840312156109f3576109f2610d58565b5b6000610a018482850161090e565b91505092915050565b60008060408385031215610a2157610a20610d58565b5b6000610a2f8582860161090e565b9250506020610a4085828601610923565b9150509250929050565b610a5381610bd1565b82525050565b610a6281610c2a565b82525050565b6000610a75600e83610bc0565b9150610a8082610d6e565b602082019050919050565b610a9481610bef565b82525050565b610aa381610c1d565b82525050565b6000604082019050610abe6000830185610a4a565b610acb6020830184610a8b565b9392505050565b6000602082019050610ae76000830184610a59565b92915050565b60006020820190508181036000830152610b0681610a68565b9050919050565b6000602082019050610b226000830184610a8b565b92915050565b6000602082019050610b3d6000830184610a9a565b92915050565b6000610b4d610b5e565b9050610b598282610c60565b919050565b6000604051905090565b600067ffffffffffffffff821115610b8357610b82610d1a565b5b602082029050602081019050919050565b600067ffffffffffffffff821115610baf57610bae610d1a565b5b602082029050602081019050919050565b600082825260208201905092915050565b6000610bdc82610bfd565b9050919050565b60008115159050919050565b600061ffff82169050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600060ff82169050919050565b6000610c3582610c3c565b9050919050565b6000610c4782610c4e565b9050919050565b6000610c5982610bfd565b9050919050565b610c6982610d5d565b810181811067ffffffffffffffff82111715610c8857610c87610d1a565b5b80604052505050565b6000610c9c82610bef565b915061ffff821415610cb157610cb0610cbc565b5b600182019050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e6f7420417574686f7269736564000000000000000000000000000000000000600082015250565b610da081610be3565b8114610dab57600080fd5b50565b610db781610bef565b8114610dc257600080fd5b50565b610dce81610c1d565b8114610dd957600080fd5b5056fea2646970667358221220fb9efde4b1255b56de3d24680971b0e095643a922d733d5c9ba462d1016dc45464736f6c63430008070033";

export class TraitUint8ValueImplementer__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    _registry: string,
    _traitId: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<TraitUint8ValueImplementer> {
    return super.deploy(
      _registry,
      _traitId,
      overrides || {}
    ) as Promise<TraitUint8ValueImplementer>;
  }
  getDeployTransaction(
    _registry: string,
    _traitId: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_registry, _traitId, overrides || {});
  }
  attach(address: string): TraitUint8ValueImplementer {
    return super.attach(address) as TraitUint8ValueImplementer;
  }
  connect(signer: Signer): TraitUint8ValueImplementer__factory {
    return super.connect(signer) as TraitUint8ValueImplementer__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): TraitUint8ValueImplementerInterface {
    return new utils.Interface(_abi) as TraitUint8ValueImplementerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): TraitUint8ValueImplementer {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as TraitUint8ValueImplementer;
  }
}
