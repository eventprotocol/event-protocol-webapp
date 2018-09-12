import React from "react";
import propTypes from "prop-types";

// @material-ui/core
import withStyles from "@material-ui/core/styles/withStyles";

// import
import SecurityDepositComponent from "../../drizzle-components/drizzle-security-deposit.js";
import IncreaseSecurityDepComponent from "../../drizzle-components/drizzle-increase-deposit.js";
import EventToken from "../../data/EventToken.json";
import { drizzleConnect } from 'drizzle-react'

import dashboardStyle from "../../assets/jss/material-dashboard-react/views/dashboardStyle.jsx";
import { DrizzleProvider } from 'drizzle-react';
import options from "../../drizzle-components/drizzle-options.js";


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
    return (
      <div>
          <DrizzleProvider options = {options}>
            <div>
            <SecurityDepositComponent/>
            <IncreaseSecurityDepComponent/>
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
