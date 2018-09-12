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
    if (this.props.drizzleStatus.initialized == true && this.context.drizzle.contracts.EventToken != undefined){
      return(
      <div>
        <SecurityDepForm contract="EventToken" method="approve" labels={[" Security Account", " Add Amount (ET)"]}/>
      </div>
      )
    }
    else{
      return(
      <div>
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
    drizzleStatus: state.drizzleStatus,
    web3: state.web3,
    contracts: state.contracts,
    units: "ETH"
  }
}

export default drizzleConnect(IncreaseSecurityDeposit, mapStateToProps)
