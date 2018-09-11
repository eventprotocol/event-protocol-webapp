import { drizzleConnect } from 'drizzle-react'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import SecurityDepositComponent from "../drizzle-components/drizzle-contract-data-fetcher.js";
import EventToken from "../data/EventToken.json";
import NameCard from '../custom-components/Card/NameCard.jsx'
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';

class IncreaseSecurityDeposit extends Component{
  constructor(props, context){
    super(props);
    this.state = {
      DepValue: 0
    }
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e){
    /** Call the plugin */
    console.log("Clicked me");
    console.log(this);
    <SecurityDepositComponent contract="EventToken" method="approve" methodArgs={["0x24eeac4f88412dc27f4b802ea8eb8b4725cf3af8", this.state.DepValue*Math.pow(10, 18), {from: this.props.accounts[0]}]} />
    //console.log(myComponent);
  }

  render(){
    console.log(this.state.DepValue.value);
    if (this.props.drizzleStatus.initialized == true && this.context.drizzle.contracts.EventToken != undefined){
      return(
      <div>
      <TextField  id="number"
          label="Increase Deposit"
          type="number"
          margin="normal"
          inputRef={el => this.state.DepValue = el} ></TextField>
      <Button variant="fab" color="primary" aria-label="Add" onClick={this.handleClick}>
        <AddIcon />
      </Button>
      </div>
      )
    }
    else{
      return(
      <div>
      <TextField  id="number"
          label="Increase Deposit"
          type="number"
          margin="normal"
          inputRef={el => this.state.DepValue = el} ></TextField>

      <Button variant="fab" color="primary" aria-label="Add" onClick={this.handleClick}>
      </Button>
      </div>
      )
    }
  }
}

IncreaseSecurityDeposit.contextTypes = {
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

export default drizzleConnect(IncreaseSecurityDeposit, mapStateToProps)
