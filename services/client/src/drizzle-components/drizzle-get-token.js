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
	_isMounted = false;

	constructor(props, context) {
		super(props);


		this.state = {
			ET: -1,
		}
	}

	componentDidMount() {
		this._isMounted = true;

		EventTokenContract.methods.balanceOf(this.props.account).call()
		.then((res) => {
			if (this._isMounted) {
				var ETValue = res;
				ETValue = ETValue / Math.pow(10,18)
				var modified = ETValue
				this.setState({
					ET: ETValue
				})
			}
		})
		.catch((err) => {
			console.log(err)
		});
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	render() {
		return(
			<span>{this.state.ET}</span>
		)
	}
}



export default GetToken;