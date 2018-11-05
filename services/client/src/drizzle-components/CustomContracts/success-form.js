import { drizzleConnect } from 'drizzle-react'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import green from '@material-ui/core/colors/green';
/*
 * Create component.
 */

class ContractForm extends Component {
  constructor(props, context) {
    super(props);

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.contracts = context.drizzle.contracts;
    //this.state._
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
    console.log(this.state);
  }

  handleSubmit() {
    this.state.val = 1;
    if (this.props.sendArgs) {
      return this.contracts[this.props.contract].methods[this.props.method].cacheSend(...Object.values(this.state), this.props.sendArgs);
    }

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
    return (
      <div align="center">
      <form className ="pure-form pure-form-stacked">
        {this.inputs.map((input, index) => {
            var inputType = this.translateType(input.type)
            var inputLabel = this.props.labels ? this.props.labels[index] : input.name

            if (input.name === "val"){
              inputType = "hidden";
            }

            // check if input type is struct and if so loop out struct fields as well
            return (
              <div float="left">
              <input key={input.name}
              type={inputType}
              name={input.name}
              value={this.state[input.name]}
              placeholder={inputLabel}
              onChange={this.handleInputChange}
              />
              </div>
            )
        })}
        <div align="center">
          <Button variant="outlined" color="default" onClick={this.handleSubmit}>
          REPORT SUCCESS
          </Button>
        </div>
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
    drizzleStatus: state.drizzleStatus,
    accounts: state.accounts,
  }
}

export default drizzleConnect(ContractForm, mapStateToProps)
