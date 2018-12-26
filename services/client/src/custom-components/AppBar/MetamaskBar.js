import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import SnackbarContent from '@material-ui/core/SnackbarContent';

const action = (
  <a href="https://metamask.zendesk.com/hc/en-us/categories/360000914011-Using-MetaMask">
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

class MetamaskBar extends React.Component {
  render() {
    return(
    <div align="center">
      <br></br>
      <img src={require('../../assets/img/logo.png')} height="142" width="142" alt="logo"/>
      <br></br>
      <br></br>
      <br></br>
      <SnackbarContent message={this.props.data} action={action} />
    </div>
    );
  }
}

MetamaskBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MetamaskBar);
