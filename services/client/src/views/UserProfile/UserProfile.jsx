import { drizzleConnect } from 'drizzle-react'
import React from "react";
import axios from "axios";
import PropTypes from 'prop-types'


// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputLabel from "@material-ui/core/InputLabel";

// core components
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


class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    // this.handleInputChange = this.handleInputChange.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      id: null,
      email: "",
      city_country: "",
      about: "",
      seller_detail: "",
      buyer_detail: "",
      img_src: null,
      username: "",
      eth_address: "",
      tags: ""
    }
  }
  handleInputChange(property) {
    return e => {
      console.log("e value = " + e.target.value);
      this.setState({
        [property]: e.target.value
      });
    };
  }
  handleSubmit() {
  }
  uploadPhoto() {
  }
  getUserData(eth_address) {
    axios.get('/users/eth_address/' + eth_address)
    .then((res) => {
      var data = res.data.data;
      this.setState({
        id: data.id,
        email: data.email,
        city_country: data.city_country,
        about: data.about,
        seller_detail: data.seller_detail,
        buyer_detail: data.buyer_detail,
        img_src: data.img_src,
        username: data.username,
        eth_address: data.eth_address,
        tags: data.tags.join()
      });
    })
    .catch((err) => {
      console.log(err);
    });
  }
  render() {
    const { classes } = this.props;
    var idx = this.props.match.params.id;

    if (this.props.drizzleStatus.initialized) {var ethAddr = this.props.accounts[0];
      this.getUserData(ethAddr);

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
                        onChange={(e) => {
                          console.log(e);
                          this.setState({email: e.target.value});
                        }
                        }
                      />

                      <CustomInput
                        labelText="Country/City"
                        id="country_city"
                        formControlProps={{
                          fullWidth: true
                        }}
                        value={this.state.city_country}
                      />

                      <CustomInput
                        labelText="About"
                        id="about"
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
                        id="seller_detail"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          multiline: true,
                          rows: 10,
                        }}
                        value={this.state.seller_detail}
                      />
                      <CustomInput
                        labelText="Tags, Separate Entries with , eg. bar, restaurant"
                        id="tags"
                        formControlProps={{
                          fullWidth: true
                        }}
                        value={this.state.tags}
                      />
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
                        id="buyer_detail"
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
                    <img src={this.state.img_src} alt="..." />
                  )
                }
              </CardImage>
              <CardBody profile>
                <Button color="info" style={styles.button} onclick={this.uploadPhoto()}>
                  Upload Photo
                </Button>

                <a href={"/account/" + this.state.id}>
                  <Button color="info" style={styles.button}>
                    View Profile
                  </Button>
                </a>
                <CustomInput
                  labelText="Username"
                  id="username"
                  formControlProps={{
                    fullWidth: true
                  }}
                  value={this.state.username}
                />
                <CustomInput
                  labelText="Ethereum Address"
                  id="eth_address"
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
            <Button color="info" style={styles.fullbutton}>
              Save
            </Button>
          </div>
        </div>

        </div>
      );
    }
  }
}

UserProfile.propTypes = {
  classes: PropTypes.object.isRequired
};


UserProfile.contextTypes = {
  drizzle: PropTypes.object,
}

/*
 * Export connected component.
 */
const mapStateToProps = state => {
  return {
    accounts: state.accounts,
    drizzleStatus: state.drizzleStatus,
    // Note that this only exposes the state of web3 and not the actual web3 instance itself
    web3: state.web3
  }
}

export default drizzleConnect(withStyles(dashboardStyle)(UserProfile), mapStateToProps);