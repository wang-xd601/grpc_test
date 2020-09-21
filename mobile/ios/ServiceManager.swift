//
//  ServiceManager.swift
//  grpc_test
//
//  Created by kingstar on 9/16/20.
//

import Foundation
import GRPC
import NIO

@objc(ServiceManager)
class ServiceManager: RCTEventEmitter {
  var group: MultiThreadedEventLoopGroup?
  var channel: GRPCChannel?
  var authToken: String?
  
  static let sharedInstance = ServiceManager()
  
  override func supportedEvents() -> [String]! {
    return []
  }

  @objc func connectServer(_ hostname: String, port: Int, token: String) {
    group = MultiThreadedEventLoopGroup(numberOfThreads: 1)
    channel = ClientConnection.insecure(group: group!).connect(host: hostname, port: port)

    authToken = token
  }
  
  @objc func disconnectServer() {
    try! channel?.close().wait()
    try! group?.syncShutdownGracefully()
  }
  
  @objc func retrieveIdentity(_ payload: [String: Any],  resolve: RCTPromiseResolveBlock, rejecter reject:RCTPromiseRejectBlock) -> Void {
    if (channel == nil) {
      reject("NO_SERVER", "server is not started", nil)
      return
    }

    let callOptions = CallOptions(customMetadata: ["authorization": self.authToken!])
    let client = Identity_IdentityPBClient(channel: channel!, defaultCallOptions: callOptions)
    
    do {
      
      let request = try Identity_RetrieveRequest.with {
        $0.id = payload["id"]  as! String
      }
      // Make the RPC call to the server.
      let sayHello = client.retrieve(request)
      
      // wait() on the response to stop the program from exiting before the response is received.
      let response = try sayHello.response.wait()
      resolve(["phoneNumber": response.phoneNumber])
    } catch {
      reject("ERROR", "\(error)", nil)
    }
  }
  
  @objc func createProcess(_ payload: [String: Any],  resolve: RCTPromiseResolveBlock, rejecter reject:RCTPromiseRejectBlock) -> Void {
    if (channel == nil) {
      reject("NO_SERVER", "server is not started", nil)
      return
    }
    
    let callOptions = CallOptions(customMetadata: ["authorization": self.authToken!])
    let client = Process_ProcessClient(channel: channel!, defaultCallOptions: callOptions)
    
    do {
      
      let request = try Process_CreateRequest.with {
        $0.data = try Identity_Identity.with {
          $0.phoneNumber = (payload["data"] as! [String: Any])["phoneNumber"] as! String
        }.serializedData()
      }
      // Make the RPC call to the server.
      let sayHello = client.create(request)
      
      // wait() on the response to stop the program from exiting before the response is received.
      let response = try sayHello.response.wait()
      resolve(["id": response.id])
    } catch {
      reject("ERROR", "\(error)", nil)
    }
  }
  
  @objc func createEvent(_ payload: [String: Any],  resolve: RCTPromiseResolveBlock, rejecter reject:RCTPromiseRejectBlock) -> Void {
    if (channel == nil) {
      reject("NO_SERVER", "Server is not started", nil)
      return
    }

    let callOptions = CallOptions(customMetadata: ["authorization": self.authToken!])
    let client = Event_EventClient(channel: channel!, defaultCallOptions: callOptions)
    
    do {
      
      let request = try Event_CreateRequest.with {
        $0.processID = payload["processId"] as! String
        $0.data = try Identity_Identity.with {
          $0.phoneNumber = (payload["data"] as! [String: Any])["phoneNumber"] as! String
        }.serializedData()
      }
      // Make the RPC call to the server.
      let sayHello = client.create(request)
      
      // wait() on the response to stop the program from exiting before the response is received.
      let response = try sayHello.response.wait()
      resolve(["id": response.id])
    } catch {
      reject("ERROR", "\(error)", nil)
    }
  }
  
  override class func requiresMainQueueSetup() -> Bool {
    return false
  }

}

