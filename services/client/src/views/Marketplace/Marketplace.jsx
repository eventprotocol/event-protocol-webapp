import React from "react";
import axios from "axios";
import propTypes from "prop-types";

// @material-ui/core
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import GridContainer from "../../components/Grid/GridContainer.jsx";
import GridItem from "../../components/Grid/GridItem.jsx";
import Card from "../../components/Card/Card.jsx";
import Button from "../../components/CustomButtons/Button.jsx";
// import CardHeader from "../../components/Card/CardHeader.jsx";
import CardImage from "../../components/Card/CardImage.jsx";
// import CardIcon from "../../components/Card/CardIcon.jsx";
import CardBody from "../../components/Card/CardBody.jsx";
// import CardFooter from "../../components/Card/CardFooter.jsx";

import dashboardStyle from "../../assets/jss/material-dashboard-react/views/dashboardStyle.jsx";

// import Web3 and Drizzle
// import { DrizzleProvider } from 'drizzle-react';
// import DrizzleAccount from "../../drizzle-components/drizzle-account.js"
// import options from "../../drizzle-components/drizzle-options.js";

const styles = {
    card: {
      maxWidth: 345,
    },
    media: {
      height: 0,
      paddingTop: '56.25%', // 16:9
    },
    button: {
      width: "30%",
      margin: "10px",
      fontSize: "24px"
    },
    pagination: {
      fontSize: "24px",
      width: "20%",
      margin: '10px',
      textAlign: 'center'
    },
    centerer1: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center"
    },

    centerer2: {
      maxWidth: "50%"
    },
  };

class Marketplace extends React.Component {
  constructor(props) {
    super(props);
    this.onLeftClick = this.onLeftClick.bind(this);
    this.onRightClick = this.onRightClick.bind(this);
    this.state = {
      page: 1,
      maxPage: 1,
      data: []
    }
  }
  componentDidMount() {
    this.getUserData(this.state.page);
  }
  getUserData() {
    axios.get('/users/page/filter_by_id/' + this.state.page)
    .then((res) => {
      var userData = res.data.data.users;
      var maxPage = res.data.data.page_total;
      this.setState({
        data: userData,
        maxPage: maxPage
      });
    })
    .catch((err) => {
      console.log(err);
    });
  }
  onLeftClick() {
    var curr = this.state.page;
    if (curr > 1) {
      curr--;
    }
    this.setState({
      page: curr
    }, () => {
      this.getUserData(this.state.page);
    });
  }
  onRightClick() {
    var curr = this.state.page;
    var max = this.state.maxPage;
    if (curr < max) {
      curr++;
    }
    this.setState({
      page: curr
    }, () => {
      this.getUserData(this.state.page);
    });
  }
  render() {
    // const { classes } = this.props;


    // To swap data.img to data.img_src when alternative data storage
    // is used
    return (
      <div>
        <GridContainer>
        {
          this.state.data.map((data) => {
            return(
              <GridItem xs={12} sm={6} md={4}>
                <a href={"/account/" + data.id}>
                <Card>
                  <CardImage profile>
                    {
                      !data.img_src ? (
                        <img
                          src="/media/blank.jpg"
                          alt="{data.username}"
                        />
                      ) : (
                        <img
                          src={data.img}
                          alt="{data.username}"
                        />
                      )
                    }
                  </CardImage>
                  <CardBody>
                    <h4>{data.username}</h4>
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
        <div className="container" style={styles.centerer1}>
          <div className="container" style={styles.centerer2}>
            <Button color="info" style={styles.button} onClick={this.onLeftClick}>
              {'<'}
            </Button>
            <Button color="transparent" styles={styles.pagination}>
              {this.state.page + " / " +  this.state.maxPage}
            </Button>
            <Button color="info" style={styles.button} onClick={this.onRightClick}>
              {'>'}
            </Button>
          </div>
        </div>
        </GridContainer>
      </div>

    );
  }
}

Marketplace.propTypes = {
  classes: propTypes.object.isRequired
};

export default withStyles(dashboardStyle)(Marketplace);
