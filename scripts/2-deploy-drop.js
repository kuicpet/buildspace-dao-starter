// This deploys an ERC-1155 contract to Rinkeby testnet
import { ethers } from 'ethers'
import sdk from './1-initialize-sdk.js';
import { readFileSync } from 'fs'

const app = sdk.getAppModule('0xc521f33CCaCA5a62C19D99474aBaDF91D73cEB39')

;(async () => {
  try {
    const bundleDropModule = await app.deployBundleDropModule({
      // collection name
      name: 'CreatorsDAO Membership',
      // description
      description: 'A DAO for Creators',
      // image for collection
      image: readFileSync('scripts/assets/nft.jpg'),
      // We need to pass in the address of the person who will be receiving the proceeds from sales of nfts in the module.
      // We're planning on not charging people for the drop, so we'll pass in the 0x0 address
      // you can set this to your own wallet address if you want to charge for the drop.
      primarySaleRecipientAddress: ethers.constants.AddressZero,
    })
    console.log(
      'Successfully deployed bundleDrop module, address:',
      bundleDropModule.address
    )
    console.log('bundleDrop metadata', await bundleDropModule.getMetadata())
  } catch (error) {
    console.log('Failed to deploy bundleDrop module', error)
  }
})();
