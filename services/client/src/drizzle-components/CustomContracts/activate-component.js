import { drizzleConnect } from 'drizzle-react'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import EventToken from "../../data/EventToken.json";
import NameCard from '../../custom-components/Card/NameCard.jsx'
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import ActivateForm from "./activate-form.js"
import Loading from "@material-ui/icons/CloudUpload"


class IncreaseSecurityDeposit extends Component{
  constructor(props, context){
    super(props);
  }

  render(){
    if (this.props.drizzleStatus.initialized == true && this.props.contracts.EventToken != undefined){
      return(
      <div align = "center">
        <ActivateForm contract="EventToken" method="transferToContract" myVal={this.props.myVal} labels={[" Recipient Address", " Activation Amount (ET)", " Contract ID"]} sendArgs={{from: this.props.accounts[0], gas:1000000}}/>
      </div>
      )
    }
    else{
      return(
      <div align="center">
        <form className="pure-form pure-form-stacked">
            <input placeholder="Loading"
            />
          <Button variant="fab" color="primary" aria-label="Add"><Loading/></Button>
        </form>
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
  }
}

export default drizzleConnect(IncreaseSecurityDeposit, mapStateToProps)
