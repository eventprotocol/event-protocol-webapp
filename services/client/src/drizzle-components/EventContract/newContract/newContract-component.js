import { drizzleConnect } from 'drizzle-react'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import WalletCard from '../../../custom-components/Card/WalletCard.jsx'
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import Loading from "@material-ui/icons/CloudUpload"

//import form details
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';

import EventContract from '../../../data/EventContract.json'

var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/JRIhcMSUX50sCH9PKk6b'));
var myContract = new web3.eth.Contract(EventContract.abi);
var BigNumber = require('bignumber.js');
let scalar = new BigNumber(10).pow(18);
console.log(scalar.toNumber());

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  dense: {
    marginTop: 16,
  },
  menu: {
    width: 200,
  },
});

const currencies = [
  {
    value: '0',
    label: '0',
  },
  {
    value: '1',
    label: '1',
  },
  {
    value: '2',
    label: '2',
  }
];


class NewContract extends Component{
  constructor(props, context){
    super(props);
  }

  state = {
    eventName: '',
    eventLocation: '',
    eventDate: '',
    buyer: '',
    postponements: '',
    buyerEscrow: '',
    sellerEscrow: '',
    sellerAdvance: '',
    sellerCancellation: '',
    buyerContributionPool: '',
    sellerContributionPool: '',
    eventPayment: '',
    etAddress: '0x24eeac4f88412dc27f4b802ea8eb8b4725cf3af8',
    etTokenAddress: '0x38dFdB8658f05113E5d2F97E2A79e253132c2e4C'
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  onSubmit = e => {
    e.preventDefault();
    var eventDate_epoch = new Date(this.state.eventDate).getTime()/1000;
    console.log(eventDate_epoch);
    console.log(this.state);

    myContract.deploy({
      data: EventContract.bytecode,
      arguments: [this.state.eventName,
      this.state.eventLocation,
      new BigNumber(eventDate_epoch).toNumber(),
      this.state.buyer,
      this.state.postponements,
      new BigNumber(this.state.buyerEscrow).times(scalar).toNumber(),
      new BigNumber(this.state.sellerEscrow).times(scalar).toNumber(),
      new BigNumber(this.state.sellerAdvance).times(scalar).toNumber(),
      new BigNumber(this.state.sellerCancellation).times(scalar).toNumber(),
      new BigNumber(this.state.buyerContributionPool).times(scalar).toNumber(),
      new BigNumber(this.state.sellerContributionPool).times(scalar).toNumber(),
      new BigNumber(this.state.eventPayment).times(scalar).toNumber(),
      this.state.etAddress,
      this.state.etTokenAddress]
      })
      .send({
          from: this.props.accounts[0],
          //gas: 15000000,
          //gasPrice: '300000000000'
      })
      .then(function(newContractInstance){
          console.log(newContractInstance.options.address) // instance with the new contract address
      });

      this.setState({
        eventName: '',
        eventLocation: '',
        eventDate: '',
        buyer: '',
        postponements: '',
        buyerEscrow: '',
        sellerEscrow: '',
        sellerAdvance: '',
        sellerCancellation: '',
        buyerContributionPool: '',
        sellerContributionPool: '',
        eventPayment: '',
      });

    };

  render(){

    if (this.props.drizzleStatus.initialized == true && this.props.contracts.EventContract != undefined){
      web3.currentProvider = web3.givenProvider

      console.log(window.web3);
      return(
      <div align = "center">
        <form Validate autoComplete="on">
          <TextField
            required
            fullWidth
            id="outlined-full-width"
            label="Event Name"
            value={this.state.eventName}
            onChange={this.handleChange('eventName')}
            variant="outlined"
            style={{ margin: 8 }}
            InputLabelProps={{
              shrink: true,
            }}
            helperText="Name of the event, i.e. John Hopkins Concert"
          />

          <br/>
          <br/>
          <br/>

          <TextField
            required
            fullWidth
            id="outlined-full-width"
            label="Event Location"
            value={this.state.eventLocation}
            onChange={this.handleChange('eventLocation')}
            variant="outlined"
            style={{ margin: 8 }}
            InputLabelProps={{
              shrink: true,
            }}
            helperText="Location of the event. i.e. SUTD, Singapore"
          />

          <br/>
          <br/>
          <br/>

          <TextField
            required
            fullWidth
            type="date"
            id="outlined-full-width"
            label="Event Date and Time"
            value={this.state.eventDate}
            onChange={this.handleChange('eventDate')}
            defaultValue="2017-05-24T10:30"
            variant="outlined"
            style={{ margin: 8 }}
            InputLabelProps={{
              shrink: true,
            }}
            helperText="Date and Time of event"
          />

          <br/>
          <br/>
          <br/>

          <TextField
            required
            fullWidth
            id="outlined-full-width"
            label="Buyer"
            value={this.state.buyer}
            onChange={this.handleChange('buyer')}
            variant="outlined"
            style={{ margin: 8 }}
            InputLabelProps={{
              shrink: true,
            }}
            helperText="Ethereum Address of the Buyer"
          />

          <br/>
          <br/>
          <br/>

          <TextField
          id="outlined-full-width"
          select
          fullWidth
          required
          type="number"
          label="Postponements"
          value={this.state.postponements}
          style={{ margin: 8 }}
          onChange={this.handleChange('postponements')}
          InputLabelProps={{
            shrink: true,
          }}
          helperText="Maximum Number of Postponements"
          variant="outlined"
        >
          {currencies.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </TextField>

          <br/>
          <br/>
          <br/>

          <TextField
            required
            fullWidth
            id="outlined-full-width"
            label="Buyer Escrow"
            value={this.state.buyerEscrow}
            onChange={this.handleChange('buyerEscrow')}
            variant="outlined"
            style={{ margin: 8 }}
            InputLabelProps={{
              shrink: true,
            }}
            type= "number"
            helperText="Buyer Escrow Amount"
          />

          <br/>
          <br/>
          <br/>

          <TextField
            required
            fullWidth
            id="outlined-full-width"
            label="Seller Escrow"
            value={this.state.sellerEscrow}
            onChange={this.handleChange('sellerEscrow')}
            variant="outlined"
            style={{ margin: 8 }}
            InputLabelProps={{
              shrink: true,
            }}
            type= "number"
            helperText="Seller Escrow Amount"
          />

          <br/>
          <br/>
          <br/>

          <TextField
            required
            fullWidth
            id="outlined-full-width"
            label="Seller Advance"
            value={this.state.sellerAdvance}
            onChange={this.handleChange('sellerAdvance')}
            variant="outlined"
            style={{ margin: 8 }}
            InputLabelProps={{
              shrink: true,
            }}
            type= "number"
            helperText="Seller Advance Fee in ET"
          />

          <br/>
          <br/>
          <br/>

          <TextField
            required
            fullWidth
            id="outlined-full-width"
            label="Seller Cancellation Amount"
            value={this.state.sellerCancellation}
            onChange={this.handleChange('sellerCancellation')}
            variant="outlined"
            style={{ margin: 8 }}
            InputLabelProps={{
              shrink: true,
            }}
            type= "number"
            helperText="Seller Cancellation Fee in ET"
          />

          <br/>
          <br/>
          <br/>

          <TextField
            required
            fullWidth
            id="outlined-full-width"
            label="Buyer Contribution Pool"
            value={this.state.buyerContributionPool}
            onChange={this.handleChange('buyerContributionPool')}
            variant="outlined"
            style={{ margin: 8 }}
            InputLabelProps={{
              shrink: true,
            }}
            type= "number"
            helperText="Buyer Contribution Pool in ET"
          />

          <br/>
          <br/>
          <br/>

          <TextField
            required
            fullWidth
            id="outlined-full-width"
            label="Seller Contribution Pool"
            value={this.state.sellerContributionPool}
            onChange={this.handleChange('sellerContributionPool')}
            variant="outlined"
            style={{ margin: 8 }}
            InputLabelProps={{
              shrink: true,
            }}
            type= "number"
            helperText="Seller Contribution Pool in ET"
          />

          <br/>
          <br/>
          <br/>

          <TextField
            required
            fullWidth
            id="outlined-full-width"
            label="Event Amount"
            value={this.state.eventPayment}
            onChange={this.handleChange('eventPayment')}
            variant="outlined"
            style={{ margin: 8 }}
            InputLabelProps={{
              shrink: true,
            }}
            type= "number"
            helperText="Event Payment Amount in ET"
          />

          <br/>
          <br/>
          <br/>

          <TextField
            required
            fullWidth
            disabled
            id="outlined-full-width"
            label="Event Protocol Address"
            value={this.state.etAddress}
            onChange={this.handleChange('etAddress')}
            variant="outlined"
            style={{ margin: 8 }}
            InputLabelProps={{
              shrink: true,
            }}
            helperText="Event Protocol Payment Address"
          />

          <br/>
          <br/>
          <br/>

          <TextField
            required
            fullWidth
            disabled
            id="outlined-full-width"
            label="Event Token Contract Address"
            value={this.state.etTokenAddress}
            onChange={this.handleChange('etTokenAddress')}
            variant="outlined"
            style={{ margin: 8 }}
            InputLabelProps={{
              shrink: true,
            }}
            helperText="Event Token Contract Rinkeby Deployment Address"
          />

          <br/>
          <br/>
          <br/>

          <Button onClick={e => this.onSubmit(e)} variant="outlined" color="primary">
            Generate Contract
          </Button>

        </form>
      </div>
      )
    }

    else{
      return(
      <div align="center">
        <form className="pure-form pure-form-stacked">
            <input placeholder="Loading"
            />
        </form>
      </div>
      )
    }
  }
}

NewContract.contextTypes = {
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

export default withStyles(styles)(drizzleConnect(NewContract, mapStateToProps))
