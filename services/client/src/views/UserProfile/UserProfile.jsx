import React from "react";
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


// import data
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


// TODO: Grab user data from server given ethereum address provided
// Currently for demo take UserData as id 0
const idx = 0;

function UserProfile(props) {
  const { classes } = props;
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={7}>
          <CustomTabs
            headerColor="info"
            tabs={[
              {
                tabName: "Seller Profile",
                tabContent: (
                  <h1>Test</h1>
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

        </GridItem>


        <GridItem xs={12} sm={12} md={5}>
          <Card profile>
            <CardImage profile>
              <img src={UserData[idx].imgSrc} alt="..." />
            </CardImage>
            <CardBody profile>
              <Button color="info" style={styles.button}>
                Change Photo
              </Button>

              <a href={"/account/" + UserData[idx].id}>
                <Button color="info" style={styles.button}>
                  View Profile
                </Button>
              </a>

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

export default withStyles(styles)(UserProfile);
