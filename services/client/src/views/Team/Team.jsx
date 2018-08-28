import React from "react";
import PropTypes from "prop-types";
import ReactCardFlip from 'react-card-flip';

// @material-ui/core
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import GridContainer from "../../components/Grid/GridContainer.jsx";
import GridItem from "../../components/Grid/GridItem.jsx";
import Card from "../../components/Card/Card.jsx";
import CardHeader from "../../components/Card/CardHeader.jsx";
import CardImage from "../../components/Card/CardImage.jsx";
import CardIcon from "../../components/Card/CardIcon.jsx";
import CardBody from "../../components/Card/CardBody.jsx";
import CardFooter from "../../components/Card/CardFooter.jsx";

import TeamData from "../../data/TeamData.json";
import dashboardStyle from "../../assets/jss/material-dashboard-react/views/dashboardStyle.jsx";

//Table
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import ContactIcon from "@material-ui/icons/Contacts";
import PeopleIcon from "@material-ui/icons/People";

class TeamComponent extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      isFlipped: false
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    this.setState({ isFlipped: !this.state.isFlipped });
  }

  render() {
    return (
      <ReactCardFlip isFlipped={this.state.isFlipped}>
        <Card key="front">
          <CardImage profile>
            <img
              src={this.props.data.imgSrc}
              alt="{data.name} picture"
            />
          </CardImage>

          <CardContent>
            <Typography gutterBottom variant="headline" component="h2" align="center">
              <b>{this.props.data.name}</b>
            </Typography>

            <Typography gutterBottom variant="headline" component="p" align="center">
              {this.props.data.designation}
            </Typography>

          </CardContent>

          <div align="center">
          <Button variant="fab" color="primary" aria-label="Add"  onClick = {this.handleClick}>
            <ContactIcon />
          </Button>
          </div>
        </Card>


        <Card key="back">

          <CardContent>
            <Typography gutterBottom variant="headline" component="h2" align="center">
              <b>{this.props.data.email}</b>
            </Typography>

            <Typography gutterBottom variant="headline" component="p" align="center">
              {this.props.data.tag}
            </Typography>

          </CardContent>


          <div align="center">
          <Button variant="fab" color="primary" aria-label="Add"  onClick = {this.handleClick}>
            <PeopleIcon/>
          </Button>
          </div>

        </Card>
      </ReactCardFlip>
    )
  }
}

const styles = {
    card: {
      maxWidth: 225,
    },
    media: {
      height: 10,
      paddingTop: '56.25%', // 16:9
    },
    TeamComponent:{
      flexDirection: 'column',
    }
  };



class Team extends React.Component {
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

    // To do search filtering
    return (
      <div>
        <GridList cellHeight={400} className={classes.gridList} cols={3}>
        {
          TeamData.map((data) => {
            return(
              <GridListTile>
              <TeamComponent data={data}></TeamComponent>
              </GridListTile>
            );
          })
        }
        </GridList>
      </div>

    );
  }
}

Team.PropTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(Team);
