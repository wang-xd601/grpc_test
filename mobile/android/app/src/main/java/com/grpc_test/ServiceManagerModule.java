package com.grpc_test;

import android.os.AsyncTask;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;

import java.lang.ref.WeakReference;
import java.util.concurrent.TimeUnit;

import io.grpc.Channel;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import io.grpc.Metadata;
import io.grpc.stub.MetadataUtils;
import io.grpc.test.event.EventGrpc;
import io.grpc.test.identity.Identity;
import io.grpc.test.identity.IdentityPBGrpc;
import io.grpc.test.identity.RetrieveReply;
import io.grpc.test.identity.RetrieveRequest;
import io.grpc.test.process.CreateReply;
import io.grpc.test.process.CreateRequest;
import io.grpc.test.process.ProcessGrpc;

public class ServiceManagerModule extends ReactContextBaseJavaModule {
    private static ReactApplicationContext reactContext;
    private ManagedChannel channel;
    private String authToken;

    ServiceManagerModule(ReactApplicationContext context) {
        super(context);

        reactContext = context;
    }

    @Override
    public String getName() {
        return "ServiceManager";
    }

    @ReactMethod
    public void connectServer(String hostname, Integer port, String token) {
        try {
            authToken = token;
            channel = ManagedChannelBuilder.forAddress(hostname, port).usePlaintext().build();
        } catch (Exception e) {

        }
    }

    @ReactMethod
    public void disconnectServer() {
        try {
            channel.shutdown().awaitTermination(1, TimeUnit.SECONDS);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    @ReactMethod
    public void createProcess(ReadableMap payload, Promise promise) {
        new GrpcTask("createProcess", payload, channel, authToken, promise).execute();
    }

    @ReactMethod
    public void createEvent(ReadableMap payload, Promise promise) {
        new GrpcTask("createEvent", payload, channel, authToken, promise).execute();
    }

    @ReactMethod
    public void retrieveIdentity(ReadableMap payload, Promise promise) {
        new GrpcTask("retrieveIdentity", payload, channel, authToken, promise).execute();
    }

    private static class GrpcTask extends AsyncTask<Void, Void, Void> {

        private final WeakReference<Channel> channel;
        private final WeakReference<Promise> promise;
        private final String apiName;
        private final ReadableMap payload;
        private final String authToken;

        private GrpcTask(String apiName, ReadableMap payload, Channel channel, String authToken, Promise promise) {
            this.channel = new WeakReference<Channel>(channel);
            this.promise = new WeakReference<Promise>(promise);
            this.apiName = apiName;
            this.payload = payload;
            this.authToken = authToken;
        }

        @Override
        protected Void doInBackground(Void... params) {
            Promise promise = this.promise.get();
            if (promise == null) {
                promise.reject("ERROR", "Unexpected Error");
            }
            Channel channel = this.channel.get();
            if (channel == null) {
                promise.reject("NO_SERVER", "Server is not started");
            }

            Metadata header = new Metadata();
            Metadata.Key<String> key =
                    Metadata.Key.of("authorization", Metadata.ASCII_STRING_MARSHALLER);
            header.put(key, this.authToken);

            try {
                WritableMap result = Arguments.createMap();
                switch (apiName) {
                    case "createEvent":
                        EventGrpc.EventBlockingStub eventStub = EventGrpc.newBlockingStub(channel);
                        eventStub = MetadataUtils.attachHeaders(eventStub, header);
                        io.grpc.test.event.CreateRequest request1 = io.grpc.test.event.CreateRequest.newBuilder()
                                .setProcessId(this.payload.getString("processId"))
                                .setData(Identity.newBuilder().setPhoneNumber(this.payload.getMap("data").getString("phoneNumber")).build().toByteString())
                                .build();
                        io.grpc.test.event.CreateReply reply1 = eventStub.create(request1);
                        result.putString("id", reply1.getId());
                        promise.resolve(result);

                        break;

                    case "createProcess":
                        ProcessGrpc.ProcessBlockingStub processStub = ProcessGrpc.newBlockingStub(channel);
                        processStub = MetadataUtils.attachHeaders(processStub, header);

                        CreateRequest request2 = CreateRequest.newBuilder()
                                .setData(Identity.newBuilder().setPhoneNumber(this.payload.getMap("data").getString("phoneNumber")).build().toByteString())
                                .build();
                        CreateReply reply2 = processStub.create(request2);
                        result.putString("id", reply2.getId());
                        promise.resolve(result);

                        break;

                    case "retrieveIdentity":
                        IdentityPBGrpc.IdentityPBBlockingStub identityStub = IdentityPBGrpc.newBlockingStub(channel);
                        identityStub = MetadataUtils.attachHeaders(identityStub, header);

                        RetrieveRequest request3 = RetrieveRequest.newBuilder()
                                .setId(this.payload.getString("id"))
                                .build();
                        RetrieveReply reply3 = identityStub.retrieve(request3);
                        result.putString("phoneNumber", reply3.getPhoneNumber());
                        promise.resolve(result);

                        break;
                }
            } catch (Exception e) {
                promise.reject(e);
            }
            return null;
        }
    }
}
