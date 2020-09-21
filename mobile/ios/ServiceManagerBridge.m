//
//  ServiceManagerBridge.m
//  grpc_test
//
//  Created by kingstar on 9/16/20.
//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE (ServiceManager, NSObject)

RCT_EXTERN_METHOD(connectServer:(NSString *)hostname port:(int)port token:(NSString *)token)
RCT_EXTERN_METHOD(disconnectServer)

RCT_EXTERN_METHOD(retrieveIdentity:(NSDictionary *)payload resolve:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(createProcess:(NSDictionary *)payload resolve:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(createEvent:(NSDictionary *)payload resolve:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

@end
