import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App.jsx'
// import Thirdweb sdk
import { ThirdwebWeb3Provider } from '@3rdweb/hooks'

// add chains
const supportedChainIds = [4]

// Wallet to connect to injected 
const connectors = {
  injected: {},
}

// Render the App component to the DOM
ReactDOM.render(
  <React.StrictMode>
    <ThirdwebWeb3Provider
      supportedChainIds={supportedChainIds}
      connectors={connectors}
    >
      <App />
    </ThirdwebWeb3Provider>
  </React.StrictMode>,
  document.getElementById('root')
)
