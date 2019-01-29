import { drizzleConnect } from 'drizzle-react';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import Snackbar from "@material-ui/core/Snackbar";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import FormControl from "@material-ui/core/FormControl";



/*
 * Create component.
 */

var BigNumber = require('bignumber.js');
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/JRIhcMSUX50sCH9PKk6b'));

const styles = {
	centerer1: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center"
	},

	centerer2: {
		maxWidth: "50%"
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

		this.contracts = context.drizzle.contracts;

		// Get the contract ABI
		const abi = this.contracts[this.props.contract].abi;

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
		let newState = {};
		console.log("Submit")
		try {
			newState.eventName = this.state.eventName;
			newState.eventLocation = this.state.eventLocation;
			newState.buyer = this.state.buyer;
			newState.buyerEscrow = new BigNumber(this.state.buyerEscrow).times(Math.pow(10, 18));
			newState.sellerEscrow = new BigNumber(this.state.sellerEscrow).times(Math.pow(10, 18));
			newState.eventPaymentAmount = new BigNumber(this.state.eventPaymentAmount).times(Math.pow(10, 18));
			newState.sellerAdvanceFee = new BigNumber(this.state.sellerAdvanceFee).times(Math.pow(10, 18));
			newState.sellerCancellationPenalty = new BigNumber(this.state.sellerCancellationPenalty).times(Math.pow(10, 18));

			var eventDate_epoch = new Date(this.state.eventDate).getTime()/1000;
			newState.eventDate = eventDate_epoch;


			if (this.props.sendArgs) {
				return this.contracts[this.props.contract].methods[this.props.method].cacheSend(...Object.values(newState), this.props.sendArgs);
			}
			console.log(newState)

			this.contracts[this.props.contract].methods[this.props.method].cacheSend(...Object.values(newState));

			this.setState({
				snackbarOpen: true,
				snackbarMessage: "Success"
			});

		}
		catch(error) {
			console.log(error);
			this.setState({
				snackbarOpen: true,
				snackbarMessage: "Error"
			});
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
		web3.currentProvider = web3.givenProvider
		return (
			<div>
				<div align="center">
					<form className ="pure-form pure-form-stacked">
						{this.inputs.map((input, index) => {
								var inputType = this.translateType(input.type);
								var inputLabel = this.props.labels ? this.props.labels[index] : input.name;
								let placeholder;
								let disableAnimation

								// To check the phrasing and writing is correct
								if(inputLabel === "eventName") {
									inputLabel = "Event Name";
									placeholder = "Enter the name of the event";
									disableAnimation = false;
								}

								if(inputLabel === "eventLocation") {
									inputLabel = "Event Location";
									placeholder = "Enter the location of the event";
									disableAnimation = false
								}

								if(inputLabel === "buyer") {
									inputLabel = "Buyer Address";
									placeholder = "Enter the Ethereum address of the buyer";
									disableAnimation = false;
								}

								if(inputLabel === "buyerEscrow") {
									inputLabel = "Buyer Escrow (ET)";
									placeholder = "Enter the escrow amount for the buyer in ET";
									disableAnimation = false;
								}

								if(inputLabel === "sellerEscrow") {
									inputLabel = "Seller Escrow (ET)";
									placeholder = "Enter the escrow amount for the seller in ET";
									disableAnimation = false;
								}

								if(inputLabel === "sellerAdvanceFee") {
									inputLabel = "Seller Advance Fee";
									placeholder = "Enter the advance fee given to the seller in ET";
									disableAnimation = false;
								}

								if(inputLabel === "sellerCancellationPenalty") {
									inputLabel = "Seller Cancellation Penalty";
									placeholder = "Enter the penalty fee for the seller if they cancel in ET";
									disableAnimation = false;
								}

								if(inputLabel === "eventPaymentAmount") {
									inputLabel = "Event Payment Amount"
									placeholder = "Enter the payment amount for successful completion of the event in ET"
								}

								if (input.name === "eventDate"){
									inputLabel = "Date Of Event";
									inputType = "date";
									placeholder = ""
									disableAnimation = true;
								}
								// check if input type is struct and if so loop out struct fields as well
								return (
									<p>
										<FormControl margin="normal" required={true} disableAnimation={disableAnimation} fullWidth={true}>
											<InputLabel htmlFor={input.name}>
												{inputLabel}
											</InputLabel>
											<Input
												id={input.name}
												key={input.name}
												name={input.name}
												type={inputType}
												value={this.state.email}
												onChange={this.handleChange}
												placeholder={placeholder}
											/>
										</FormControl>
									</p>
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
		contracts: state.contracts,
		drizzleStatus: state.drizzleStatus
	}
}

export default drizzleConnect(ContractForm, mapStateToProps)
