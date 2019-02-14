import React from "react";
import propTypes from "prop-types";

// @material-ui/core
import withStyles from "@material-ui/core/styles/withStyles";
import dashboardStyle from "../../assets/jss/material-dashboard-react/views/dashboardStyle.jsx";

// import contract form
import NewContract from "../../drizzle-components/EventContract/newContract/form-component.js"
import WalletCard from '../../custom-components/Card/WalletCard.jsx'
import CustomContract from "../../drizzle-components/CustomContracts/custom-contract-form.js"
import ContractForm from "./ContractForm.jsx";
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridContainer from "../../components/Grid/GridContainer.jsx";
import GridItem from "../../components/Grid/GridItem.jsx";
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


class Contracts extends React.Component {
	constructor(props) {
		super(props);

		// var data = {
		// 	name: this.state.name,
		// 	status: this.state.status,
		// 	eventDate: this.state.eventDate,
		// 	advance: this.state.advance,
		// 	totalPayment: this.state.totalPayment,
		// 	buyer: this.state.buyer,
		// 	seller: this.state.seller,
		// 	location: this.state.location,
		// 	sellerActAmount: this.state.sellerActAmount,
		// 	buyerActAmount: this.state.buyerActAmount,
		// 	contractAddress: this.state.contractAddress,
		// 	contractId: this.state.contractId,
		// }


		this.state = {
			userAddress: "",
			value: 0,
			contractCount: 0,
			idList: []

		}

		this.handleChange.bind(this);
		this.handleChangeIndex.bind(this);
		this.getContractData = this.getContractData.bind(this);
	}

	componentDidMount() {
		this.getContractData();
	}

	handleChange(event, value) {
		this.setState({ value });
	}

	handleChangeIndex(index) {
		this.setState({ value: index });
	}

	getContractData() {
		// Get user address
		web3.eth.getAccounts((err, res) => {
			if(err != null) {
				console.log("Couldn't get accounts")
			}

			this.setState({
				userAddress: res[0]
			}, () => {
				EventContractInst.methods.getEventCount().call().then((res) => {
					console.log(this.state);

					this.setState({
						contractCount: res
					}, () => {
						for(let i = 0; i < this.state.contractCount; i++) {
							EventContractInst.methods.getBuyer(i).call().then((res) => {
								if(res === this.state.userAddress) {
									var found = this.state.idList.some(function (el) {
  									return el === i;
									});

									if(!found) {
										let newIdList = this.state.idList.slice();
										newIdList.push(i)
										newIdList.sort();
										this.setState({
											idList: newIdList
										})
									}
								}
							}).catch((err) => {
								console.log(err);
							})

							EventContractInst.methods.getSeller(i).call().then((res) => {
								if(res === this.state.userAddress) {
									var found = this.state.idList.some(function (el) {
  									return el === i;
									});

									if(!found) {
										let newIdList = this.state.idList.slice();
										newIdList.push(i);
										newIdList.sort();
										this.setState({
											idList: newIdList
										})
									}
								}
							}).catch((err) => {
								console.log(err);
							})
						}
					})
				})
			})
		});
	}

	render() {

		// const sampleData = [
		// 	["Blockchain Conference", "0x0E35462535daE6fd521f0Eea67dc4e9485C714dC", "0x24eeAc4F88412DC27F4b802EA8eB8B4725cF3AF8", "20 Jul 2019 12:00", "Singapore Expo", "20000 ET"],
		// 	["Drunk Powerpoint", "0x0E35462535daE6fd521f0Eea67dc4e9485C714dC", "0x24eeAc4F88412DC27F4b802EA8eB8B4725cF3AF8", "11 May 2019 20:00", "85 Wisma Ave", "1000 ET"],
		// 	["Beautiful Flower Presentation", "0x0E35462535daE6fd521f0Eea67dc4e9485C714dC", "0x24eeAc4F88412DC27F4b802EA8eB8B4725cF3AF8", "12 Apr 2019 10:00", "20 West Coast Ave", "2500 ET"],
		// 	["CosFest", "0x0E35462535daE6fd521f0Eea67dc4e9485C714dC", "0x24eeAc4F88412DC27F4b802EA8eB8B4725cF3AF8", "10 Mar 2019 08:00", "Singapore Expo", "8000 ET"],
		// 	["Trivia Night", "0x0E35462535daE6fd521f0Eea67dc4e9485C714dC", "0x24eeAc4F88412DC27F4b802EA8eB8B4725cF3AF8", "1 Feb 2019 20:00", "Jekyll & Hyde", "7000 ET"],
		// 	["Jack & Jill Wedding", "0x0E35462535daE6fd521f0Eea67dc4e9485C714dC", "0x24eeAc4F88412DC27F4b802EA8eB8B4725cF3AF8", "1 Feb 2019 20:00", "Jekyll & Hyde", "7000 ET"],
		// ]

		// let newIdList = this.state.idList.slice();
		// newIdList.sort();
		// this.setState({
		// 	idList: newIdList
		// })

		console.log(this.state);

		return (
			<div>
				<div>
					<WalletCard primary={<NewContract/>} secondary="" title = "New Event" help_title="Help"
						help_message="Input relevant details to create an event and store the details on the Blockchain."
					/>
				</div>

				<div>
					<br/>
					<GridContainer>
					{
						this.state.idList.map((datum, i) => {
							return(
								<GridItem xs={12} sm={6} md={4} id={"griditem-" + i} key={"griditem-" + i} >
									<ContractForm
										id={datum[0]}
									/>
								</GridItem>
							);
						})
					}

					</GridContainer>
				</div>
			</div>
		);
	}
}

Contracts.propTypes = {
	classes: propTypes.object.isRequired
};

export default withStyles(dashboardStyle)(Contracts);
