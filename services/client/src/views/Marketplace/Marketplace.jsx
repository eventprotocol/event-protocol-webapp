import React from "react";
import PropTypes from "prop-types";

// @material-ui/core
import withStyles from "@material-ui/core/styles/withStyles";

// import data
// TODO: Intead these hardcoded data, to get json response from server
import MarketplaceData from "./MarketplaceData.json";

import dashboardStyle from "../../assets/jss/material-dashboard-react/views/dashboardStyle.jsx";

class Marketplace extends React.Component {
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
        <ul>
        {
          MarketplaceData.map((data) => {
            return <li>{data.id} - {data.name}</li>
          })
        }
        </ul>
      </div>
      
    );
  }
}

Marketplace.PropTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(Marketplace);