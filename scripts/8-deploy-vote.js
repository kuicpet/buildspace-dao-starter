// governance contract
import sdk from './1-initialize-sdk.js'

// app module address
const appModule = sdk.getAppModule('0xc521f33CCaCA5a62C19D99474aBaDF91D73cEB39')

;(async () => {
  try {
    const voteModule = await appModule.deployVoteModule({
      // Governance contract name
      name: 'CreatorDAO"s Proposals',
      //  This is the location of our governance token, our ERC-20 contract!
      votingTokenAddress: '0xCCD81A7B12F65a8d016749f010bECCf46b2c5A65',
      // After a proposal is created, when can members start voting?
      // For now, we set this to immediately.
      proposalStartWaitTimeInSeconds: 0,
      // How long do members have to vote on a proposal when it's created?
      // Here, we set it to 24 hours (86400 seconds)
      proposalVotingTimeInSeconds: 24 * 60 * 60,
      votingQuorumFraction: 0,

      // What's the minimum # of tokens a user needs to be allowed to create a proposal?
      // I set it to 0. Meaning no tokens are required for a user to be allowed to
      // create a proposal.
      minimumNumberOfTokensNeededToPropose: '0',
    })
    console.log(
      'Successfully deployed vote module, address:',
      voteModule.address
    )
  } catch (error) {
    console.error('Failed to deploy vote module', error)
  }
})()
