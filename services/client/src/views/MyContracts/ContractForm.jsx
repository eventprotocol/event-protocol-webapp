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
import Timelapse from "@material-ui/icons/Timelapse";


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
			functionOpen: false,

			id: 0,
			eventName: "",
			status: "",
			buyer: "",
			seller: "",
			eventDate: "",
      location: "",
      buyerActAmount: "",
			sellerActAmount: "",
			isBuyer: "",
      advance: "",
			totalPayment: "",

		};

		this.handleModalOpen_Transaction = this.handleModalOpen_Transaction.bind(this);
		this.handleModalClose_Transaction = this.handleModalClose_Transaction.bind(this);
		this.handleModalOpen_Function = this.handleModalOpen_Function.bind(this);
		this.handleModalClose_Function = this.handleModalClose_Function.bind(this);
		this.getContractData = this.getContractData.bind(this);  
		this.reducePower = this.reducePower.bind(this);
		this.getStringTime = this.getStringTime.bind(this);
	}

	componentDidMount() {
		this.getContractData();
		console.log(this.state);
	}

	reducePower(num) {
		return num/(Math.pow(10, 18));
	}

	getStringTime(timestamp){
		var date = new Date(timestamp * 1000);
		var formattedDate = ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear() + ' ' + ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2);
		return formattedDate
  }

	getContractData() {
		EventContractInst.methods.getEventName(this.props.id).call().then((res) => {
			this.setState({
				eventName: res
			})
		}).catch((err) => {
			console.log(err)
		})

		EventContractInst.methods.getEventState(this.props.id).call().then((res) => {
			this.setState({
				status: res
			})
		}).catch((err) => {
			console.log(err)
		})

		EventContractInst.methods.getBuyer(this.props.id).call().then((res) => {
			this.setState({
				buyer: res
			}, () => {
				EventContractInst.methods.getBuyerActivationAmount(this.props.id).call().then((res) => {
					if(this.props.account === this.state.buyer) {
						this.setState({
							buyerActAmount: this.reducePower(res),
							isBuyer: true
						})
					} else {
						this.setState({
							buyerActAmount: this.reducePower(res),
							isBuyer: false
						})
					}
				}).catch((err) => {
					console.log(err)
				})
			})
		}).catch((err) => {
			console.log(err)
		})

		EventContractInst.methods.getSeller(this.props.id).call().then((res) => {
			this.setState({
				seller: res
			}, () => {
				EventContractInst.methods.getSellerActivationAmount(this.props.id).call().then((res) => {
					if(this.props.account === this.state.seller) {
						this.setState({
							sellerActAmount: this.reducePower(res),
							isSeller: true
						})
					} else {
						this.setState({
							sellerActAmount: this.reducePower(res),
							isBuyer: false
						})
					}
				}).catch((err) => {
					console.log(err)
				})
			})
		}).catch((err) => {
			console.log(err)
		})

		EventContractInst.methods.getEventDate(this.props.id).call().then((res) => {
			this.setState({
				eventDate: this.getStringTime(res)
			})
		}).catch((err) => {
			console.log(err)
		})

		EventContractInst.methods.getEventLocation(this.props.id).call().then((res) => {
			this.setState({
				eventLocation: res
			})
		}).catch((err) => {
			console.log(err)
		})


		EventContractInst.methods.getEventPaymentCharges(this.props.id).call().then((res) => {
			this.setState({
				totalPayment: this.reducePower(res)
			})
		}).catch((err) => {
			console.log(err)
		})

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

	handleModalOpen_Function() {
		this.setState({
			transactionOpen: false,
			functionOpen: true
		});
	}

	handleModalClose_Function() {
		this.setState({
			functionOpen: false
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
					image={"./media/event-cover-photo-" + this.props.id % 6 + ".jpeg"}
					title="Cover Image"
				/>

				<CardContent>
					<Typography gutterBottom variant="title">
						{this.state.eventName}
					</Typography>

					{/* Buyer And Seller */}
					<Typography component="p">
						<Person /> Buyer: 
						<a href={'/account/' + this.state.buyer }><br />{this.state.buyer}</a>
					</Typography>

					<Typography component="p">
						<Person /> Seller: <a href={'/account/' + this.state.seller }><br />{this.state.seller}</a>
					</Typography>

					<br/>

					<Typography component="p">
						<CalendarToday /> Event Date: {this.state.eventDate}
					</Typography>

					<Typography component="p">
						<LocationOn /> Venue: {this.state.eventLocation}
					</Typography>

					<Typography component="p">
						<AttachMoney /> Contract Value: {this.state.totalPayment} ET
					</Typography>

					<Typography component="p">
						<Timelapse /> Event Status: {this.state.status}
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
						onClick={this.handleModalOpen_Function}>
							Functions
					</Button>
					<ModalFunction
						open={this.state.functionOpen}
						onClose={this.handleModalClose_Function}
						buyerActAmount={this.state.buyerActAmount}
						sellerActAmount={this.state.sellerActAmount}
						isBuyer={this.state.isBuyer}
						isSeller={this.state.isSeller}
						status={this.state.status}
					/>
				</CardActions>

			</Card>
		)
	}
}

ContractFrom.propTypes = {
	classes: PropTypes.object,
	id: PropTypes.number
};

// export default withStyles(styles)(ContractFrom);

const SimpleModalWrapped = withStyles(styles)(ContractFrom);

export default SimpleModalWrapped;