import { drizzleConnect } from 'drizzle-react'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import SecurityDepositComponent from "../drizzle-components/drizzle-contract-data-fetcher.js";
import EventToken from "../data/EventToken.json";
import NameCard from '../custom-components/Card/NameCard.jsx'
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import SecurityIcon from "@material-ui/icons/SecurityTwoTone";
import ProgressBar from '../custom-components/Progress-components/CircularBar.js'
import SendIcon from '@material-ui/icons/Send';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import AccountCircle from '@material-ui/icons/AccountCircle';

import Icon from '@material-ui/icons/Send';
import Card from "@material-ui/core/Card";
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import green from '@material-ui/core/colors/green';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
/*
 * Create component.
 */

class GetAllowanceComponent extends Component {
  constructor(props, context) {
    super(props);
    this.state = {
      spender: null,
      val: "",
      btColor: "primary"
    };
    this.precisionRound = this.precisionRound.bind(this);
    this.convertToEther = this.convertToEther.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  precisionRound(number, precision) {
    var factor = Math.pow(10, precision)
    return Math.round(number * factor) / factor
  }

  convertToEther(number){
    return number/(Math.pow(10, 18));
  }

  handleInputChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit() {

    if(Object.keys(this.props.accounts).length === 0) {
        console.log("Error");
    }

    var myComponent = <SecurityDepositComponent contract="EventToken" method="allowance" methodArgs={[this.props.accounts[0], this.state.spender, {from: this.props.accounts[0]}]} />
    this.state.val = myComponent;

  }

  render() {
    // No accounts found.
    if (this.props.drizzleStatus.initialized === true && this.context.drizzle.contracts.EventToken !== undefined){
      return (
        <div align="center">

        <form className="pure-form pure-form-stacked">
                <input key="d"
                type="text"
                name="spender"
                value = {this.state.spender}
                placeholder= " Ethereum Address"
                onChange={this.handleInputChange}
                />
                <br></br>
                <br></br>
                <div align="center">
          <Button variant="fab" color={this.state.btColor} aria-label="Add" onClick={this.handleSubmit}><SendIcon/></Button></div>
        </form>
        <br/>

        <Paper> <Typography variant="headline" component="h3">
          {this.state.val}
        </Typography>
        </Paper>
        <br/>
        </div>

      );
    }
    else{
      return(
        <div align="center">
          <form className="pure-form pure-form-stacked">
                  <input key="d"
                  type="text"
                  name="spender"
                  value = {this.state.spender}
                  placeholder= "Ethereum Address"
                  onChange={this.handleInputChange}
                  />
                  <br></br>
                  <br></br>
                  <div align="center">
            <Button><CircularProgress style={{ color: green[500] }} thickness={10} /></Button></div>
          </form>
          <LinearProgress variant="query" value = "1"/>
          <br/>
          <br/>
          <br/>
        </div>
      )
    }
  }
}

GetAllowanceComponent.contextTypes = {
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

export default drizzleConnect(GetAllowanceComponent, mapStateToProps)
