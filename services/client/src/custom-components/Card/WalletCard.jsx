import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import green from "@material-ui/core/colors/green";
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
      <div align = "center">
      <Card className={classes.card}>
        <CardContent>
          <Typography gutterBottom variant="headline" component="h2">
            {this.props.title}
          </Typography>

          <Typography className={classes.title} color="textSecondary">
            {this.props.primary}
            {this.props.secondary}
          </Typography>

        </CardContent>
      </Card>
      </div>
    );
  }
}

SimpleCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleCard);
