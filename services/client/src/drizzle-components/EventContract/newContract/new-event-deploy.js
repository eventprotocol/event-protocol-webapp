import { drizzleConnect } from 'drizzle-react';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import Snackbar from "@material-ui/core/Snackbar";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import FormControl from "@material-ui/core/FormControl";
import Web3 from 'web3';

import EventContract from "../../../data/EventContract.json";

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


const styles = {
	centerer1: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center"
	},

	centerer2: {
		maxWidth: "50%"
	},

	form:{
		maxWidth: "70%"
	},

	fullbutton: {
		width: "100%"
	}
}


class ContractForm extends Component {
	constructor(props, context) {
		super(props);

		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);

		this.inputs = [];
		this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
		this.openSnackbar = this.openSnackbar.bind(this);

		var initialState = {
			snackbarOpen: false,
			snackbarMessage: "",
		}

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

	handleSnackbarClose() {
		this.setState({
			snackbarOpen: false,
			snackbarMessage: ""
		});
	}

	openSnackbar(message) {
		this.setState({
			snackbarOpen: true,
			snackbarMessage: message
		});
	}

	handleSubmit() {
		console.log("Submit")
		console.log(this.state);

		web3.eth.getAccounts().then((res) => {
			console.log(res);
			var account = res[0];
			var eventName = this.state.eventName;
			var eventLocation = this.state.eventLocation;

			var eventDate_epoch = new Date(this.state.eventDate).getTime()/1000;
			var eventDate = eventDate_epoch;

			var buyer = this.state.buyer;
			var buyerEscrow = new BigNumber(this.state.buyerEscrow).times(Math.pow(10, 18));
			var sellerEscrow = new BigNumber(this.state.sellerEscrow).times(Math.pow(10, 18));
			var sellerAdvanceFee = new BigNumber(this.state.sellerAdvanceFee).times(Math.pow(10, 18));
			var sellerCancellationPenalty = new BigNumber(this.state.sellerCancellationPenalty).times(Math.pow(10, 18));
			var eventPaymentAmount = new BigNumber(this.state.eventPaymentAmount).times(Math.pow(10, 18));

			EventContractInst.methods.newEvent(eventName,
																				 eventLocation,
																				 eventDate,
																				 buyer,
																				 buyerEscrow,
																				 sellerEscrow,
																				 sellerAdvanceFee,
																				 sellerCancellationPenalty,
																				 eventPaymentAmount).send({from: account})
			.then((res) => {
				console.log(res);
				this.setState({
					snackbarOpen: true,
					snackbarMessage: "Success"
				});
			})
			.catch((err) => {
				console.log(err);
				this.setState({
					snackbarOpen: true,
					snackbarMessage: "Error"
				});
			})
		})
		.catch((err) => {
			console.log(err);
			this.setState({
				snackbarOpen: true,
				snackbarMessage: "Error"
			});
		});
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
			<div>
				<div style={styles.form} align="center">
					<form className ="pure-form pure-form-stacked">
						{this.inputs.map((input, index) => {
								var inputType = this.translateType(input.type);
								var inputLabel = this.props.labels ? this.props.labels[index] : input.name;
								let placeholder;

								// To check the phrasing and writing is correct
								if(inputLabel === "eventName") {
									inputLabel = "Event Name";
									placeholder = "Enter the name of the event";
								}

								if(inputLabel === "eventLocation") {
									inputLabel = "Event Location";
									placeholder = "Enter the location of the event";
								}

								if(inputLabel === "buyer") {
									inputLabel = "Buyer Address";
									placeholder = "Enter the Ethereum address of the buyer";
								}

								if(inputLabel === "buyerEscrow") {
									inputLabel = "Buyer Escrow (ET)";
									placeholder = "Enter the escrow amount for the buyer in ET";
								}

								if(inputLabel === "sellerEscrow") {
									inputLabel = "Seller Escrow (ET)";
									placeholder = "Enter the escrow amount for the seller in ET";
								}

								if(inputLabel === "sellerAdvanceFee") {
									inputLabel = "Seller Advance Fee";
									placeholder = "Enter the advance fee given to the seller in ET";
								}

								if(inputLabel === "sellerCancellationPenalty") {
									inputLabel = "Seller Cancellation Penalty";
									placeholder = "Enter the penalty fee for the seller if seller cancels in ET";
								}

								if(inputLabel === "eventPaymentAmount") {
									inputLabel = "Event Payment Amount"
									placeholder = "Enter the payment amount for successful completion of the event in ET"
								}

								if (input.name === "eventDate"){
									inputLabel = "Date Of Event";
									inputType = "date";
									placeholder = "";
								}

								// check if input type is struct and if so loop out struct fields as well
								return (
									<div className="form" key={"form-" + index}>
										<FormControl margin="normal" required={true} fullWidth={true}>
											<InputLabel htmlFor={input.name} shrink>
												{inputLabel}
											</InputLabel>
											<Input
												id={input.name}
												key={input.name}
												name={input.name}
												type={inputType}
												value={this.state[input.name]}
												onChange={this.handleInputChange}
												placeholder={placeholder}
											/>
										</FormControl>
									</div>
								)
						})}
						<br /><br />
						<div align="center">
							<Button variant="contained" color="primary" onClick={this.handleSubmit}>
								Create Event  <AddIcon/>
							</Button>
						</div>
						<br /><br />
					</form>
				</div>

				<div className="container" style={styles.centerer1}>
					<div className="container" style={styles.centerer2}>
						<Snackbar
							anchorOrigin={{horizontal: "right", vertical: "bottom" }}
							message={this.state.snackbarMessage}
							autoHideDuration={3000}
							onClose={this.handleSnackbarClose}
							open={this.state.snackbarOpen}
						/>
					</div>
				</div>
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
		drizzleStatus: state.drizzleStatus
	}
}

export default drizzleConnect(ContractForm, mapStateToProps)
