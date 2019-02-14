import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import FormControl from "@material-ui/core/FormControl";


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

		this.state = {
			buyerValue: "",
			sellerValue: "",
		}
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
							<Typography variant="h3" component="h3" id="modal-title">
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
								<Button variant="outlined">Activate Contract (Buyer)</Button>
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
								<Button variant="outlined">Activate Contract (Seller)</Button>
							</div>

							<br />
							<br />
							<br />
							<Button variant="contained" color="primary">Event Completed</Button>
							<br />
							<br />
							<Button variant="contained" color="secondary">Cancel Event</Button>
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