import { Contract, Provider } from 'ethers-multicall';
import { Beanstalk } from '../generated';

const beanstalkAbi = require('../abi/Beanstalk.json');

export default {
  multi: {
    beanstalk: new Contract('0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5', beanstalkAbi) as unknown as Beanstalk,
  }
}