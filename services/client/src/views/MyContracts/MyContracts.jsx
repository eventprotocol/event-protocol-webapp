import React from "react";
import propTypes from "prop-types";

// @material-ui/core
import withStyles from "@material-ui/core/styles/withStyles";

import dashboardStyle from "../../assets/jss/material-dashboard-react/views/dashboardStyle.jsx";


// import contract form
import NewContract from "../../drizzle-components/EventContract/newContract/newContract-component.js"

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
      <div>
        <NewContract/>
      </div>
    );
  }
}

PublicProfile.propTypes = {
  classes: propTypes.object.isRequired
};

export default withStyles(dashboardStyle)(PublicProfile);
