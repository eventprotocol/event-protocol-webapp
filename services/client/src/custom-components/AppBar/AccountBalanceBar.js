import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

// import Web3 and Drizzle
import { DrizzleProvider } from 'drizzle-react';
import DrizzleAccount from "../../drizzle-components/drizzle-account.js"
import options from "../../drizzle-components/drizzle-options.js";


const styles = {
  root: {
    flexGrow: 1,
  },
};

// Edit the blockchain update parameter
var vals = options;
vals.polls.accounts = 10000;

function AccountBalanceBar(props) {
  const { classes } = props;
  return (
    <div className={classes.root}>
      <DrizzleProvider options={vals}>
      <AppBar position="static" color="default">
        <DrizzleAccount></DrizzleAccount>
      </AppBar>
      </DrizzleProvider>
    </div>
  );
}

AccountBalanceBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AccountBalanceBar);
