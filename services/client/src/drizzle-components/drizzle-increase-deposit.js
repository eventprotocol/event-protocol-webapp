import { drizzleConnect } from 'drizzle-react'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import SecurityDepositComponent from "../drizzle-components/drizzle-contract-data-fetcher.js";
import EventToken from "../data/EventToken.json";
import NameCard from '../custom-components/Card/NameCard.jsx'
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import SecurityDepForm from "../drizzle-components/drizzle-increase-security-deposit-form.js"


class IncreaseSecurityDeposit extends Component{
  constructor(props, context){
    super(props);
  }

  render(){
    if (this.props.drizzleStatus.initialized == true && this.props.web3.status == "initialized"){
      return(
      <div>
        <SecurityDepForm contract="EventToken" method="approve" labels={[" Security Account", " Add Deposit (ET)"]} sendArgs={{from: this.props.accounts[0]}}/>
      </div>
      )
    }
    else{
      return(
      <div>
        <h1>Hello World</h1>
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
    contracts: state.contracts,
    units: "ETH"
  }
}

export default drizzleConnect(IncreaseSecurityDeposit, mapStateToProps)
