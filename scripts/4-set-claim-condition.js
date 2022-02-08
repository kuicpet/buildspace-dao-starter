// set up claim conditions
import sdk from './1-initialize-sdk.js'

const bundleDrop = sdk.getBundleDropModule(
  '0x8144424BBDbDFAFCeFD6c96b279c6A27BcC2Cf75'
)

;(async () => {
  try {
    const claimConditionFactory = bundleDrop.getClaimConditionFactory()
    // Specify conditions
    claimConditionFactory.newClaimPhase({
      startTime: new Date(),
      maxQuantity: 50_000,
      maxQuantityPerTransaction: 1,
    })
    await bundleDrop.setClaimCondition(0, claimConditionFactory)
    console.log(
      'Successfully set claim condition on bundle drop:',
      bundleDrop.address
    )
  } catch (error) {
    console.error('Failed to set claim condition', error)
  }
})()
