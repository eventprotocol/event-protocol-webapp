import React from "react";
import propTypes from "prop-types";
import { drizzleConnect } from 'drizzle-react'

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


    const str = 'http://api-rinkeby.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${token}'
    const obj = {address:this.props.accounts[0], token:'RA5HQDQNQXD9V1FK6ZTEJYWDGYWPAEPURC'}


    const result = new Function('const {' + Object.keys(obj).join(',') + '} = this.obj;return `' + str + '`').call({obj})

    //document.body.innerHTML = result
    console.log(result)
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

          <a href={result} target = "_blank">Transactions</a>

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
