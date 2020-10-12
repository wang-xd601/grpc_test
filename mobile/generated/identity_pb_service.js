// package: identity
// file: identity.proto

var identity_pb = require("./identity_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var IdentityPB = (function () {
  function IdentityPB() {}
  IdentityPB.serviceName = "identity.IdentityPB";
  return IdentityPB;
}());

IdentityPB.retrieve = {
  methodName: "retrieve",
  service: IdentityPB,
  requestStream: false,
  responseStream: false,
  requestType: identity_pb.RetrieveRequest,
  responseType: identity_pb.RetrieveReply
};

exports.IdentityPB = IdentityPB;

function IdentityPBClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

IdentityPBClient.prototype.retrieve = function retrieve(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(IdentityPB.retrieve, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

exports.IdentityPBClient = IdentityPBClient;

