// package: event
// file: event.proto

var event_pb = require("./event_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var Event = (function () {
  function Event() {}
  Event.serviceName = "event.Event";
  return Event;
}());

Event.create = {
  methodName: "create",
  service: Event,
  requestStream: false,
  responseStream: false,
  requestType: event_pb.CreateRequest,
  responseType: event_pb.CreateReply
};

exports.Event = Event;

function EventClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

EventClient.prototype.create = function create(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(Event.create, {
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

exports.EventClient = EventClient;

