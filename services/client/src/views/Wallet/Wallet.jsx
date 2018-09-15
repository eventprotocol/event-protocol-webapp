import React from "react";
import propTypes from "prop-types";

// @material-ui/core
import withStyles from "@material-ui/core/styles/withStyles";

// import
import SecurityDepositComponent from "../../drizzle-components/drizzle-security-deposit.js";
import IncreaseSecurityDepComponent from "../../drizzle-components/drizzle-increase-deposit.js";
import GetAllowanceComponent from "../../drizzle-components/drizzle-get-allowance-component.js";
import IncreaseApprovalComponent from "../../drizzle-components/drizzle-increase-approval.js"
import EventToken from "../../data/EventToken.json";
import { drizzleConnect } from 'drizzle-react'

import dashboardStyle from "../../assets/jss/material-dashboard-react/views/dashboardStyle.jsx";
import { DrizzleProvider } from 'drizzle-react';
import options from "../../drizzle-components/drizzle-options.js";
import WalletCard from '../../custom-components/Card/WalletCard.jsx'
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';

class Resources extends React.Component {
  state = {
    value: 0,
  }
  handleChange = (event, value) => {
    this.setState({ value });
  }
  handleChangeIndex = (index) => {
    this.setState({ value: index });
  }
  render() {
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
              <WalletCard primary = {primaryComponent_1} secondary = {secondaryComponent_1} title="Increase Deposit"/>
              </GridListTile>

              <GridListTile>
              <WalletCard primary = {primaryComponent_2} secondary = "" title = "Check Approval"/>
              </GridListTile>

              <GridListTile>
              <WalletCard primary = {primaryComponent_3} secondary = "" title = "Increase Approval"/>
              </GridListTile>

            </GridList>

            </div>
          </DrizzleProvider>
      </div>
    );
  }
}

Resources.propTypes = {
  classes: propTypes.object.isRequired
};

export default withStyles(dashboardStyle)(Resources);
