import sdk from './1-initialize-sdk.js'

const tokenModule = sdk.getTokenModule(
  '0xCCD81A7B12F65a8d016749f010bECCf46b2c5A65'
)

;(async () => {
  try {
    // Log the current roles.
    console.log(
      '👀 Roles that exist right now:',
      await tokenModule.getAllRoleMembers()
    )
    // Revoke all the superpowers your wallet had over the ERC-20 contract.
    await tokenModule.revokeAllRolesFromAddress(process.env.WALLET_ADDRESS)
    console.log(
      '🎉 Roles after revoking ourselves',
      await tokenModule.getAllRoleMembers()
    )
    console.log(
      '✅ Successfully revoked our superpowers from the ERC-20 contract'
    )
  } catch (error) {
    console.error('Failed to revoke ourselves from the DAO treasury', error)
  }
})()
