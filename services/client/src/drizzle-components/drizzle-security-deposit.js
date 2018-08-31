import { drizzleConnect } from 'drizzle-react'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import SecurityDepositComponent from "../drizzle-components/drizzle-contract-data-fetcher.js";
import EventToken from "../data/EventToken.json";
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Group from "@material-ui/icons/Group";
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Grid from '@material-ui/core/Grid'
import NameCard from '../custom-components/Card/NameCard.jsx'
import EthereumIcon from "@material-ui/icons/AccountBalanceWalletTwoTone";
import EventTokenIcon from "@material-ui/icons/AttachMoney";


import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Popup from 'react-popup';
/*
 * Create component.
 */

 /** The prompt content component */
 class Prompt extends React.Component {
     constructor(props) {
         super(props);

         this.state = {
             value: this.props.defaultValue
         };

         this.onChange = (e) => this._onChange(e);
     }

     componentDidUpdate(prevProps, prevState) {
         if (prevState.value !== this.state.value) {
             this.props.onChange(this.state.value);
         }
     }

     _onChange(e) {
         let value = e.target.value;

         this.setState({value: value});
     }

     render() {
         return <input type="text" placeholder={this.props.placeholder} className="mm-popup__input" value={this.state.value} onChange={this.onChange} />;
     }
 }

 /** Prompt plugin */
 Popup.registerPlugin('prompt', function (defaultValue, placeholder, callback) {
     let promptValue = null;
     let promptChange = function (value) {
         promptValue = value;
     };

     this.create({
         title: 'What\'s your name?',
         content: <Prompt onChange={promptChange} placeholder={placeholder} value={defaultValue} />,
         buttons: {
             left: ['cancel'],
             right: [{
                 text: 'Save',
                 key: '⌘+s',
                 className: 'success',
                 action: function () {
                     callback(promptValue);
                     Popup.close();
                 }
             }]
         }
     });
 });



class SecurityDepositAccount extends Component {
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

  handleClick(e){
    /** Call the plugin */
    console.log("Clicked me");
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
      var myComponent = <SecurityDepositComponent contract="EventToken" method="allowance" methodArgs={[this.props.accounts[0], "0x24eeac4f88412dc27f4b802ea8eb8b4725cf3af8", {from: this.props.accounts[0]}]} />
      return(
      <div>
        <NameCard primary = {myComponent} secondary = "Security Deposit" icon = {EventTokenIcon}></NameCard>
        <Button variant="fab" color="primary" aria-label="Add" onClick={this.handleClick}>
          <AddIcon />
        </Button>

      </div>
      )
    }
    else{
      return(
      <div>
        <NameCard primary = "Fetching" secondary="ET" icon={EventTokenIcon}></NameCard>
      </div>
      )
    }
  }
}

SecurityDepositAccount.contextTypes = {
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

export default drizzleConnect(SecurityDepositAccount, mapStateToProps)
