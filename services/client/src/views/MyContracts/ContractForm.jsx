import { drizzleConnect } from 'drizzle-react';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
// import Modal from '@material-ui/core/Modal';

import ModalTransaction from './ModalTransaction';
import ModalFunction from './ModalFunction';

import Person from "@material-ui/icons/Person";
import CalendarToday from "@material-ui/icons/CalendarToday";
import AttachMoney from "@material-ui/icons/AttachMoney";
import LocationOn from "@material-ui/icons/LocationOn";

// const styles = {
// 	card: {
// 		maxWidth: "85%",
// 	},
// 	media: {
// 		// ⚠️ object-fit is not supported by IE 11.
// 		objectFit: 'cover',
// 	},
// };

const styles = {
	card: {
		maxWidth: "100%",
	},
	media: {
		// ⚠️ object-fit is not supported by IE 11.
		objectFit: 'cover',
	},
};


class ContractFrom extends Component {
	constructor(props) {
		super(props);

		this.state = {
			transactionOpen: false,
			moreOpen: false
		};

		this.handleModalOpen_Transaction = this.handleModalOpen_Transaction.bind(this);
		this.handleModalClose_Transaction = this.handleModalClose_Transaction.bind(this);
		this.handleModalOpen_More = this.handleModalOpen_More.bind(this);
		this.handleModalClose_More = this.handleModalClose_More.bind(this);
	}

	handleModalOpen_Transaction() {
		this.setState({
			transactionOpen: true,
			moreOpen: false
		});
	}

	handleModalClose_Transaction() {
		this.setState({
			transactionOpen: false
		});
	}

	handleModalOpen_More() {
		this.setState({
			transactionOpen: false,
			moreOpen: true
		});
	}

	handleModalClose_More() {
		this.setState({
			moreOpen: false
		});
	}


	render() {
		return (
			<Card className={ this.props.classes.card } style={{margin: "5px"}}>
				<CardMedia
					component="img"
					alt="Cover Image"
					className={this.props.classes.media}
					height="200"
					image="./media/event-cover-photo.jpeg"
					title="Cover Image"
				/>

				<CardContent>
					<Typography gutterBottom variant="title">
						{this.props.title}
					</Typography>

					{/* Buyer And Seller */}
					<Typography component="p">
						<Person /> Buyer: <a href={'/account/' + this.props.buyer }>{this.props.buyer}</a>
					</Typography>

					<Typography component="p">
						<Person /> Seller: <a href={'/account/' + this.props.seller }>{this.props.seller}</a>
					</Typography>

					<br/>

					<Typography component="p">
						<CalendarToday /> Event Date: {this.props.date}
					</Typography>

					<Typography component="p">
						<LocationOn /> Venue: {this.props.venue}
					</Typography>

					<Typography component="p">
						<AttachMoney /> Contract Value: {this.props.value}
					</Typography>
				</CardContent>

				<CardActions>
		      <Button
		        size="medium"
		        color="primary"
		        onClick={this.handleModalOpen_Transaction}>
		          Transactions
		      </Button>
					<ModalTransaction
						open={this.state.transactionOpen}
						onClose={this.handleModalClose_Transaction}
					/>

					<Button
						size="medium"
						color="primary"
						onClick={this.handleModalOpen_More}>
							Functions
					</Button>
					<ModalFunction
						open={this.state.moreOpen}
						onClose={this.handleModalClose_More}
					/>
				</CardActions>

				{/*
				<CardActions>
					<Button
						size="small"
						color="primary"
						onClick={this.handleModalOpen_Transaction}>
							Transactions
					</Button>

					<Button
						size="small"
						color="primary"
						onClick={this.handleModalOpen_More}>
							More
					</Button>
				</CardActions>

				<Modal
					open={this.state.transactionOpen}
					onClose={this.handleModalClose_Transaction}
					aria-labelledby="simple-modal-title"
					aria-describedby="simple-modal-description">

					<div style={getModalStyle()} className={this.props.classes.paper}>
						<Typography variant="h6" id="modal-title">
							Text in a modal
						</Typography>
						<Typography variant="subtitle1" id="simple-modal-description">
							Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
						</Typography>
						<SimpleModalWrapped />
					</div>

				</Modal>

				<Modal
					open={this.state.moreOpen}
					onClose={this.handleModalClose_More}
					aria-labelledby="simple-modal-title"
					aria-describedby="simple-modal-description"
				>
					<div style={getModalStyle()} className={this.props.classes.paper}>
						<Typography variant="h6" id="modal-title">
							Text in a modal
						</Typography>
						<Typography variant="subtitle1" id="simple-modal-description">
							Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
						</Typography>
						<SimpleModalWrapped />
					</div>
				</Modal>
			*/}

			</Card>
		)
	}
}

ContractFrom.propTypes = {
	classes: PropTypes.object,
	buyer: PropTypes.string,
	seller: PropTypes.string,
	date: PropTypes.string, // might need to change to datetime
	venue: PropTypes.string,
	value: PropTypes.string
};

// export default withStyles(styles)(ContractFrom);

const SimpleModalWrapped = withStyles(styles)(ContractFrom);

export default SimpleModalWrapped;