import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import green from "@material-ui/core/colors/green";

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DialogBox from "../dialog_box.jsx"


const styles = {
  card: {
    minWidth: 275,
    backgroundColor: "#bfd0e6"
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    marginBottom: 16,
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
};

class SimpleCard extends React.Component {

  constructor(props){
    super(props);
  }

  render(){
    const { classes } = this.props;
    const bull = <span className={classes.bullet}>•</span>;

    return (
      <Card>
        <div>
        <ExpansionPanel>

          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <div align="center">{this.props.title}</div>
          </ExpansionPanelSummary>

          <Typography variant="caption" gutterBottom align="center">
            {this.props.primary}
            {this.props.secondary}
            <div align="right"><DialogBox title={this.props.help_title} text = {this.props.help_message}/></div>
          </Typography>

        </ExpansionPanel>
        </div>
      </Card>

    );
  }
}

SimpleCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleCard);
