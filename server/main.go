/*
 *
 * Copyright 2015 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

package main

import (
	"context"
	"fmt"
	"log"
	"net"

	uuid "github.com/satori/go.uuid"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/metadata"
	"google.golang.org/grpc/reflection"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/proto"

	eventPb "../proto/service/event"
	identityPb "../proto/service/identity"
	processPb "../proto/service/process"
)

const (
	port = ":50050"
)

type eventServer struct {
	eventPb.UnimplementedEventServer
}

type identityServer struct {
	identityPb.UnimplementedIdentityPBServer
}

type processServer struct {
	processPb.UnimplementedProcessServer
}

var data map[string](*identityPb.Identity) = make(map[string](*identityPb.Identity))

// Create Process implements process.Create
func (s *processServer) Create(ctx context.Context, in *processPb.CreateRequest) (*processPb.CreateReply, error) {
	id := uuid.Must(uuid.NewV4()).String()

	identity := &identityPb.Identity{}
	proto.Unmarshal(in.Data, identity)
	data[id] = identity
	fmt.Printf("Create Process Called %s: %s\n", id, data[id].PhoneNumber)
	return &processPb.CreateReply{Id: id}, nil
}

// Create Event implements event.Create
func (s *eventServer) Create(ctx context.Context, in *eventPb.CreateRequest) (*eventPb.CreateReply, error) {
	id := uuid.Must(uuid.NewV4()).String()

	identity := &identityPb.Identity{}
	proto.Unmarshal(in.Data, identity)
	data[in.ProcessId] = identity
	fmt.Printf("Create Event Called %s: %s\n", id, data[in.ProcessId].PhoneNumber)
	return &eventPb.CreateReply{Id: id}, nil
}

// Get Identity implements identityPb.Retrieve
func (s *identityServer) Retrieve(ctx context.Context, in *identityPb.RetrieveRequest) (*identityPb.RetrieveReply, error) {
	fmt.Printf("Identity Retrieve Called %s\n", data[in.Id].PhoneNumber)
	return &identityPb.RetrieveReply{PhoneNumber: data[in.Id].PhoneNumber}, nil
}

// Authorization unary interceptor function to handle authorize per RPC call
func serverInterceptor(ctx context.Context,
	req interface{},
	info *grpc.UnaryServerInfo,
	handler grpc.UnaryHandler) (interface{}, error) {
	if err := authorize(ctx); err != nil {
		return nil, err
	}

	// Calls the handler
	h, err := handler(ctx, req)

	return h, err
}

// authorize function authorizes the token received from Metadata
func authorize(ctx context.Context) error {
	md, ok := metadata.FromIncomingContext(ctx)
	if !ok {
		return status.Errorf(codes.InvalidArgument, "Retrieving metadata is failed")
	}

	authHeader, ok := md["authorization"]
	if !ok {
		return status.Errorf(codes.Unauthenticated, "Authorization token is not supplied")
	}

	token := authHeader[0]

	// validateToken function validates the token

	if token != "jwt-token" {
		return status.Errorf(codes.Unauthenticated, "Invalid auth token")
	}
	return nil
}

func withServerUnaryInterceptor() grpc.ServerOption {
	return grpc.UnaryInterceptor(serverInterceptor)
}

func main() {
	lis, err := net.Listen("tcp", port)
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	fmt.Printf("Server started, listening on %s\n", port)

	s := grpc.NewServer(withServerUnaryInterceptor())
	identityPb.RegisterIdentityPBServer(s, &identityServer{})
	eventPb.RegisterEventServer(s, &eventServer{})
	processPb.RegisterProcessServer(s, &processServer{})
	// Register reflection service on gRPC server.
	reflection.Register(s)
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
