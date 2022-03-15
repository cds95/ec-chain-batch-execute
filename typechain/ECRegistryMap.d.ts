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

interface ECRegistryMapInterface extends ethers.utils.Interface {
  functions: {
    "addPlayer(tuple[])": FunctionFragment;
    "addTeam(tuple[])": FunctionFragment;
    "getContractControllerAt(uint256)": FunctionFragment;
    "getContractControllerContains(address)": FunctionFragment;
    "getContractControllerLength()": FunctionFragment;
    "getPlayers()": FunctionFragment;
    "getTeams()": FunctionFragment;
    "owner()": FunctionFragment;
    "playerCount()": FunctionFragment;
    "players(uint16)": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "setContractController(address,bool)": FunctionFragment;
    "teamCount()": FunctionFragment;
    "teams(uint16)": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "updatePlayers(uint16[],tuple[])": FunctionFragment;
    "updateTeams(uint16[],tuple[])": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "addPlayer",
    values: [
      {
        id: BigNumberish;
        team_id: BigNumberish;
        real_id: BigNumberish;
        real_team_id: BigNumberish;
        full_name: string;
      }[]
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "addTeam",
    values: [
      {
        id: BigNumberish;
        name: string;
        city: string;
        tricode: string;
        real_id: BigNumberish;
      }[]
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "getContractControllerAt",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getContractControllerContains",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "getContractControllerLength",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getPlayers",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "getTeams", values?: undefined): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "playerCount",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "players",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setContractController",
    values: [string, boolean]
  ): string;
  encodeFunctionData(functionFragment: "teamCount", values?: undefined): string;
  encodeFunctionData(functionFragment: "teams", values: [BigNumberish]): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "updatePlayers",
    values: [
      BigNumberish[],
      {
        id: BigNumberish;
        team_id: BigNumberish;
        real_id: BigNumberish;
        real_team_id: BigNumberish;
        full_name: string;
      }[]
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "updateTeams",
    values: [
      BigNumberish[],
      {
        id: BigNumberish;
        name: string;
        city: string;
        tricode: string;
        real_id: BigNumberish;
      }[]
    ]
  ): string;

  decodeFunctionResult(functionFragment: "addPlayer", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "addTeam", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getContractControllerAt",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getContractControllerContains",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getContractControllerLength",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getPlayers", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getTeams", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "playerCount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "players", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setContractController",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "teamCount", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "teams", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updatePlayers",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateTeams",
    data: BytesLike
  ): Result;

  events: {
    "OwnershipTransferred(address,address)": EventFragment;
    "contractControllerEvent(address,bool)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "contractControllerEvent"): EventFragment;
}

export class ECRegistryMap extends BaseContract {
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

  interface: ECRegistryMapInterface;

  functions: {
    addPlayer(
      _newPlayers: {
        id: BigNumberish;
        team_id: BigNumberish;
        real_id: BigNumberish;
        real_team_id: BigNumberish;
        full_name: string;
      }[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    addTeam(
      _newTeams: {
        id: BigNumberish;
        name: string;
        city: string;
        tricode: string;
        real_id: BigNumberish;
      }[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    getContractControllerAt(
      _index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    getContractControllerContains(
      _addr: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    getContractControllerLength(
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getPlayers(
      overrides?: CallOverrides
    ): Promise<
      [
        ([number, number, BigNumber, BigNumber, string] & {
          id: number;
          team_id: number;
          real_id: BigNumber;
          real_team_id: BigNumber;
          full_name: string;
        })[]
      ]
    >;

    getTeams(
      overrides?: CallOverrides
    ): Promise<
      [
        ([number, string, string, string, BigNumber] & {
          id: number;
          name: string;
          city: string;
          tricode: string;
          real_id: BigNumber;
        })[]
      ]
    >;

    owner(overrides?: CallOverrides): Promise<[string]>;

    playerCount(overrides?: CallOverrides): Promise<[number]>;

    players(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [number, number, BigNumber, BigNumber, string] & {
        id: number;
        team_id: number;
        real_id: BigNumber;
        real_team_id: BigNumber;
        full_name: string;
      }
    >;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setContractController(
      _controller: string,
      _mode: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    teamCount(overrides?: CallOverrides): Promise<[number]>;

    teams(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [number, string, string, string, BigNumber] & {
        id: number;
        name: string;
        city: string;
        tricode: string;
        real_id: BigNumber;
      }
    >;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    updatePlayers(
      _ids: BigNumberish[],
      _newPlayers: {
        id: BigNumberish;
        team_id: BigNumberish;
        real_id: BigNumberish;
        real_team_id: BigNumberish;
        full_name: string;
      }[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    updateTeams(
      _ids: BigNumberish[],
      _newTeams: {
        id: BigNumberish;
        name: string;
        city: string;
        tricode: string;
        real_id: BigNumberish;
      }[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  addPlayer(
    _newPlayers: {
      id: BigNumberish;
      team_id: BigNumberish;
      real_id: BigNumberish;
      real_team_id: BigNumberish;
      full_name: string;
    }[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  addTeam(
    _newTeams: {
      id: BigNumberish;
      name: string;
      city: string;
      tricode: string;
      real_id: BigNumberish;
    }[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  getContractControllerAt(
    _index: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  getContractControllerContains(
    _addr: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  getContractControllerLength(overrides?: CallOverrides): Promise<BigNumber>;

  getPlayers(
    overrides?: CallOverrides
  ): Promise<
    ([number, number, BigNumber, BigNumber, string] & {
      id: number;
      team_id: number;
      real_id: BigNumber;
      real_team_id: BigNumber;
      full_name: string;
    })[]
  >;

  getTeams(
    overrides?: CallOverrides
  ): Promise<
    ([number, string, string, string, BigNumber] & {
      id: number;
      name: string;
      city: string;
      tricode: string;
      real_id: BigNumber;
    })[]
  >;

  owner(overrides?: CallOverrides): Promise<string>;

  playerCount(overrides?: CallOverrides): Promise<number>;

  players(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<
    [number, number, BigNumber, BigNumber, string] & {
      id: number;
      team_id: number;
      real_id: BigNumber;
      real_team_id: BigNumber;
      full_name: string;
    }
  >;

  renounceOwnership(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setContractController(
    _controller: string,
    _mode: boolean,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  teamCount(overrides?: CallOverrides): Promise<number>;

  teams(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<
    [number, string, string, string, BigNumber] & {
      id: number;
      name: string;
      city: string;
      tricode: string;
      real_id: BigNumber;
    }
  >;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  updatePlayers(
    _ids: BigNumberish[],
    _newPlayers: {
      id: BigNumberish;
      team_id: BigNumberish;
      real_id: BigNumberish;
      real_team_id: BigNumberish;
      full_name: string;
    }[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  updateTeams(
    _ids: BigNumberish[],
    _newTeams: {
      id: BigNumberish;
      name: string;
      city: string;
      tricode: string;
      real_id: BigNumberish;
    }[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    addPlayer(
      _newPlayers: {
        id: BigNumberish;
        team_id: BigNumberish;
        real_id: BigNumberish;
        real_team_id: BigNumberish;
        full_name: string;
      }[],
      overrides?: CallOverrides
    ): Promise<void>;

    addTeam(
      _newTeams: {
        id: BigNumberish;
        name: string;
        city: string;
        tricode: string;
        real_id: BigNumberish;
      }[],
      overrides?: CallOverrides
    ): Promise<void>;

    getContractControllerAt(
      _index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    getContractControllerContains(
      _addr: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    getContractControllerLength(overrides?: CallOverrides): Promise<BigNumber>;

    getPlayers(
      overrides?: CallOverrides
    ): Promise<
      ([number, number, BigNumber, BigNumber, string] & {
        id: number;
        team_id: number;
        real_id: BigNumber;
        real_team_id: BigNumber;
        full_name: string;
      })[]
    >;

    getTeams(
      overrides?: CallOverrides
    ): Promise<
      ([number, string, string, string, BigNumber] & {
        id: number;
        name: string;
        city: string;
        tricode: string;
        real_id: BigNumber;
      })[]
    >;

    owner(overrides?: CallOverrides): Promise<string>;

    playerCount(overrides?: CallOverrides): Promise<number>;

    players(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [number, number, BigNumber, BigNumber, string] & {
        id: number;
        team_id: number;
        real_id: BigNumber;
        real_team_id: BigNumber;
        full_name: string;
      }
    >;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    setContractController(
      _controller: string,
      _mode: boolean,
      overrides?: CallOverrides
    ): Promise<void>;

    teamCount(overrides?: CallOverrides): Promise<number>;

    teams(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [number, string, string, string, BigNumber] & {
        id: number;
        name: string;
        city: string;
        tricode: string;
        real_id: BigNumber;
      }
    >;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;

    updatePlayers(
      _ids: BigNumberish[],
      _newPlayers: {
        id: BigNumberish;
        team_id: BigNumberish;
        real_id: BigNumberish;
        real_team_id: BigNumberish;
        full_name: string;
      }[],
      overrides?: CallOverrides
    ): Promise<void>;

    updateTeams(
      _ids: BigNumberish[],
      _newTeams: {
        id: BigNumberish;
        name: string;
        city: string;
        tricode: string;
        real_id: BigNumberish;
      }[],
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    OwnershipTransferred(
      previousOwner?: string | null,
      newOwner?: string | null
    ): TypedEventFilter<
      [string, string],
      { previousOwner: string; newOwner: string }
    >;

    contractControllerEvent(
      _address?: null,
      mode?: null
    ): TypedEventFilter<[string, boolean], { _address: string; mode: boolean }>;
  };

  estimateGas: {
    addPlayer(
      _newPlayers: {
        id: BigNumberish;
        team_id: BigNumberish;
        real_id: BigNumberish;
        real_team_id: BigNumberish;
        full_name: string;
      }[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    addTeam(
      _newTeams: {
        id: BigNumberish;
        name: string;
        city: string;
        tricode: string;
        real_id: BigNumberish;
      }[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    getContractControllerAt(
      _index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getContractControllerContains(
      _addr: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getContractControllerLength(overrides?: CallOverrides): Promise<BigNumber>;

    getPlayers(overrides?: CallOverrides): Promise<BigNumber>;

    getTeams(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    playerCount(overrides?: CallOverrides): Promise<BigNumber>;

    players(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setContractController(
      _controller: string,
      _mode: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    teamCount(overrides?: CallOverrides): Promise<BigNumber>;

    teams(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    updatePlayers(
      _ids: BigNumberish[],
      _newPlayers: {
        id: BigNumberish;
        team_id: BigNumberish;
        real_id: BigNumberish;
        real_team_id: BigNumberish;
        full_name: string;
      }[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    updateTeams(
      _ids: BigNumberish[],
      _newTeams: {
        id: BigNumberish;
        name: string;
        city: string;
        tricode: string;
        real_id: BigNumberish;
      }[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    addPlayer(
      _newPlayers: {
        id: BigNumberish;
        team_id: BigNumberish;
        real_id: BigNumberish;
        real_team_id: BigNumberish;
        full_name: string;
      }[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    addTeam(
      _newTeams: {
        id: BigNumberish;
        name: string;
        city: string;
        tricode: string;
        real_id: BigNumberish;
      }[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    getContractControllerAt(
      _index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getContractControllerContains(
      _addr: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getContractControllerLength(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getPlayers(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getTeams(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    playerCount(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    players(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setContractController(
      _controller: string,
      _mode: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    teamCount(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    teams(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    updatePlayers(
      _ids: BigNumberish[],
      _newPlayers: {
        id: BigNumberish;
        team_id: BigNumberish;
        real_id: BigNumberish;
        real_team_id: BigNumberish;
        full_name: string;
      }[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    updateTeams(
      _ids: BigNumberish[],
      _newTeams: {
        id: BigNumberish;
        name: string;
        city: string;
        tricode: string;
        real_id: BigNumberish;
      }[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}