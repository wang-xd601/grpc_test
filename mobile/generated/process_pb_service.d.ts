// package: process
// file: process.proto

import * as process_pb from "./process_pb";
import {grpc} from "@improbable-eng/grpc-web";

type Processcreate = {
  readonly methodName: string;
  readonly service: typeof Process;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof process_pb.CreateRequest;
  readonly responseType: typeof process_pb.CreateReply;
};

export class Process {
  static readonly serviceName: string;
  static readonly create: Processcreate;
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

export class ProcessClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  create(
    requestMessage: process_pb.CreateRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: process_pb.CreateReply|null) => void
  ): UnaryResponse;
  create(
    requestMessage: process_pb.CreateRequest,
    callback: (error: ServiceError|null, responseMessage: process_pb.CreateReply|null) => void
  ): UnaryResponse;
}

