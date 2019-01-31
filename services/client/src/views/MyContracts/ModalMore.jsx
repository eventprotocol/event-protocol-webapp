import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import FormControl from "@material-ui/core/FormControl";

function rand() {
	return Math.round(Math.random() * 20) - 10;
}

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

class ModalMore extends React.Component {
	constructor(props) {
		super(props);

    this.handleChange = this.handleChange.bind(this);

		this.state = {
			value: 0,
		}
	}

	handleChange(event) {
		this.setState({
			[event.target.name]: event.target.value,
		});
	}

	render() {
		const { classes } = this.props;

		return (
			<div>
				<Modal
					aria-labelledby="simple-modal-title"
					aria-describedby="simple-modal-description"
					open={this.props.open}
					onClose={this.props.onClose}
				>
					<div style={getModalStyle()} className={classes.paper}>
						<Typography variant="h3" component="h3" id="modal-title">
							Contract Functions
						</Typography>

						<div style={styles.centerer1}>
							<div style={styles.centerer2}>
								<p>Activation Amount: 200 ET</p> {/* To dynamically load this value*/}
								<p>Confirm you want to engage in this contract. Input the activation amount above to activate the contract. This is irreversible.</p>

								<FormControl fullWidth={true} >
									<InputLabel htmlFor="city_country">
										Activation Amount
									</InputLabel>
									<Input
										id="value"
										name="value"
										value={this.state.value}
										onChange={this.handleChange}
										placeholder="Input the activation amount above to activate the contract. This is irreversible."
									/>
								</FormControl>
								<br />
								<br />
								<Button variant="outlined">Activate Contract</Button>
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
						</div>
						<SimpleModalWrapped />
					</div>
				</Modal>
			</div>
		);
	}
}

ModalMore.propTypes = {
	classes: PropTypes.object.isRequired,
};

// We need an intermediary variable for handling the recursive nesting.
const SimpleModalWrapped = withStyles(styles)(ModalMore);

export default SimpleModalWrapped;