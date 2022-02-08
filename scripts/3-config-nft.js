// set up memmbership nft
import sdk from './1-initialize-sdk.js'
import { readFileSync } from 'fs'

const bundleDrop = sdk.getBundleDropModule(
  '0x8144424BBDbDFAFCeFD6c96b279c6A27BcC2Cf75'
)

;(async () => {
  try {
    await bundleDrop.createBatch([
      {
        namer: 'Epic Creator',
        description: 'This NFT will give you access to CreatorsDAO',
        image: readFileSync('scripts/assets/nft.jpg'),
      },
    ])
    console.log('Successfully created a new NFT in the drop!')
  } catch (error) {
      console.log('Failed to create the new NFT', error)
  }
})()
