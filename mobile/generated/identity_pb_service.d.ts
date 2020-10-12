// package: identity
// file: identity.proto

import * as identity_pb from "./identity_pb";
import {grpc} from "@improbable-eng/grpc-web";

type IdentityPBretrieve = {
  readonly methodName: string;
  readonly service: typeof IdentityPB;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof identity_pb.RetrieveRequest;
  readonly responseType: typeof identity_pb.RetrieveReply;
};

export class IdentityPB {
  static readonly serviceName: string;
  static readonly retrieve: IdentityPBretrieve;
}

export type ServiceError = { message: string, code: number; metadata: grpc.Metadata }
export type Status = { details: string, code: number; metadata: grpc.Metadata }

interface UnaryResponse {
  cancel(): void;
}
interface ResponseStream<T> {
  cancel(): void;
  on(type: 'data', handler: (message: T) => void): ResponseStream<T>;
  on(type: 'end', handler: (status?: Status) => void): ResponseStream<T>;
  on(type: 'status', handler: (status: Status) => void): ResponseStream<T>;
}
interface RequestStream<T> {
  write(message: T): RequestStream<T>;
  end(): void;
  cancel(): void;
  on(type: 'end', handler: (status?: Status) => void): RequestStream<T>;
  on(type: 'status', handler: (status: Status) => void): RequestStream<T>;
}
interface BidirectionalStream<ReqT, ResT> {
  write(message: ReqT): BidirectionalStream<ReqT, ResT>;
  end(): void;
  cancel(): void;
  on(type: 'data', handler: (message: ResT) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'end', handler: (status?: Status) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'status', handler: (status: Status) => void): BidirectionalStream<ReqT, ResT>;
}

export class IdentityPBClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  retrieve(
    requestMessage: identity_pb.RetrieveRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: identity_pb.RetrieveReply|null) => void
  ): UnaryResponse;
  retrieve(
    requestMessage: identity_pb.RetrieveRequest,
    callback: (error: ServiceError|null, responseMessage: identity_pb.RetrieveReply|null) => void
  ): UnaryResponse;
}

