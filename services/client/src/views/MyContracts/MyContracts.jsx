import React from "react";
import propTypes from "prop-types";

// @material-ui/core
import withStyles from "@material-ui/core/styles/withStyles";

import dashboardStyle from "../../assets/jss/material-dashboard-react/views/dashboardStyle.jsx";


// import contract form
import NewContract from "../../drizzle-components/EventContract/newContract/newContract-component.js"
import WalletCard from '../../custom-components/Card/WalletCard.jsx'
import CustomContract from "../../drizzle-components/CustomContracts/custom-contract-form.js"

import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';

class Contracts extends React.Component {
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
    var component = <NewContract/>
    var custom_component = <CustomContract/>

    return (
      <div>

      <div>
        <WalletCard primary = {component} secondary = "" title = "Deploy New Contract"/>
      </div>


      <div>
        <br/>
        <GridList cellHeight={500} className={classes.gridList} cols={2}>
        <GridListTile>
          {custom_component}
        </GridListTile>
        </GridList>
      </div>

      </div>
    );
  }
}

Contracts.propTypes = {
  classes: propTypes.object.isRequired
};

export default withStyles(dashboardStyle)(Contracts);
