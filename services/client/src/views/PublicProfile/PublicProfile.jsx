import React from "react";
import PropTypes from "prop-types";

// @material-ui/core
import withStyles from "@material-ui/core/styles/withStyles";

// import 

import dashboardStyle from "../../assets/jss/material-dashboard-react/views/dashboardStyle.jsx";

class PublicProfile extends React.Component {
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
      <h1>Test</h1>
    );
  }
}

PublicProfile.PropTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(PublicProfile);