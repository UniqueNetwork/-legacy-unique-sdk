import connect from './connect';
// @ts-ignore
import rtt from './runtime_types.json';

async function test () {
  console.log('test started');

  const endpoint = 'wss://testnet2.uniquenetwork.io';

  await connect(endpoint, rtt)

  console.log('test passed');
}

export default test;
