/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import { TypedEventFilter, TypedEvent, TypedListener } from "./commons";

interface IECRegistryInterface extends ethers.utils.Interface {
  functions: {
    "addressCanModifyTrait(address,uint16)": FunctionFragment;
    "addressCanModifyTraits(address,uint16[])": FunctionFragment;
    "contractController(address)": FunctionFragment;
    "getImplementer(uint16)": FunctionFragment;
    "hasTrait(uint16,uint16)": FunctionFragment;
    "owner()": FunctionFragment;
    "setTrait(uint16,uint16,bool)": FunctionFragment;
    "setTraitOnTokens(uint16,uint16[],bool[])": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "addressCanModifyTrait",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "addressCanModifyTraits",
    values: [string, BigNumberish[]]
  ): string;
  encodeFunctionData(
    functionFragment: "contractController",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "getImplementer",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "hasTrait",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "setTrait",
    values: [BigNumberish, BigNumberish, boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "setTraitOnTokens",
    values: [BigNumberish, BigNumberish[], boolean[]]
  ): string;

  decodeFunctionResult(
    functionFragment: "addressCanModifyTrait",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "addressCanModifyTraits",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "contractController",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getImplementer",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "hasTrait", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setTrait", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setTraitOnTokens",
    data: BytesLike
  ): Result;

  events: {};
}

export class IECRegistry extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: IECRegistryInterface;

  functions: {
    addressCanModifyTrait(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    addressCanModifyTraits(
      arg0: string,
      arg1: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    contractController(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    getImplementer(
      traitID: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    hasTrait(
      traitID: BigNumberish,
      tokenID: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    setTrait(
      traitID: BigNumberish,
      tokenID: BigNumberish,
      arg2: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setTraitOnTokens(
      traitID: BigNumberish,
      tokenID: BigNumberish[],
      arg2: boolean[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  addressCanModifyTrait(
    arg0: string,
    arg1: BigNumberish,
    overrides?: CallOverrides
  ): Promise<boolean>;

  addressCanModifyTraits(
    arg0: string,
    arg1: BigNumberish[],
    overrides?: CallOverrides
  ): Promise<boolean>;

  contractController(arg0: string, overrides?: CallOverrides): Promise<boolean>;

  getImplementer(
    traitID: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  hasTrait(
    traitID: BigNumberish,
    tokenID: BigNumberish,
    overrides?: CallOverrides
  ): Promise<boolean>;

  owner(overrides?: CallOverrides): Promise<string>;

  setTrait(
    traitID: BigNumberish,
    tokenID: BigNumberish,
    arg2: boolean,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setTraitOnTokens(
    traitID: BigNumberish,
    tokenID: BigNumberish[],
    arg2: boolean[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    addressCanModifyTrait(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    addressCanModifyTraits(
      arg0: string,
      arg1: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<boolean>;

    contractController(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    getImplementer(
      traitID: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    hasTrait(
      traitID: BigNumberish,
      tokenID: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    owner(overrides?: CallOverrides): Promise<string>;

    setTrait(
      traitID: BigNumberish,
      tokenID: BigNumberish,
      arg2: boolean,
      overrides?: CallOverrides
    ): Promise<void>;

    setTraitOnTokens(
      traitID: BigNumberish,
      tokenID: BigNumberish[],
      arg2: boolean[],
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {};

  estimateGas: {
    addressCanModifyTrait(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    addressCanModifyTraits(
      arg0: string,
      arg1: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    contractController(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getImplementer(
      traitID: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    hasTrait(
      traitID: BigNumberish,
      tokenID: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    setTrait(
      traitID: BigNumberish,
      tokenID: BigNumberish,
      arg2: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setTraitOnTokens(
      traitID: BigNumberish,
      tokenID: BigNumberish[],
      arg2: boolean[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    addressCanModifyTrait(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    addressCanModifyTraits(
      arg0: string,
      arg1: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    contractController(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getImplementer(
      traitID: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    hasTrait(
      traitID: BigNumberish,
      tokenID: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    setTrait(
      traitID: BigNumberish,
      tokenID: BigNumberish,
      arg2: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setTraitOnTokens(
      traitID: BigNumberish,
      tokenID: BigNumberish[],
      arg2: boolean[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
