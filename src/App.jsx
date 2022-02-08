import { useEffect, useMemo, useState } from 'react'
// import thirdweb
import { useWeb3 } from '@3rdweb/hooks'
import { ThirdwebSDK } from '@3rdweb/sdk'
import { IoWalletOutline } from 'react-icons/io5'

// instatntiate sdk on Rinkeby
const sdk = new ThirdwebSDK('rinkeby')

// reference to our ERC-1155 contract
const bundleDropModule = sdk.getBundleDropModule(
  '0x8144424BBDbDFAFCeFD6c96b279c6A27BcC2Cf75'
)

const App = () => {
  const { connectWallet, address, error, provider } = useWeb3()
  console.log('👋 Address:', address)

  // The signer is required to sign transactions on the blockchain.
  // Without it we can only read data, not write.
  const signer = provider ? provider.getSigner() : undefined

  const [hasClaimedNFT, setHasClaimedNFT] = useState(false)
  const [isClaiming, setIsClaiming] = useState(false)

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

  if(hasClaimedNFT){
    return (
      <div className='member-page'>
        <h1>🍪CreatorDAO Member Page</h1>
        <p>Congratulations on being a member</p>
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
          `🌊 Successfully Minted| Check it out on OpenSea: https://testnets.opensea.io/assets/${bundleDropModule.address.toLowerCase()}/0`
        )
      })
      .catch((error) => {
        setIsClaiming(false)
      })
  }

  return (
    <div className='landing'>
      <h1>Hurray 🎉.wallet connected!</h1>
      <div>
        <h1>Mint your free 🍪DAO Membership NFT</h1>
        <button disabled={isClaiming} onClick={() => mintNft()}>
          {isClaiming ? 'Minting...': 'Mint your nft (FREE)'}
        </button>
      </div>
    </div>
  )
}

export default App
