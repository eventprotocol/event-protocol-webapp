import React from "react";
import PropTypes from "prop-types";

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


// import data
// TODO: Intead these hardcoded data, to get json response from server
import UserData from "../../data/UserData.json";

import dashboardStyle from "../../assets/jss/material-dashboard-react/views/dashboardStyle.jsx";

const styles = {
    card: {
      maxWidth: 345,
    },
    media: {
      height: 0,
      paddingTop: '56.25%', // 16:9
    },
  };

class Marketplace extends React.Component {

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
        <GridContainer>
        {
          UserData.map((data) => {
            return(
              <GridItem xs={12} sm={6} md={4}>
                <a href={"/account/" + data.id}>
                <Card>
                  <CardImage profile>
                    <img
                      src={data.imgSrc}
                      alt="{data.name} picture"
                    />
                  </CardImage>
                  <CardBody>
                    <h4>{data.name}</h4>
                    <h6><strong>Tags: </strong>
                    {
                      data.tags.map((datum) => {
                        return (
                          <span className="badge badge-secondary">
                            {datum}
                          </span>
                        );
                      })
                    }
                    </h6>


                  </CardBody>
                </Card>
                </a>
              </GridItem>
            );
          })
        }
        </GridContainer>
      </div>

    );
  }
}

Marketplace.PropTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(Marketplace);
