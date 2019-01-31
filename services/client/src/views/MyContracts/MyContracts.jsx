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


class Contracts extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			value: 0
		}

		this.handleChange.bind(this);
		this.handleChangeIndex.bind(this);

	}

	handleChange(event, value) {
		this.setState({ value });
	}

	handleChangeIndex(index) {
		this.setState({ value: index });
	}

	render() {
		var component = <NewContract/>

		const sampleData = [
			["Blockchain Conference", "0x0E35462535daE6fd521f0Eea67dc4e9485C714dC", "0x24eeAc4F88412DC27F4b802EA8eB8B4725cF3AF8", "20 Jul 2019 12:00", "Singapore Expo", "20000 ET"],
			["Drunk Powerpoint", "0x0E35462535daE6fd521f0Eea67dc4e9485C714dC", "0x24eeAc4F88412DC27F4b802EA8eB8B4725cF3AF8", "11 May 2019 20:00", "85 Wisma Ave", "1000 ET"],
			["Beautiful Flower Presentation", "0x0E35462535daE6fd521f0Eea67dc4e9485C714dC", "0x24eeAc4F88412DC27F4b802EA8eB8B4725cF3AF8", "12 Apr 2019 10:00", "20 West Coast Ave", "2500 ET"],
			["CosFest", "0x0E35462535daE6fd521f0Eea67dc4e9485C714dC", "0x24eeAc4F88412DC27F4b802EA8eB8B4725cF3AF8", "10 Mar 2019 08:00", "Singapore Expo", "8000 ET"],
			["Trivia Night", "0x0E35462535daE6fd521f0Eea67dc4e9485C714dC", "0x24eeAc4F88412DC27F4b802EA8eB8B4725cF3AF8", "1 Feb 2019 20:00", "Jekyll & Hyde", "7000 ET"],
			["Jack & Jill Wedding", "0x0E35462535daE6fd521f0Eea67dc4e9485C714dC", "0x24eeAc4F88412DC27F4b802EA8eB8B4725cF3AF8", "1 Feb 2019 20:00", "Jekyll & Hyde", "7000 ET"],
		]

		return (
			<div>
				<div>
					<WalletCard primary = {component} secondary = "" title = "New Event"/>
				</div>


				<div>
					<br/>
					<GridContainer>
					{
						sampleData.map((datum, i) => {
							return(
								<GridItem xs={12} sm={6} md={4} id={"griditem-" + i} key={"griditem-" + i} >
									<ContractForm
										title={datum[0]}
										buyer={datum[1]}
										seller={datum[2]}
										date={datum[3]}
										venue={datum[4]}
										value={datum[5]}
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
