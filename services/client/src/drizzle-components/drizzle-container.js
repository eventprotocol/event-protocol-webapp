import { drizzleConnect } from 'drizzle-react'
import React, { Children, Component } from 'react'
import PropTypes from 'prop-types'
import MetamaskSnackBar from '../custom-components/AppBar/MetamaskBar.js'

/*
 * Create component.
 */
class DrizzleContainer extends Component {
  render() {
    //console.log(this.props.accounts);
    //console.log(this.props);

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
      //console.log(this.props.drizzleStatus);
      return(
        <main className="container loading-screen">
          <div className="pure-g">
            <div className="pure-u-1-1">
            <MetamaskSnackBar data="We can't find any Ethereum accounts! Please check and make sure that Metamask is installed in your browser and your account is unlocked"></MetamaskSnackBar>>
            </div>
          </div>
        </main>
      )
    }
    if (this.props.drizzleStatus.initialized)
    {
      // TODO: Send signed message to flask endpoint. 
      return Children.only(this.props.children)
    }
    if (this.props.loadingComp) {
      return this.props.loadingComp
    }
    return(
      <main className="container loading-screen">
        <div className="pure-g">
          <div className="pure-u-1-1">
          <MetamaskSnackBar data="Metamask connected. Please connect to the Rinkeby Test Network"></MetamaskSnackBar>>
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
  }
}
export default drizzleConnect(DrizzleContainer, mapStateToProps)
