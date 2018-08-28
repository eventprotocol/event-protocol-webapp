import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import SnackbarContent from '@material-ui/core/SnackbarContent';

const action = (
  <a href="https://consensys.zendesk.com/hc/en-us/categories/360000441452-Using-MetaMask">
  <Button color="secondary" size="small">
    Metamask FAQ
  </Button>
  </a>
);

const styles = theme => ({
  snackbar: {
    margin: theme.spacing.unit,
  },
});

function LongTextSnackbar(props) {
  const { classes } = props;

  return (
    <div align="center">
      <br></br>
      <img src={require('./assets/img/logo.png')} height="142" width="142"/>
      <br></br>
      <br></br>
      <br></br>
      <SnackbarContent className={classes.snackbar} message="We cant find  Ethereum accounts! Please check and make sure Metamask or your browser are pointed at the correct network and your account is unlocked" action={action} />
    </div>
  );
}

LongTextSnackbar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LongTextSnackbar);
