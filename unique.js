import { Keyring } from '@polkadot/api';
class UniqueAPI {
  constructor(build) {
    
  }

  validate(build) {
    return (String(build.constructor) === String(UniqueAPI.Builder))
  }

  static get Builder() {
    class Builder {
      constructor(endpoint) {

      }
      build() {
        return new UniqueAPI(this)
      }
    }
    return Builder;
  }
}

export default unique;
