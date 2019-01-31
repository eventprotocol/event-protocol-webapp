import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

class CustomCard extends Component{
	render() {
		return(
			<div>
			<ListItem>
					<this.props.icon />
					<ListItemText
						disableTypography
						primary={
							<Typography variant="button" noWrap>
								{this.props.secondary}
							</Typography>
						}
						secondary={
							<Typography variant="body1" noWrap>
								{this.props.primary}
							</Typography>
						}
					/>
			</ListItem>
			</div>
		)
	}
}

export default CustomCard;
