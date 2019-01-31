import { drizzleConnect } from 'drizzle-react'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
/*
 * Create component.
 */
var BigNumber = require('bignumber.js');

class ContractForm extends Component {
  constructor(props, context) {
    super(props);

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.contracts = context.drizzle.contracts;

    // Get the contract ABI
    console.log("target", this.contracts)
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
    newState._value = new BigNumber(newState._value).times(Math.pow(10, 18));
    this.state._value = "";
    if (this.props.sendArgs) {
      return this.contracts[this.props.contract].methods[this.props.method].cacheSend(...Object.values(newState), this.props.sendArgs);
    }

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
    console.log(this.props.drizzleStatus)
    return (
      <div align="center">
      <form className ="pure-form pure-form-stacked">
        {this.inputs.map((input, index) => {
            var inputType = this.translateType(input.type)
            var inputLabel = this.props.labels ? this.props.labels[index] : input.name

            // Hardcode the security account address and dont show this field
            if (input.name === "_spender"){
              inputType = "hidden";
              this.state[input.name] = "0x1948072CD04b93F4a8BAFaaEf8B19166F03AF8d6"
            }
            // check if input type is struct and if so loop out struct fields as well
            return (
              <TextField key={input.name}
              type={inputType}
              name={input.name}
              value={this.state[input.name]}
              placeholder={inputLabel}
              onChange={this.handleInputChange}
              />
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
