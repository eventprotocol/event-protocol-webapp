import { DrizzleProvider } from 'drizzle-react';
import { Drizzle, generateStore } from 'drizzle';
import EventToken from "../data/EventToken.json";
import EventContract from "../data/EventContract.json";

const options = {
  web3: {
    block: false,
    fallback: {
      type: 'ws',
      url: 'wss://rinkeby.infura.io/ws'
    }
  },
  contracts: [
    // <<Insert Smart Contract Names>>
    EventToken,
    EventContract
  ],
  polls: {
    accounts: 3000,
  },
  events: {},
}

export default options;
