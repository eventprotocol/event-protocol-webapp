import React from "react";
import propTypes from "prop-types";
import axios from 'axios';


// @material-ui/core
import withStyles from "@material-ui/core/styles/withStyles";

// import
import GridItem from "../../components/Grid/GridItem.jsx";
import GridContainer from "../../components/Grid/GridContainer.jsx";
import CustomInput from "../../components/CustomInput/CustomInput.jsx";
import Button from "../../components/CustomButtons/Button.jsx";
import Card from "../../components/Card/Card.jsx";
import CardHeader from "../../components/Card/CardHeader.jsx";
import CardAvatar from "../../components/Card/CardAvatar.jsx";
import CardImage from "../../components/Card/CardImage.jsx";
import CardBody from "../../components/Card/CardBody.jsx";
import CardFooter from "../../components/Card/CardFooter.jsx";
import CustomTabs from "../../components/CustomTabs/CustomTabs.jsx";

import dashboardStyle from "../../assets/jss/material-dashboard-react/views/dashboardStyle.jsx";

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },

  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  },

  button: {
    width: "65%",
    margin: "5px"
  },

  centerer1: {
    display: "flex",
    "align-items": "center",
    "justify-content": "center"
  },

  centerer2: {
    "max-width": "50%"
  },

  fullbutton: {
    width: "100%"
  }
};


// To swap data.img to data.img_src when alternative data storage
// is use
class PublicProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      city_country: "",
      about: "",
      seller_detail: "",
      buyer_detail: "",
      img_src: null,
      img: null,
      username: "",
      eth_address: "",
      tags: []
    }
  }

  handleChange = (event, value) => {
    this.setState({ value });
  }
  handleChangeIndex = (index) => {
    this.setState({ value: index });
  }
  getUserData(idx) {
    axios.get('/users/id/' + idx)
    .then((res) => {
      var data = res.data.data;
      this.setState({
        email: data.email,
        city_country: data.city_country,
        about: data.about,
        seller_detail: data.seller_detail,
        buyer_detail: data.buyer_detail,
        img_src: data.img_src,
        img: data.img,
        username: data.username,
        eth_address: data.eth_address,
        tags: data.tags
      });
    })
    .catch((err) => {
      console.log(err);
    });
  }
  render() {
    const { classes } = this.props;
    var idx = this.props.match.params.id;
    this.getUserData(idx);

    return (
      <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={8}>
          <CustomTabs
            headerColor="info"
            tabs={[
              {
                tabName: "General",
                tabContent: (
                  <div>
                    <h3>General</h3>
                    <CustomInput
                      labelText="Email"
                      id="email"
                      formControlProps={{
                        fullWidth: true
                      }}
                      value={this.state.email}
                    />

                    <CustomInput
                      labelText="Country/City"
                      id="country-city"
                      formControlProps={{
                        fullWidth: true
                      }}
                      value={this.state.city_country}
                    />

                    <CustomInput
                      labelText="About"
                      id="About"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        multiline: true,
                        rows: 10,
                      }}
                      value={this.state.about}
                    />
                  </div>
                )
              },
              {
                tabName: "Seller Profile",
                tabContent: (
                  <div>
                    <h3>Seller Profile</h3>
                    <CustomInput
                      labelText="Seller Details"
                      id="sellerDetail"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        multiline: true,
                        rows: 10,
                      }}
                      value={this.state.seller_detail}
                    />
                    <h6><strong>Tags: </strong>
                    {
                      this.state.tags.map((datum) => {
                        return (
                          <span className="badge badge-secondary">
                            {datum}
                          </span>
                        );
                      })
                    }
                    </h6>
                  </div>
                )
              },
              {
                tabName: "Buyer Profile",
                tabContent: (
                  <div>
                    <h3>Buyer Profile</h3>
                    <CustomInput
                      labelText="Buyer Details"
                      id="buyerDetail"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        multiline: true,
                        rows: 10,
                      }}
                      value={this.state.buyer_detail}
                    />
                  </div>
                )
              },
        {/* To add proper oauth with social accounts
              {
                tabName: "Verification",
                tabContent: (
                  <div>
                  <h3>Verification</h3>
                  <Button color="info" style={styles.button}>
                    Authenticate With Facebook
                  </Button>

                  <Button color="info" style={styles.button}>
                    Authenticate With Google+
                  </Button>

                  <Button color="info" style={styles.button}>
                    Authenticate With Twitter
                  </Button>

                  <Button color="info" style={styles.button}>
                    Authenticate With LinkedIn
                  </Button>
                  </div>
                )
              }
        */}
            ]}
          />
        </GridItem>


        <GridItem xs={12} sm={12} md={4}>
          <Card profile>
            <CardImage profile>
              {
                // if image is null
                !this.state.img_src ? (
                  <img src="/media/blank.jpg" alt="..." />
                ) : (
                  <img src={this.state.img} alt="..." />
                )
              }
            </CardImage>
            <CardBody profile>
              <br/>

              <h3>{this.state.username}</h3>

              <CustomInput
                labelText="Ethereum Address"
                id="ethereumAddress"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  disabled: true
                }}
                value={this.state.eth_address}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
      <div className="container" style={styles.centerer1}>
        <div className="container" style={styles.centerer2}>
          <a href={"/contracts"}>
            <Button color="info" style={styles.fullbutton}>
              Make Contract
            </Button>
          </a>
        </div>
      </div>

      </div>
    );
  }
}

PublicProfile.propTypes = {
  classes: propTypes.object.isRequired
};

export default withStyles(dashboardStyle)(PublicProfile);
