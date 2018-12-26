import { drizzleConnect } from 'drizzle-react'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import BalanceComponent from "../drizzle-components/drizzle-contract-data-fetcher.js";


import EventToken from "../data/EventToken.json";


import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Group from "@material-ui/icons/Group";
import Warning from "@material-ui/icons/Warning"
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid'
import NameCard from '../custom-components/Card/NameCard.jsx'
import EthereumIcon from "@material-ui/icons/AccountBalanceWalletTwoTone";
import EventTokenIcon from "@material-ui/icons/AttachMoney";

import Loading from "@material-ui/icons/CloudUpload"
/*
 * Create component.
 */

class DrizzleAccount extends Component {
  constructor(props, context) {
    super(props);
    this.precisionRound = this.precisionRound.bind(this);
    this.convertToEther = this.convertToEther.bind(this);
  }

  precisionRound(number, precision) {
    var factor = Math.pow(10, precision)
    return Math.round(number * factor) / factor
  }

  convertToEther(number){
    return number/(Math.pow(10, 18));
  }

  render() {
    // Get account address and balance.
    const address = this.props.accounts[0]
    let eth_balance;
    eth_balance = this.props.accountBalances[address];
    eth_balance = this.convertToEther(eth_balance);
    eth_balance = this.precisionRound(eth_balance, 2);



    if (this.props.drizzleStatus.initialized === true && this.context.drizzle.contracts.EventToken !== undefined){
      const balanceComp = <BalanceComponent contract="EventToken" method="balanceOf" methodArgs={[this.props.accounts[0],{from: this.props.accounts[0]}]}/>

      return(
        <div>
          <Grid container alignItems="stretch" justify="space-evenly">
            <Grid item xs={8}>
              <NameCard primary={address} secondary="Account" icon={Group}></NameCard>
            </Grid>
            <Grid item xs={2}>
              <NameCard primary={eth_balance} secondary={this.props.units} icon={EthereumIcon}></NameCard>
            </Grid>
            <Grid item xs={2}>
              <NameCard primary={balanceComp} secondary="ET" icon={EventTokenIcon}/>
            </Grid>
          </Grid>
        </div>
      );
    } else {
      if (this.props.web3.status === 'failed') {
        return(
          <div>
            <Grid container alignItems="stretch" justify="space-evenly">
              <Grid item xs={12}>
                <NameCard
                  primary="This browser has no connection to the Ethereum network. Please use the Chrome/FireFox extension MetaMask, or dedicated Ethereum browsers Mist or Parity."
                  secondary="Error Message" icon={Warning}>
                </NameCard>
              </Grid>
            </Grid>
          </div>
        );
      }

      if (this.props.web3.status === 'initialized') {
        if (Object.keys(this.props.accounts).length === 0) {
          return(
            <div>
              <Grid container alignItems="stretch" justify="space-evenly">
                <Grid item xs={12}>
                  <NameCard
                    primary="We can't find any Ethereum accounts! Please check and make sure that Metamask is installed in your browser and your account is unlocked"
                    secondary="Error Message" icon={Warning}>
                  </NameCard>
                </Grid>
              </Grid>
            </div>
          );
        }
      }

      // const balanceComp = <BalanceComponent contract="EventToken" method="balanceOf" methodArgs={[this.props.accounts[0],{from: this.props.accounts[0]}]}/>

      return(
        <div>
          <Grid container alignItems="stretch" justify="space-evenly">
            <Grid item xs={8}>
              <NameCard primary={address} secondary="Account" icon={Group}></NameCard>
            </Grid>
            <Grid item xs={2}>
              <NameCard primary={eth_balance} secondary={this.props.units} icon={EthereumIcon}></NameCard>
            </Grid>
            <Grid item xs={2}>
              <NameCard primary="Awaiting Value..." secondary="ET" icon={EventTokenIcon}/>
            </Grid>
          </Grid>
        </div>
      );
    }
  }
}

DrizzleAccount.contextTypes = {
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
    accountBalances: state.accountBalances,
    contracts: state.contracts,
    units: "ETH"
  }
}

export default drizzleConnect(DrizzleAccount, mapStateToProps)
