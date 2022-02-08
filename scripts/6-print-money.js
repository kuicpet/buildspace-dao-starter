import { ethers } from 'ethers'
import sdk from './1-initialize-sdk.js'

// insert token contract address
const tokenModule = sdk.getTokenModule(
  '0xCCD81A7B12F65a8d016749f010bECCf46b2c5A65'
)

;(async () => {
  try {
    // set max supply 1,000,000
    const amount = 1_000_000
    // We use the util function from "ethers" to convert the amount
    // to have 18 decimals (which is the standard for ERC20 tokens).
    const amountWith18Decimals = ethers.utils.parseUnits(amount.toString(), 18)
    // Interact with your deployed ERC-20 contract and mint the tokens!
    await tokenModule.mint(amountWith18Decimals)
    const totalSupply = await tokenModule.totalSupply()
    console.log('There now is', ethers.utils.formatUnits(totalSupply, 18), 'CREA in circulation')
  } catch (error) {
      console.log('Failed to print money', error)
  }
})()
