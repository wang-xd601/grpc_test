// Code generated by protoc-gen-go-grpc. DO NOT EDIT.

package identity

import (
	context "context"
	grpc "google.golang.org/grpc"
	codes "google.golang.org/grpc/codes"
	status "google.golang.org/grpc/status"
)

// This is a compile-time assertion to ensure that this generated file
// is compatible with the grpc package it is being compiled against.
const _ = grpc.SupportPackageIsVersion6

// IdentityPBClient is the client API for IdentityPB service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://pkg.go.dev/google.golang.org/grpc/?tab=doc#ClientConn.NewStream.
type IdentityPBClient interface {
	Retrieve(ctx context.Context, in *RetrieveRequest, opts ...grpc.CallOption) (*RetrieveReply, error)
}

type identityPBClient struct {
	cc grpc.ClientConnInterface
}

func NewIdentityPBClient(cc grpc.ClientConnInterface) IdentityPBClient {
	return &identityPBClient{cc}
}

func (c *identityPBClient) Retrieve(ctx context.Context, in *RetrieveRequest, opts ...grpc.CallOption) (*RetrieveReply, error) {
	out := new(RetrieveReply)
	err := c.cc.Invoke(ctx, "/identity.IdentityPB/retrieve", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// IdentityPBServer is the server API for IdentityPB service.
// All implementations must embed UnimplementedIdentityPBServer
// for forward compatibility
type IdentityPBServer interface {
	Retrieve(context.Context, *RetrieveRequest) (*RetrieveReply, error)
	mustEmbedUnimplementedIdentityPBServer()
}

// UnimplementedIdentityPBServer must be embedded to have forward compatible implementations.
type UnimplementedIdentityPBServer struct {
}

func (*UnimplementedIdentityPBServer) Retrieve(context.Context, *RetrieveRequest) (*RetrieveReply, error) {
	return nil, status.Errorf(codes.Unimplemented, "method Retrieve not implemented")
}
func (*UnimplementedIdentityPBServer) mustEmbedUnimplementedIdentityPBServer() {}

func RegisterIdentityPBServer(s *grpc.Server, srv IdentityPBServer) {
	s.RegisterService(&_IdentityPB_serviceDesc, srv)
}

func _IdentityPB_Retrieve_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(RetrieveRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(IdentityPBServer).Retrieve(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/identity.IdentityPB/Retrieve",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(IdentityPBServer).Retrieve(ctx, req.(*RetrieveRequest))
	}
	return interceptor(ctx, in, info, handler)
}

var _IdentityPB_serviceDesc = grpc.ServiceDesc{
	ServiceName: "identity.IdentityPB",
	HandlerType: (*IdentityPBServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "retrieve",
			Handler:    _IdentityPB_Retrieve_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "identity.proto",
}