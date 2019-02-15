import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import FormControl from "@material-ui/core/FormControl";

import Web3 from 'web3';
import EventContract from "../../data/EventContract.json";

var BigNumber = require('bignumber.js');

// get abi
let abi = EventContract.abi;
// get address at rinkeby "4"
let contractAddress = EventContract.networks['4'].address;

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
const EventContractInst = new web3.eth.Contract(abi, contractAddress);


function getModalStyle() {
	const top = 50;
	const left = 50;

	return {
		top: `${top}%`,
		left: `${left}%`,
		transform: `translate(-${top}%, -${left}%)`,
	};
}

const styles = theme => ({
	paper: {
		position: 'absolute',
		width: "70%",
		backgroundColor: theme.palette.background.paper,
		boxShadow: theme.shadows[5],
		padding: "20px",
		outline: 'none',
	},
	centerer1: {
		display: "flex",
		"align-items": "center",
		"justify-content": "center"
	},

	centerer2: {
		"max-width": "50%"
	},

	fullbutton: {
		width: "100%"
	}
});

class ModalFunction extends React.Component {
	constructor(props) {
		super(props);

    	this.handleChange = this.handleChange.bind(this);
    	this.handleSubmitSeller = this.handleSubmitSeller.bind(this);
    	this.handleSubmitBuyer = this.handleSubmitBuyer.bind(this);
    	this.handleCancelEvent = this.handleCancelEvent.bind(this);
    	this.handleCompleteEvent = this.handleCompleteEvent.bind(this);

		var initialState = {
			buyerValue: "",
			sellerValue: "",
		}

		this.state = initialState;
	}

	handleSubmitBuyer() {
		web3.eth.getAccounts().then((res) => {
			var account = res[0];
			var buyerValue = this.state.buyerValue;
			var buyerValueConv = new BigNumber(buyerValue).times(Math.pow(10, 18));

			EventContractInst.methods.tokenFallback(account, buyerValueConv, this.props.id).send({from: account}).then((res) => {
				console.log(res);
			}).catch((err) => {
				console.log(err);
			})

		}).catch((err) => {
			console.log(err);
		})

	}

	handleSubmitSeller() {
		web3.eth.getAccounts().then((res) => {
			var account = res[0];
			var sellerValue = this.state.sellerValue;
			var sellerValueConv = new BigNumber(sellerValue).times(Math.pow(10, 18));

			EventContractInst.methods.tokenFallback(account, sellerValueConv, this.props.id).send({from: account}).then((res) => {
				console.log(res);
			}).catch((err) => {
				console.log(err);
			});

		}).catch((err) => {
			console.log(err);
		});

	}

	handleCancelEvent() {
		web3.eth.getAccounts().then((res) => {
			var account = res[0];
			EventContractInst.methods.resolveEvent(this.props.id, 2).send({from: account}).then((res) => {
				console.log(res);
			}).catch((err) => {
				console.log(err);
			});
		}).catch((err) => {
			console.log(err);
		})
	}

	handleCompleteEvent() {
		web3.eth.getAccounts().then((res) => {
			var account = res[0];
			EventContractInst.methods.resolveEvent(this.props.id, 1).send({from: account}).then((res) => {
				console.log(res);
			}).catch((err) => {
				console.log(err);
			});
		}).catch((err) => {
			console.log(err);
		})
	}

	handleChange(event) {
		this.setState({
			[event.target.name]: event.target.value,
		});
	}

	render() {
		const { classes } = this.props;

		// console.log("Event Status: ", this.props.status)

		return (
			<div>
				<Modal
					aria-labelledby="simple-modal-title"
					aria-describedby="simple-modal-description"
					open={this.props.open}
					onClose={this.props.onClose}
				>
					<div>
						<div style={getModalStyle()} className={classes.paper}>
							<Typography variant="title" component="h3" id="modal-title">
								Contract Functions
							</Typography>
							<div style={{display: this.props.isBuyer ? 'inline' : 'none'}}>
								<p>Buyer Activation Amount: {this.props.buyerActAmount} ET</p> {/* To dynamically load this value*/}
								<p>Input the activation amount above to activate the contract as a buyer. This is irreversible.</p>

								<FormControl fullWidth={true} >
									<InputLabel htmlFor="buyer_value">
										Buyer Activation Amount
									</InputLabel>
									<Input
										id="buyerValue"
										name="buyerValue"
										value={this.state.buyerValue}
										onChange={this.handleChange}
										placeholder="Input the activation amount above to activate the contract. This is irreversible."
										type="number"
									/>
								</FormControl>
								<br />
								<br />
								<Button variant="outlined" onClick={this.handleSubmitBuyer}>Activate Contract (Buyer)</Button>
							</div>
							<div style={{display: this.props.isSeller ? 'inline' : 'none'}}>
								<br />
								<p>Seller Activation Amount: {this.props.sellerActAmount} ET</p> {/* To dynamically load this value*/}
								<p>Input the activation amount above to activate the contract as a seller. This is irreversible.</p>

								<FormControl fullWidth={true} >
									<InputLabel htmlFor="seller_value">
										Seller Activation Amount
									</InputLabel>
									<Input
										id="sellerValue"
										name="sellerValue"
										value={this.state.sellerValue}
										onChange={this.handleChange}
										placeholder="Input the activation amount above to activate the contract. This is irreversible."
										type="number"
									/>
								</FormControl>
								<br />
								<br />
								<Button variant="outlined" onClick={this.handleSubmitSeller}>Activate Contract (Seller)</Button>
							</div>

							<br />
							<br />
							<br />
							<Button variant="contained" color="primary" onClick={this.handleCompleteEvent}>Event Completed</Button>
							<br />
							<br />
							<Button variant="contained" color="secondary" onClick={this.handleCancelEvent}>Cancel Event</Button>
							<br />
							<br />
						</div>

						<SimpleModalWrapped />
					</div>
				</Modal>
			</div>
		);
	}
}

ModalFunction.propTypes = {
	classes: PropTypes.object.isRequired,
};

// We need an intermediary variable for handling the recursive nesting.
const SimpleModalWrapped = withStyles(styles)(ModalFunction);

export default SimpleModalWrapped;