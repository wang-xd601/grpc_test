// package: identity
// file: identity.proto

import * as jspb from "google-protobuf";

export class RetrieveRequest extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RetrieveRequest.AsObject;
  static toObject(includeInstance: boolean, msg: RetrieveRequest): RetrieveRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RetrieveRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RetrieveRequest;
  static deserializeBinaryFromReader(message: RetrieveRequest, reader: jspb.BinaryReader): RetrieveRequest;
}

export namespace RetrieveRequest {
  export type AsObject = {
    id: string,
  }
}

export class RetrieveReply extends jspb.Message {
  getPhoneNumber(): string;
  setPhoneNumber(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RetrieveReply.AsObject;
  static toObject(includeInstance: boolean, msg: RetrieveReply): RetrieveReply.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RetrieveReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RetrieveReply;
  static deserializeBinaryFromReader(message: RetrieveReply, reader: jspb.BinaryReader): RetrieveReply;
}

export namespace RetrieveReply {
  export type AsObject = {
    phoneNumber: string,
  }
}

export class Identity extends jspb.Message {
  getPhoneNumber(): string;
  setPhoneNumber(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Identity.AsObject;
  static toObject(includeInstance: boolean, msg: Identity): Identity.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Identity, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Identity;
  static deserializeBinaryFromReader(message: Identity, reader: jspb.BinaryReader): Identity;
}

export namespace Identity {
  export type AsObject = {
    phoneNumber: string,
  }
}

