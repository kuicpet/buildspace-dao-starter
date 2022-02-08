// Deploy custom token contract
import sdk from './1-initialize-sdk.js'

// insert app address
const app = sdk.getAppModule('0xc521f33CCaCA5a62C19D99474aBaDF91D73cEB39')

;(async () => {
  try {
    // Deploy a standard ERC-20 contract.
    const tokenModule = await app.deployTokenModule({
      // Token name
      name: 'CreatorsDAO Governance Token',
      // Token symbol
      symbol: 'CREA',
    })
    console.log(
      'Successfully deployed token module, address',
      tokenModule.address
    )
  } catch (error) {
    console.log('Failed to deploy token module', error)
  }
})()
