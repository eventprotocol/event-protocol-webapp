import { drizzleConnect } from 'drizzle-react'
import React, { Component } from 'react'
import PropTypes from 'prop-types'


/*
 * Create component.
 */

class ContractData extends Component {
  constructor(props, context) {
    super(props)

    this.contracts = context.drizzle.contracts

    // Get the contract ABI
    //const abi = this.contracts[this.props.contract].abi;

    // Fetch initial value from chain and return cache key for reactive updates.
    var methodArgs = this.props.methodArgs ? this.props.methodArgs : []
    this.dataKey = this.contracts[this.props.contract].methods[this.props.method].cacheCall(...methodArgs)
  }

  render() {
    // Contract is not yet intialized.
    if(!this.props.contracts[this.props.contract].initialized) {
      return (
        <span>Initalizing</span>
      )
    }

    // If the cache key we received earlier isn't in the store yet; the initial value is still being fetched.
    if(!(this.dataKey in this.props.contracts[this.props.contract][this.props.method])) {
      return (
        <span>Fetching</span>
      )
    }

    // Show a loading spinner for future updates.
    var pendingSpinner = this.props.contracts[this.props.contract].synced ? '' : ' 🔄'

    // Optionally hide loading spinner (EX: ERC20 token symbol).
    if (this.props.hideIndicator) {
      pendingSpinner = '🔄'
    }

    var displayData = this.props.contracts[this.props.contract][this.props.method][this.dataKey].value

    // Optionally convert to UTF8
    if (this.props.toUtf8) {
      displayData = this.context.drizzle.web3.utils.hexToUtf8(displayData)
    }

    // Optionally convert to Ascii
    if (this.props.toAscii) {
      displayData = this.context.drizzle.web3.utils.hexToAscii(displayData)
    }

    // If return value is an array
    if (typeof displayData === 'array') {
      const displayListItems = displayData.map((datum, index) => {
        <li key={index}>{`${datum}`}{pendingSpinner}</li>
      })

      return(
        <ul>
          {displayListItems}
        </ul>
      )
    }

    // If retun value is an object
    if (typeof displayData === 'object') {
      var i = 0
      const displayObjectProps = []

      Object.keys(displayData).forEach((key) => {
        if (i != key) {
          displayObjectProps.push(<li key={i}>
            <strong>{key}</strong>{pendingSpinner}<br/>
            {`${displayData[key]}`}
          </li>)
        }

        i++
      })


      return(
        <ul>
          {displayObjectProps}
        </ul>
      )
    }

    // This is to map the state
    if (this.props.method == "getEventState"){
      displayData = parseInt(displayData);
      var result;
      switch (displayData){
        case 0:
          result = "Inactive";
          break;
        case 1:
          result = "Active";
          break;
        case 2:
          result = "Postponed";
          break;
        case 3:
          result = "Cancelled";
          break;
        case 4:
          result = "Report";
          break;
        case 5:
          result = "Disputed";
          break;
        default:
          result = "Settled";
      }
      return(
        result
      )
    }

    // This is to convert epoch to Date
    if (this.props.method == "getEventDate"){
      var result = new Date(0);
      result.setUTCSeconds(parseInt(displayData));
      return result.toString().slice(0, -14);
    }

    // This is to remove the decimels for allowance
    if (this.props.method == "allowance"){
      var a = parseInt(displayData)/Math.pow(10, 18);
      var factor = Math.pow(10, 2);
      displayData = Math.round(a * factor) / factor
      return(
        <span>{displayData}</span>
      )
    }

    // This is to convert epoch to Date
    if (this.props.method == "getBuyer" | this.props.method == "getSeller"){
      var result1 = displayData.slice(0, 4);
      var result2 = displayData.slice(-4, -1);
      return result1 +".." + result2;
    }


    return(
      <span>{`${displayData}`}{pendingSpinner}</span>
    )
  }
}

ContractData.contextTypes = {
  drizzle: PropTypes.object
}

/*
 * Export connected component.
 */

const mapStateToProps = state => {
  return {
    contracts: state.contracts,
  }
}

export default drizzleConnect(ContractData, mapStateToProps)
