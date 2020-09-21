import { NativeModules } from 'react-native';
const { ServiceManager } = NativeModules;

export class Identity {
  phoneNumber;

  constructor({ phoneNumber }) {
    this.phoneNumber = phoneNumber;
  }

  static async Retrieve(data) {
    const res = await ServiceManager.retrieveIdentity(data);
    return new Identity({ phoneNumber: res.phoneNumber });
  }
}

export class Process {
  id;

  constructor({ id }) {
    this.id = id;
  }

  static async Create(data) {
    const res = await ServiceManager.createProcess(data);
    return new Process({ id: res.id });
  }
}

export class Event {
  id;

  constructor({ id }) {
    this.id = id;
  }

  static async Create(data) {
    const res = await ServiceManager.createEvent(data);
    return new Event({ id: res.id });
  }
}
