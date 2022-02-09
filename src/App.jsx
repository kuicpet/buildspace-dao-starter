import { UnsupportedChainIdError } from '@web3-react/core'
import { useEffect, useMemo, useState } from 'react'
// import thirdweb
import { useWeb3 } from '@3rdweb/hooks'
import { ThirdwebSDK } from '@3rdweb/sdk'
import { ethers } from 'ethers'
import { IoWalletOutline } from 'react-icons/io5'

// instatiate sdk on Rinkeby
const sdk = new ThirdwebSDK('rinkeby')

// reference to our ERC-1155 contract
const bundleDropModule = sdk.getBundleDropModule(
  '0x8144424BBDbDFAFCeFD6c96b279c6A27BcC2Cf75'
)

// token module contract address
const tokenModule = sdk.getTokenModule(
  '0xCCD81A7B12F65a8d016749f010bECCf46b2c5A65'
)

const voteModule = sdk.getVoteModule(
  '0xCCd1aC11A8ABB58AFaC54C1786e4147606c115a7'
)

const App = () => {
  const { connectWallet, address, error, provider } = useWeb3()
  console.log('👋 Address:', address)

  // The signer is required to sign transactions on the blockchain.
  // Without it we can only read data, not write.
  const signer = provider ? provider.getSigner() : undefined

  const [hasClaimedNFT, setHasClaimedNFT] = useState(false)
  const [isClaiming, setIsClaiming] = useState(false)
  const [memberTokenAmounts, setMemberTokenAmounts] = useState({})
  const [memberAddresses, setMemberAddresses] = useState([])
  const [proposals, setProposals] = useState([])
  const [isVoting, setIsVoting] = useState(false)
  const [hasVoted, setHasVoted] = useState(false)

  const shortenAddress = (str) => {
    return str.substring(0, 6) + '...' + str.substring(str.length - 4)
  }

  // retrieve all existing proppsals from the contract
  useEffect(() => {
    if (!hasClaimedNFT) {
      return
    }
    // get all proposals
    voteModule
      .getAll()
      .then((proposals) => {
        setProposals(proposals)
        console.log('🌈 Proposals:', proposals)
      })
      .catch((error) => {
        console.error('Failed to get proposals', error)
      })
  }, [hasClaimedNFT])
  // check if user already voted
  useEffect(() => {
    if (!hasClaimedNFT) {
      return
    }
    // If we haven't finished retrieving the proposals from the useEffect above
    // then we can't check if the user voted yet!
    if (!proposals.length) {
      return
    }
    voteModule
      .hasVoted(proposals[0].proposalId, address)
      .then((hasVoted) => {
        setHasVoted(hasVoted)
        if (hasVoted) {
          console.log('🥵 User has already voted')
        } else {
          console.log('🙂 User has not voted yet')
        }
      })
      .catch((error) => {
        console.log('Failed to check if wallet has voted', error)
      })
  }, [hasClaimedNFT, proposals, address])
  // gets all addresses of our holding our nfts
  useEffect(() => {
    if (!hasClaimedNFT) {
      return
    }
    bundleDropModule
      .getAllClaimerAddresses('0')
      .then((addresses) => {
        console.log('🚀 Members addresses', addresses)
        setMemberAddresses(addresses)
      })
      .catch((error) => {
        console.log('Failed to get member list', error)
      })
  }, [hasClaimedNFT])

  // grabs the # of token each member holds.
  useEffect(() => {
    if (!hasClaimedNFT) {
      return
    }

    // Grab all the balances.
    tokenModule
      .getAllHolderBalances()
      .then((amounts) => {
        console.log('👜 Amounts', amounts)
        setMemberTokenAmounts(amounts)
      })
      .catch((error) => {
        console.log('Failed to get token amounts', error)
      })
  }, [hasClaimedNFT])

  const memberList = useMemo(() => {
    return memberAddresses.map((address) => {
      return {
        address,
        tokenAmount: ethers.utils.formatUnits(
          // If the address isn't in memberTokenAmounts, it means they don't
          // hold any of our token.
          memberTokenAmounts[address] || 0,
          18
        ),
      }
    })
  }, [memberAddresses, memberTokenAmounts])

  useEffect(() => {
    // We pass the signer to the sdk, which enables us to interact with
    // our deployed contract!
    sdk.setProviderOrSigner(signer)
  }, [signer])

  useEffect(() => {
    if (!address) {
      return
    }
    return bundleDropModule
      .balanceOf(address, '0')
      .then((balance) => {
        // If balance is greater than 0, they have our NFT!
        if (balance.gt(0)) {
          setHasClaimedNFT(true)
          console.log('🌟 this user has a membership NFT|')
        } else {
          setHasClaimedNFT(false)
          console.log('😭 this user doesn"t have s membership')
        }
      })
      .catch((error) => {
        setHasClaimedNFT(false)
        console.log('failed to get nft balance', error)
      })
  }, [address])

  if (error instanceof UnsupportedChainIdError) {
    return (
      <div className='unsupported-network'>
        <h2>Please connect to Rinkeby Network</h2>
        <p>
          This dapp only works on the Rinkeby network,please switch networks in
          your connected wallet
        </p>
      </div>
    )
  }

  if (!address) {
    return (
      <div className='landing'>
        <h1>Welcome to CreatorsDAO</h1>
        <button className='btn-hero' onClick={() => connectWallet('injected')}>
          <IoWalletOutline
            className='icon'
            fontSize={21}
            style={{ marginRight: '1.25rem', marginLeft: '1.25rem' }}
          />
          Connect your Wallet
        </button>
      </div>
    )
  }

  if (hasClaimedNFT) {
    return (
      <div className='member-page'>
        <h1>
          🍪{' '}
          <span className='text-gradient'>
            Welcome Creator {shortenAddress(address)}
          </span>
        </h1>
        <p>Congratulations on being a member</p>
        <div>
          <div>
            <h2>Member List</h2>
            <table className='card'>
              <thead>
                <tr>
                  <th>Address</th>
                  <th>Token Amount</th>
                </tr>
              </thead>
              <tbody>
                {memberList.map((member) => {
                  return (
                    <tr key={member.address}>
                      <td>{shortenAddress(member.address)}</td>
                      <td>{member.tokenAmount}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div>
            <h2>Active Proposals</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                e.stopPropagation()
                // disable button
                setIsVoting(true)

                const votes = proposals.map((proposal) => {
                  let voteResult = {
                    proposalId: proposal.proposalId,
                    vote: 2,
                  }
                  proposal.votes.forEach((vote) => {
                    const elem = document.getElementById(
                      proposal.proposalId + '-' + vote.type
                    )
                    if (elem.checked) {
                      voteResult.vote = vote.type
                      return
                    }
                  })
                  return voteResult
                })
                // first we need to make sure the user delegates their token to vote
                try {
                  //we'll check if the wallet still needs to delegate their tokens before they can vote
                  const delegation = await tokenModule.getDelegationOf(address)
                  // if the delegation is the 0x0 address that means they have not elegated their governance tokens yet
                  if (delegation === ethers.constants.AddressZero) {
                    //if they haven't delegated their tokens yet, we'll have them delegate them before voting
                    await tokenModule.delegateTo(address)
                  }
                  // vote on proposals
                  try {
                    await Promise.all(
                      votes.map(async (vote) => {
                        // before voting we first need to check whether the proposal is open for voting
                        // we first need to get the latest state of the proposal
                        const proposal = await voteModule.get(vote.proposalId)
                        // then we check if the proposal is open for voting (state === 1 means it is open)
                        if (proposal.state === 1) {
                          // vote
                          return voteModule.vote(vote.proposalId, vote.vote)
                        }
                        //  // if the proposal is not open for voting we just return nothing, letting us continue
                        return
                      })
                    )
                    try {
                      // if any of the propsals are ready to be executed we'll need to execute them
                      // a proposal is ready to be executed if it is in state 4
                      await Promise.all(
                        votes.map(async (vote) => {
                          // we'll first get the latest state of the proposal again, since we may have just voted before
                          const proposal = await voteModule.get(vote.proposalId)
                          //if the state is in state 4 (meaning that it is ready to be executed), we'll execute the proposal
                          if (proposal.state === 4) {
                            return voteModule.execute(vote.proposalId)
                          }
                        })
                      )
                      // if we get here that means we successfully voted, so let's set the "hasVoted" state to true
                      setHasVoted(true)
                      // and log out a success message
                      console.log('successfully voted')
                    } catch (error) {
                      console.error('failed to execute votes', error)
                    }
                  } catch (error) {
                    console.error('failed to vote', error)
                  }
                } catch (error) {
                  console.error('failed to delegate tokens')
                } finally {
                  setIsVoting(false)
                }
              }}
            >
              {proposals.map((proposal, index) => (
                <div key={proposal.proposalId} className='card'>
                  <h5>{proposal.description}</h5>
                  <div>
                    {proposal.votes.map((vote) => (
                      <div key={vote.type}>
                        <input
                          type='radio'
                          id={proposal.proposalId + '-' + vote.type}
                          name={proposal.proposalId}
                          value={vote.type}
                          //default the "abstain" vote to chedked
                          defaultChecked={vote.type === 2}
                        />
                        <label htmlFor={proposal.proposalId + '-' + vote.type}>
                          {vote.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button disabled={isVoting || hasVoted} type='submit'>
                {isVoting
                  ? 'Voting...'
                  : hasVoted
                  ? 'You Already Voted'
                  : 'Submit Votes'}
              </button>
              <small style={{ marginBottom: '1rem' }}>
                This will trigger multiple transactions that you will need to
                sign.
              </small>
            </form>
          </div>
        </div>
      </div>
    )
  }

  const mintNft = () => {
    setIsClaiming(true)
    bundleDropModule
      .claim('0', 1)
      .then(() => {
        setHasClaimedNFT(true)
        console.log(
          `🌊 Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${bundleDropModule.address.toLowerCase()}/0`
        )
      })
      .catch((error) => {
        setIsClaiming(false)
      })
  }

  return (
    <div className='landing'>
      <h1 className='text-gradient'>Hurray 🎉.wallet connected!</h1>
      <div className='mint-nft'>
        <h1>Mint your free 🍪DAO Membership NFT</h1>
        <button disabled={isClaiming} onClick={() => mintNft()}>
          {isClaiming ? 'Minting...' : 'Mint your nft (FREE)'}
        </button>
      </div>
    </div>
  )
}

export default App
