import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';
import { grpc } from '@improbable-eng/grpc-web';
import { ReactNativeTransport } from '@improbable-eng/grpc-web-react-native-transport';

import { IdentityPBClient } from './generated/identity_pb_service';
import { ProcessClient } from './generated/process_pb_service';
import { EventClient } from './generated/event_pb_service';
import { Identity, RetrieveRequest } from './generated/identity_pb';
import { CreateRequest as CreateProcessRequest } from './generated/process_pb';
import { CreateRequest as CreateEventRequest } from './generated/event_pb';

const hostname = '192.168.1.180';
const port = 8080;
const token = 'jwt-token';

grpc.setDefaultTransport(ReactNativeTransport({ withCredentials: true }));

const grpcPromise = (client, method, request, metadata) =>
  new Promise((resolve, reject) => {
    client[method](request, metadata, (err, res) => {
      if (err) {
        return reject(err);
      }
      return resolve(res);
    });
  });

const App = () => {
  const [log, setLog] = useState('');

  const onCommunicate = async () => {
    try {
      let logMessage = '';

      var metadata = { authorization: token };

      // Create Identity
      let identity = new Identity();
      identity.setPhoneNumber('+13035551234');

      const host = `http://${hostname}:${port}`;
      const processClient = new ProcessClient(host);
      const identityClient = new IdentityPBClient(host);
      const eventClient = new EventClient(host);

      const processCreate = new CreateProcessRequest();
      processCreate.setData(identity.serializeBinary());
      const processReply = await grpcPromise(
        processClient,
        'create',
        processCreate,
        metadata,
      );
      logMessage += `Process ID: ${processReply.getId()}\n`;

      const identityRetrieve = new RetrieveRequest();
      identityRetrieve.setId(processReply.getId());
      identity = await grpcPromise(
        identityClient,
        'retrieve',
        identityRetrieve,
        metadata,
      );
      logMessage += `Phone number: ${identity.getPhoneNumber()}\n`;

      identity = new Identity();
      identity.setPhoneNumber('+17205559876');

      const eventRequest = new CreateEventRequest();
      eventRequest.setData(identity.serializeBinary());
      eventRequest.setProcessId(processReply.getId());

      const eventReply = await grpcPromise(
        eventClient,
        'create',
        eventRequest,
        metadata,
      );

      logMessage += `Event ID: ${eventReply.getId()}\n`;

      identity = await grpcPromise(
        identityClient,
        'retrieve',
        identityRetrieve,
        metadata,
      );
      logMessage += `Phone number: ${identity.getPhoneNumber()}\n`;

      setLog(logMessage);
    } catch (e) {
      console.log(e);
      setLog(e.message);
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <View style={styles.body}>
          <TouchableOpacity style={styles.button} onPress={onCommunicate}>
            <Text style={styles.sectionTitle}>Start</Text>
          </TouchableOpacity>
          <Text style={styles.sectionTitle}>Logs:</Text>

          <Text style={styles.logMessage}>{log}</Text>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  body: {
    alignItems: 'center',
    backgroundColor: 'white',
  },
  button: {
    width: 100,
    height: 30,
    borderRadius: 5,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: 100,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: 'black',
  },
  logMessage: {
    fontSize: 14,
    color: 'black',
  },
});

export default App;
