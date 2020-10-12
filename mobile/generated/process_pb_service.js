// package: process
// file: process.proto

var process_pb = require("./process_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var Process = (function () {
  function Process() {}
  Process.serviceName = "process.Process";
  return Process;
}());

Process.create = {
  methodName: "create",
  service: Process,
  requestStream: false,
  responseStream: false,
  requestType: process_pb.CreateRequest,
  responseType: process_pb.CreateReply
};

exports.Process = Process;

function ProcessClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

ProcessClient.prototype.create = function create(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(Process.create, {
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

exports.ProcessClient = ProcessClient;

