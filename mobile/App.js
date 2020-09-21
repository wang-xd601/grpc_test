import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  StatusBar,
  NativeModules,
  TouchableOpacity,
  View,
} from 'react-native';
import { Identity, Process, Event } from './GRPCService';

const { ServiceManager } = NativeModules;

const hostname = '192.168.1.180';
const port = 50050;
const token = 'jwt-token';

const App = () => {
  const [log, setLog] = useState('');

  const onCommunicate = async () => {
    try {
      let logMessage = '';
      ServiceManager.connectServer(hostname, port, token);

      // Create Identity
      let identity = new Identity({ phoneNumber: '+13035551234' });

      const processReply = await Process.Create({ data: identity });

      logMessage += `Process ID: ${processReply.id}\n`;

      identity = await Identity.Retrieve({ id: processReply.id });
      logMessage += `Phone number: ${identity.phoneNumber}\n`;

      // Create Event
      identity = new Identity({ phoneNumber: '+17205559876' });

      const eventReply = await Event.Create({
        processId: processReply.id,
        data: identity,
      });

      logMessage += `Event ID: ${eventReply.id}\n`;

      identity = await Identity.Retrieve({ id: processReply.id });
      logMessage += `Phone number: ${identity.phoneNumber}\n`;

      setLog(logMessage);
    } catch (e) {
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
