// Air drop Token
import { ethers } from 'ethers'
import sdk from './1-initialize-sdk.js'

// address of the ERC-1133 membership NFT contract
const bundleDropModule = sdk.getBundleDropModule(
  '0x8144424BBDbDFAFCeFD6c96b279c6A27BcC2Cf75'
)

// address of the ERC-20 token contract
const tokenModule = sdk.getTokenModule(
  '0xCCD81A7B12F65a8d016749f010bECCf46b2c5A65'
)

;(async () => {
  try {
    // Grab all the addresses of people who own our membership NFT, which has
    // a tokenId of 0.
    const walletAddresses = await bundleDropModule.getAllClaimerAddresses('0')
    if (walletAddresses.length === 0) {
      console.log(
        'No NFTS have been claimed yet, maybe get some friends to claim your free NFTs|'
      )
      process.exit(0)
    }
    // Loop through the array of addresses.
    const airdropTargets = walletAddresses.map((address) => {
      // Pick a random # between 1000 and 10000.
      const randomAmount = Math.floor(Math.random() * (10000 - 1000 + 1) + 1000)
      console.log('✅ Going to airdrop', randomAmount, 'tokens to', address)
      // Set up the target
      const airdropTarget = {
        address,
        // Remember, we need 18 decimal places|
        amount: ethers.utils.parseUnits(randomAmount.toString(), 18),
      }
      return airdropTarget
    })
    // Call transferBatch on all our airdrop targets
    console.log('🌈 Starting airdrop...')
    await tokenModule.transferBatch(airdropTargets)
  } catch (error) {
    console.error('Failed to airdrop tokens', error)
  }
})()
