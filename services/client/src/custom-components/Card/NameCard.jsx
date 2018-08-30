import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

class CustomCard extends Component{
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <ListItem>
            <this.props.icon />
          <ListItemText primary={this.props.primary} secondary= {this.props.secondary} />
      </ListItem>
    )
  }
}

export default CustomCard;
