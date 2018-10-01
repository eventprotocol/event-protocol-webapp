import React from "react";
import propTypes from "prop-types";

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

import UserData from "../../data/UserData.json";

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


class PublicProfile extends React.Component {
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
    var idx = this.props.match.params.id;
    console.log(idx);
    return (
      <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={7}>
          {/*
          <CustomTabs
            headerColor="info"
            tabs={[
              {
                tabName: "Seller Profile",
                tabContent: (
                  <h1></h1>
                )
              },
              {
                tabName: "Buyer Profile",
                tabContent: (
                  <h1>Test</h1>
                )
              },
              {
                tabName: "Verification",
                tabContent: (
                  <h1>Test</h1>
                )
              }
            ]}
          />
        */}
          <CustomTabs
            headerColor="info"
            tabs={[
              {
                tabName: "Buyer Profile",
                tabContent: (
                  <div>
                  <h1>Buyer Profile</h1>
                  <p>We are looking for graphic designers</p>
                  <Button color="info" style={styles.button}>
                    Message
                  </Button>
                  </div>
                )
              },
               {
                tabName: "Seller Profile",
                tabContent: (
                  <div>
                  <h1>Seller Profile</h1>
                  <p>We offer event services</p>
                  <Button color="info" style={styles.button}>
                    Message
                  </Button>
                  </div>
                )
              }
            ]}
          />
        </GridItem>


        <GridItem xs={12} sm={12} md={5}>
          <Card profile>
            <CardImage profile>
              <img src={UserData[idx].imgSrc} alt="..." />
            </CardImage>
            <CardBody profile>
              <br/>

              <CustomInput
                labelText="Ethereum Address"
                id="ethereum-address"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  disabled: true
                }}
                value={UserData[idx].ethereumAddress}
              />

              <CustomInput
                labelText="Name"
                id="name"
                formControlProps={{
                  fullWidth: true
                }}
                value={UserData[idx].name}
              />

              <CustomInput
                labelText="Email"
                id="email"
                formControlProps={{
                  fullWidth: true
                }}
                value={UserData[idx].email}
              />

              <CustomInput
                labelText="Country/City"
                id="country-city"
                formControlProps={{
                  fullWidth: true
                }}
                value={UserData[idx].cityCountry}
              />

              <CustomInput
                labelText="About"
                id="About"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  multiline: true,
                  rows: 5,
                }}
                value={UserData[idx].about}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
      </div>
    );
  }
}

PublicProfile.propTypes = {
  classes: propTypes.object.isRequired
};

export default withStyles(dashboardStyle)(PublicProfile);
