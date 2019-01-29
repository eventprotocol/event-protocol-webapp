import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

class CustomCard extends Component{
  render() {
    return(
      <div>
      <ListItem>
          <this.props.icon />
          <ListItemText primary={this.props.primary} secondary= {this.props.secondary} />
      </ListItem>
      </div>
    )
  }
}

export default CustomCard;
