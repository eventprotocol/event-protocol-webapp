import React from "react";
import propTypes from "prop-types";
import { drizzleConnect } from "drizzle-react";

// @material-ui/core
import withStyles from "@material-ui/core/styles/withStyles";

// import
import SecurityDepositComponent from "../../drizzle-components/EventToken/securityDeposit/security-deposit.js";
import IncreaseSecurityDepComponent from "../../drizzle-components/EventToken/securityDeposit/increase-deposit-component.js";
import GetAllowanceComponent from "../../drizzle-components/EventToken/allowance/get-allowance-component.js";
import IncreaseApprovalComponent from "../../drizzle-components/EventToken/approval/increase-approval.js"
// import EventToken from "../../data/EventToken.json";
// import { drizzleConnect } from 'drizzle-react'

import dashboardStyle from "../../assets/jss/material-dashboard-react/views/dashboardStyle.jsx";
import { DrizzleProvider } from 'drizzle-react';
import options from "../../drizzle-components/drizzle-options.js";
import WalletCard from '../../custom-components/Card/WalletCard.jsx'
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';

import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom'

import Transactions from '../../custom-components/transactions.js'


class Resources extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      value: 0
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleChangeIndex = this.handleChangeIndex.bind(this);
    this.onUnload = this.onUnload.bind(this);

  }

  componentDidMount() {
    window.addEventListener('beforeunload', this.onUnload);
  }

  componentWillUnmount() {
    window.addEventListener('beforeunload', this.onUnload);
  }

  onUnload() {
    this.context.route.push('/marketplace');
  }

  handleChange(event, value) {
    this.setState({ value });
  }

  handleChangeIndex(index) {
    this.setState({ value: index });
  }

  render() {
    console.log(this.context);
    const { classes } = this.props;
    var primaryComponent_1 = <SecurityDepositComponent/>
    var secondaryComponent_1 = <IncreaseSecurityDepComponent/>
    var primaryComponent_2 = <GetAllowanceComponent/>
    var primaryComponent_3 = <IncreaseApprovalComponent/>

    return (
      <div>
          <DrizzleProvider options = {options}>
            <div>

            <GridList cellHeight={400} className={classes.gridList} cols={3}>
              <GridListTile>
              <WalletCard primary = {primaryComponent_1} secondary = {secondaryComponent_1}
              help_title = "Help" help_message = "You can increase your Security Deposit to gain more credibility in the Event Protocol platform. Note that there are 18 decimal places used. For example 1 ET written will be appended with 18 zeros in metamask."
              title="Increase Deposit"/>
              </GridListTile>

              <GridListTile>
              <WalletCard primary = {primaryComponent_2} secondary = ""
              help_title = "Help" help_message = "Check your ET Transfer Limit to other users here"
              title = "Check Approval"/>
              </GridListTile>

              <GridListTile>
              <WalletCard primary = {primaryComponent_3} secondary = ""
              help_title = "Help" help_message = "Increase ET transfer limit to other users here"
              title = "Increase Approval"/>
              </GridListTile>

            </GridList>

            <h3>Transactions</h3>
            <Transactions eth_address = {this.props.accounts[0]}/>
            </div>

          </DrizzleProvider>

      </div>
    );
  }
}

Resources.propTypes = {
  classes: propTypes.object.isRequired
};

/*
 * Export connected component.
 */
const mapStateToProps = state => {
  return {
    accounts: state.accounts,
    drizzleStatus: state.drizzleStatus,
    // Note that this only exposes the state of web3 and not the actual web3 instance itself
    web3: state.web3
  }
}

export default drizzleConnect(withStyles(dashboardStyle)(Resources), mapStateToProps);

//export default withStyles(dashboardStyle)(Resources);
