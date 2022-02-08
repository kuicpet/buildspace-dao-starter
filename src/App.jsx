import { useEffect, useMemo, useState } from 'react'
// import thirdweb
import { useWeb3 } from '@3rdweb/hooks'
import { IoWalletOutline } from 'react-icons/io5'

const App = () => {
  const { connectWallet, address, error, provider } = useWeb3()
  console.log('👋 Address:', address)
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
  return (
    <div className='landing'>
      <h1>Hurray 🎉.wallet connected!</h1>
    </div>
  )
}

export default App
