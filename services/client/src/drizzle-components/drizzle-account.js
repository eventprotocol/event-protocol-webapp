import { drizzleConnect } from 'drizzle-react'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import BalanceComponent from "../drizzle-components/drizzle-contract-data-fetcher.js";


import EventToken from "../data/EventToken.json";


import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Group from "@material-ui/icons/Group";
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
    // No accounts found.
    if(Object.keys(this.props.accounts).length === 0) {
      return (
        <span>Initializing...</span>
      )
    }

    // Get account address and balance.
    const address = this.props.accounts[0]
    var eth_balance;
    eth_balance = this.props.accountBalances[address];
    eth_balance = this.convertToEther(eth_balance);
    eth_balance = this.precisionRound(eth_balance, 2);


    if (this.props.drizzleStatus.initialized == true && this.context.drizzle.contracts.EventToken != undefined){
      const myComponent = <BalanceComponent contract="EventToken" method="balanceOf" methodArgs={[this.props.accounts[0],{from: this.props.accounts[0]}]}/>
      return(
      <div>
        <Grid container alignItems="stretch" justify="">
        <Grid item xs={8}><NameCard primary = {address} secondary="Account" icon = {Group}></NameCard></Grid>
        <Grid item xs={2}><NameCard primary = {eth_balance} secondary={this.props.units} icon = {EthereumIcon}></NameCard></Grid>
        <Grid item xs={2}><NameCard primary = {myComponent} secondary = "ET" icon = {EventTokenIcon}/></Grid>
        </Grid>
      </div>
      )
    }
    else{
      return(
      <div>
        <Grid container alignItems="stretch" justify="">
        <Grid item xs={8}><NameCard primary = {address} secondary="Account" icon = {Group}></NameCard></Grid>
        <Grid item xs={2}><NameCard primary = {eth_balance} secondary={this.props.units} icon = {EthereumIcon}></NameCard></Grid>
        <Grid item xs={2}><NameCard primary = "Fetching" secondary="ET" icon={EventTokenIcon}></NameCard></Grid>
        </Grid>
      </div>
      )
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
