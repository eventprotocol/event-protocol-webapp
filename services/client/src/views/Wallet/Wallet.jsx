import React from "react";
import propTypes from "prop-types";

// @material-ui/core
import withStyles from "@material-ui/core/styles/withStyles";

// import
import SecurityDepositComponent from "../../drizzle-components/drizzle-security-deposit.js";
import InceraseSecurityDepComponent from "../../drizzle-components/drizzle-increase-deposit.js";
import EventToken from "../../data/EventToken.json";
import { drizzleConnect } from 'drizzle-react'

import dashboardStyle from "../../assets/jss/material-dashboard-react/views/dashboardStyle.jsx";


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
      <SecurityDepositComponent/>
      <InceraseSecurityDepComponent/>
      </div>
    );
  }
}

Resources.propTypes = {
  classes: propTypes.object.isRequired
};

export default withStyles(dashboardStyle)(Resources);
