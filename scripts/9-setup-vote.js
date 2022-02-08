import { ethers } from 'ethers'
import sdk from './1-initialize-sdk.js'

// governance contract
const voteModule = sdk.getVoteModule(
  '0xCCd1aC11A8ABB58AFaC54C1786e4147606c115a7'
)

// ERC-20 contract
const tokenModule = sdk.getTokenModule(
  '0xCCD81A7B12F65a8d016749f010bECCf46b2c5A65'
)

;(async () => {
  try {
    // Give our treasury the power to mint additional token if needed.
    await tokenModule.grantRole('minter', voteModule.address)
    console.log(
      'Successfully gave vote module permissions to act on token module'
    )
  } catch (error) {
    console.error(
      'Failed to grant vote module permissions on token module',
      error
    )
    process.exit(1)
  }
  try {
    // Grab our wallet's token balance, remember -- we hold basically the entire supply right now!
    const ownedTokenBalance = await tokenModule.balanceOf(
      process.env.WALLET_ADDRESS
    )
    // Grab 90% of the supply that we hold.
    const ownedAmount = ethers.BigNumber.from(ownedTokenBalance.value)
    const percent90 = ownedAmount.div(100).mul(90)

    // Transfer 90% of the supply to our voting contract
    await tokenModule.transfer(voteModule.address, percent90)
    console.log('Successfully transferred tokens to vote module')
  } catch (error) {
    console.log('Failed to transfer tokens to vote module', error)
  }
})()
