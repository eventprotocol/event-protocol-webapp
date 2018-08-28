import { drizzleConnect } from 'drizzle-react'
import React, { Children, Component } from 'react'
import PropTypes from 'prop-types'
import MySnackBar from './MySnackBar.js'


/*
 * Create component.
 */
class DrizzleContainer extends Component {
  render() {
    console.log(this.props.accounts);
    console.log(this.props);
    if (this.props.web3.status === 'failed')
    {
      if (this.props.errorComp) {
        return this.props.errorComp
      }

      return(
        <main className="container loading-screen">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>⚠️</h1>
              <p>This browser has no connection to the Ethereum network. Please use the Chrome/FireFox extension MetaMask, or dedicated Ethereum browsers Mist or Parity.</p>
            </div>
          </div>
        </main>
      )
    }

    if (this.props.web3.status === 'initialized' && Object.keys(this.props.accounts).length === 0)
    {
      console.log(this.props.drizzleStatus);
      return(
        <main className="container loading-screen">
          <div className="pure-g">
            <div className="pure-u-1-1">
            <MySnackBar></MySnackBar>
            </div>
          </div>
        </main>
      )
    }
    if (this.props.drizzleStatus.initialized)
    {
      return Children.only(this.props.children)
    }
    if (this.props.loadingComp) {
      return this.props.loadingComp
    }
    return(
      <main className="container loading-screen">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>⚙️</h1>
            <p>Loading dapp...</p>
          </div>
        </div>
      </main>
    )
  }
}
DrizzleContainer.contextTypes = {
  drizzle: PropTypes.object
}
/*
 * Export connected component.
 */
const mapStateToProps = state => {
  return {
    accounts: state.accounts,
    drizzleStatus: state.drizzleStatus,
    web3: state.web3,
    accounts: state.accounts,
    accountBalances: state.accountBalances,
    contracts: state.contracts
  }
}
export default drizzleConnect(DrizzleContainer, mapStateToProps)
