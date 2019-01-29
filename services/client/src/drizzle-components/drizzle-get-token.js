import { drizzleConnect } from 'drizzle-react';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Web3 from 'web3';

import EventToken from "../data/EventToken.json";

// get abi
let abi = EventToken.abi;
// get address at rinkeby "4"
let contractAddress = EventToken.networks['4'].address;

let web3;

// setup the system
if (typeof window !== "undefined" && typeof window.web3 !== "undefined") {
  // We are in the browser and metamask is running.
  web3 = new Web3(window.web3.currentProvider);
} else {
  // We are on the server *OR* the user is not running metamask
  const provider = new Web3.providers.HttpProvider(
    "https://rinkeby.infura.io/orDImgKRzwNrVCDrAk5Q"
  );
  web3 = new Web3(provider);
}
const EventTokenContract = new web3.eth.Contract(abi, contractAddress)

class GetToken extends Component {
	constructor(props, context) {
		super(props);


		this.state = {
			ET: -1,
		}
	}

	componentDidMount() {
		EventTokenContract.methods.balanceOf(this.props.account).call()
		.then((res) => {
			var ETValue = res;
			ETValue = ETValue / Math.pow(10,18)
			var modified = ETValue
			this.setState({
				ET: ETValue
			})
		});
	}




	// render() {
	// 	this.dataKey = this.props.contracts.EventToken.methods.balanceOf.cacheCall(this.props.account);
	// 	if(this.state.hasError) {
	// 		// If we have previously fetched values into the state return previous state
	// 		if(this.state.ET !== -1) {
	// 			return (
	// 				<span>{ this.state.ET }</span>
	// 			)
	// 		} else {
	// 			return (
	// 				<span>Error</span>
	// 			)
	// 		}
	// 	} else {
	// 		if(this.props.drizzleStatus.initialized) {
	// 			var data = this.props.contracts.EventToken.methods.balanceOf[this.dataKey].value;
	// 			this.setState({
	// 				ET: data
	// 			})

	// 			return(
	// 				<div>{ this.state.ET }</div>
	// 			)
	// 		}

	// 		if(this.state.ET !== -1) {
	// 			return (
	// 				<span>{ this.state.ET }</span>
	// 			)
	// 		} else {
	// 			return (
	// 				<span>Error</span>
	// 			)
	// 		}
	// 	}
	render() {
		return(
			<span>{this.state.ET}</span>
		)
	}
}



export default GetToken;