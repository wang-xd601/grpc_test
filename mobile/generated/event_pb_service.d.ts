// package: event
// file: event.proto

import * as event_pb from "./event_pb";
import {grpc} from "@improbable-eng/grpc-web";

type Eventcreate = {
  readonly methodName: string;
  readonly service: typeof Event;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof event_pb.CreateRequest;
  readonly responseType: typeof event_pb.CreateReply;
};

export class Event {
  static readonly serviceName: string;
  static readonly create: Eventcreate;
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

export class EventClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  create(
    requestMessage: event_pb.CreateRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: event_pb.CreateReply|null) => void
  ): UnaryResponse;
  create(
    requestMessage: event_pb.CreateRequest,
    callback: (error: ServiceError|null, responseMessage: event_pb.CreateReply|null) => void
  ): UnaryResponse;
}

