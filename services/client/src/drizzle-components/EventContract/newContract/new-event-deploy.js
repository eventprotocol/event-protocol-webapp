import { drizzleConnect } from 'drizzle-react'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
/*
 * Create component.
 */

var BigNumber = require('bignumber.js');
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/JRIhcMSUX50sCH9PKk6b'));

class ContractForm extends Component {
  constructor(props, context) {
    super(props);

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.contracts = context.drizzle.contracts;

    // Get the contract ABI
    const abi = this.contracts[this.props.contract].abi;

    this.inputs = [];
    var initialState = {};

    // Iterate over abi for correct function.
    for (var i = 0; i < abi.length; i++) {
        if (abi[i].name === this.props.method) {
            this.inputs = abi[i].inputs;

            for (var i = 0; i < this.inputs.length; i++) {
                initialState[this.inputs[i].name] = '';
            }

            break;
        }
    }

    this.state = initialState;

  }

  handleSubmit() {
    let newState = Object.assign({}, this.state);;
    newState.buyerEscrow = new BigNumber(newState.buyerEscrow).times(Math.pow(10, 18))
    newState.sellerEscrow = new BigNumber(newState.sellerEscrow).times(Math.pow(10, 18))
    newState.eventPaymentAmount = new BigNumber(newState.eventPaymentAmount).times(Math.pow(10, 18))
    newState.sellerAdvanceFee = new BigNumber(newState.sellerAdvanceFee).times(Math.pow(10, 18))
    newState.sellerCancellationPenalty = new BigNumber(newState.sellerCancellationPenalty).times(Math.pow(10, 18))

    var eventDate_epoch = new Date(this.state.eventDate).getTime()/1000;
    newState.eventDate = eventDate_epoch;


    if (this.props.sendArgs) {
      return this.contracts[this.props.contract].methods[this.props.method].cacheSend(...Object.values(newState), this.props.sendArgs);
    }
    console.log(newState)

    this.contracts[this.props.contract].methods[this.props.method].cacheSend(...Object.values(newState));
  }

  handleInputChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  translateType(type) {
    switch(true) {
        case /^uint/.test(type):
            return 'number'
            break
        case /^string/.test(type) || /^bytes/.test(type):
            return 'text'
            break
        case /^bool/.test(type):
            return 'checkbox'
            break
        default:
            return 'text'
    }
  }

  render() {
    web3.currentProvider = web3.givenProvider
    return (
      <div align="center">
      <form className ="pure-form pure-form-stacked">
        {this.inputs.map((input, index) => {
            var inputType = this.translateType(input.type)
            var inputLabel = this.props.labels ? this.props.labels[index] : input.name

            if (input.name == "eventDate"){
              inputType = "date";
            }
            // check if input type is struct and if so loop out struct fields as well
            return (
              <div>
                <input
                  stlye={}
                  key={input.name}
                  type={inputType}
                  name={input.name}
                  value={this.state[input.name]}
                  placeholder={inputLabel}
                  onChange={this.handleInputChange}
                />
                <br></br>
                <br></br>
              </div>
            )
        })}
        <br></br>
        <br></br>
        <div align="center"><Button variant="fab" color="primary" aria-label="Add" onClick={this.handleSubmit}><AddIcon/></Button></div>
        <br></br>
      </form>
      </div>
    )
  }
}

ContractForm.contextTypes = {
  drizzle: PropTypes.object
}

/*
 * Export connected component.
 */

const mapStateToProps = state => {
  return {
    contracts: state.contracts,
    drizzleStatus: state.drizzleStatus
  }
}

export default drizzleConnect(ContractForm, mapStateToProps)
