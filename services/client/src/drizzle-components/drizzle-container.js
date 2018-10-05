import { drizzleConnect } from 'drizzle-react'
import React, { Children, Component } from 'react'
import PropTypes from 'prop-types'
import MetamaskSnackBar from '../custom-components/AppBar/MetamaskBar.js'

// axios for server access
import axios from 'axios';


/*
 * Create component.
 */
class DrizzleContainer extends Component {
  constructor(props, context) {
    super(props);
    this.state = {
      signRequest: false,
    }
  }


  render() {
    // console.log(this.props.accounts);
    // console.log(this.props);

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
            <MetamaskSnackBar data="We can't find any Ethereum accounts! Please check and make sure that Metamask is installed in your browser and your account is unlocked"></MetamaskSnackBar>
            </div>
          </div>
        </main>
      )
    }
    if (this.props.drizzleStatus.initialized)
    {     

      /*
       * To establish reliable connection with the server side
       */
      var web3Instance = this.context.drizzle.web3;
      var userAccount = this.props.accounts[0];

      // To prevent repetitive request to sign message we request from server
      // the eth address of user. 
      axios.get('/users/eth_address/' + userAccount)
      .then((res) => {
        // console.log("success");
        // console.log(res.data);

        var hashedMsg =  web3Instance.utils.sha3("EventProtocol");

        if(!this.state.signRequest) {
          this.state.signRequest = true;

          if(!window.localStorage.authToken) {
            
            // TODO: NOTE THAT THIS MAY BE DEPRECATED IN FUTURE 
            // Send signed message to server
            web3Instance.eth.sign(hashedMsg, userAccount)
            .then((signedMsg) => {
              console.log("SignedMessage");
              console.log(signedMsg);

              // Post to the /users to let it handle the registration and login
              // Case 1: Account does not exist 
              //           THEN register the account and send a authToken to client
              // Case 2: Account exists
              //            THEN send new authToken
              axios.post('/users', {
                eth_address: userAccount,
                signed_message: signedMsg,

              })
              .then((res) => {
                console.log(res);
                window.localStorage.setItem('authToken', res.data.auth_token);
              })
              .catch((err) => {
                console.log(err);
              });          

            })
            .catch((err) => {
              // reset sign request
              this.state.signRequest = false;
              console.log(err);
            });            

          }

        }

      })
      .catch((err) => { 
        console.log("fail")
        console.log(err); 
      });


      return Children.only(this.props.children)
    }
    if (this.props.loadingComp) {
      return this.props.loadingComp
    }
    return(
      <main className="container loading-screen">
        <div className="pure-g">
          <div className="pure-u-1-1">
          <MetamaskSnackBar data="Metamask connected. Please connect to the Rinkeby Test Network"></MetamaskSnackBar>
          </div>
        </div>
      </main>
    )
  }
}

DrizzleContainer.contextTypes = {
  drizzle: PropTypes.object,
}

/*
 * Export connected component.
 */
const mapStateToProps = state => {
  return {
    accounts: state.accounts,
    drizzleStatus: state.drizzleStatus,
    // Note that this only exposes the state of web3 and not the actual web3 instance itself
    web3: state.web3,
  }
}
export default drizzleConnect(DrizzleContainer, mapStateToProps)
