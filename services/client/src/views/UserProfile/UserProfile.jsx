import { drizzleConnect } from 'drizzle-react'
import React from "react";
import axios from "axios";
import PropTypes from 'prop-types'

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import FormControl from "@material-ui/core/FormControl";
import Snackbar from "@material-ui/core/Snackbar";

// core components
import GridItem from "../../components/Grid/GridItem.jsx";
import GridContainer from "../../components/Grid/GridContainer.jsx";
// import CustomInput from "../../components/CustomInput/CustomInput.jsx";
import Button from "../../components/CustomButtons/Button.jsx";
import Card from "../../components/Card/Card.jsx";
// import CardHeader from "../../components/Card/CardHeader.jsx";
// import CardAvatar from "../../components/Card/CardAvatar.jsx";
import CardImage from "../../components/Card/CardImage.jsx";
import CardBody from "../../components/Card/CardBody.jsx";
// import CardFooter from "../../components/Card/CardFooter.jsx";
import CustomTabs from "../../components/CustomTabs/CustomTabs.jsx";

import dashboardStyle from "../../assets/jss/material-dashboard-react/views/dashboardStyle.jsx";

// TODO to add oauth
// TODO to add color to snackbars

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
// is used
class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.uploadPhoto = this.uploadPhoto.bind(this);
    this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
    this.openSnackbar = this.openSnackbar.bind(this);
    this.state = {
      snackbarOpen: false,
      snackbarMessage: "",
      id: null,
      email: "",
      city_country: "",
      about: "",
      seller_detail: "",
      buyer_detail: "",
      img_src: null,
      img: null,
      username: "",
      eth_address: "",
      tags: ""
    }
  }
  componentDidMount() {
    this.getUserData(this.props.accounts[0]);
  }
  getUserData(eth_address) {
    axios.get('/users/eth_address/' + eth_address)
    .then((res) => {
      var data = res.data.data;
      console.log("getUserData", data);
      this.setState({
        id: data.id,
        email: data.email,
        city_country: data.city_country,
        about: data.about,
        seller_detail: data.seller_detail,
        buyer_detail: data.buyer_detail,
        img_src: data.img_src,
        img: data.img,
        username: data.username,
        eth_address: data.eth_address,
        tags: data.tags.join()
      });
    })
    .catch((err) => {
      console.log(err);
    });
  }
  handleSnackbarClose() {
    this.setState({
      snackbarOpen: false,
      snackbarMessage: ""
    });
  }
  openSnackbar(message) {
    this.setState({
      snackbarOpen: true,
      snackbarMessage: message
    });
  }
  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }
  handleSubmit() {
    // console.log(this.state);
    axios.post('/users/edit', {
      eth_address: this.state.eth_address,
      auth_token: window.sessionStorage.getItem('authToken'),
      email: this.state.email,
      city_country: this.state.city_country,
      about: this.state.about,
      seller_detail: this.state.seller_detail,
      buyer_detail: this.state.buyer_detail,
      username: this.state.username,
      tags: this.state.tags
    })
    .then((res) => {
      // Display a snackbar
      console.log(res);
      this.openSnackbar("Success!");
    })
    .catch((err) => {
      // Display a snackbar
      console.log(err);
      this.openSnackbar("Failure!");
    });
  }
  uploadPhoto(file) {
    var reader = new FileReader();
    reader.readAsDataURL(file)
    reader.onload = () => {
      // console.log(reader.result);
      var imgData = reader.result;
      // console.log(imgData);
      axios.post('/users/upload', {
        eth_address: this.state.eth_address,
        auth_token: window.sessionStorage.getItem('authToken'),
        img: imgData
      })
      .then((res) => {
        console.log(res);
        this.openSnackbar("Success!");
      })
      .catch((err) => {
        console.log(err);
        this.openSnackbar("Failure!");
      })
    }
    reader.onerror = (error) => {
      console.log(error)
    }

  }
  render() {
    // const { classes } = this.props;
    // var idx = this.props.match.params.id;

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
                    <FormControl fullWidth={true} >
                      <InputLabel htmlFor="email">
                        Email
                      </InputLabel>
                      <Input
                        id="email"
                        name="email"
                        value={this.state.email}
                        onChange={this.handleChange}
                      />
                    </FormControl>

                    <FormControl fullWidth={true} >
                      <InputLabel htmlFor="city_country">
                        City/Country
                      </InputLabel>
                      <Input
                        id="city_country"
                        name="city_country"
                        value={this.state.city_country}
                        onChange={this.handleChange}
                      />
                    </FormControl>

                    <FormControl fullWidth={true} >
                      <InputLabel htmlFor="about">
                        About
                      </InputLabel>
                      <Input
                        id="about"
                        name="about"
                        multiline={true}
                        rows={10}
                        value={this.state.about}
                        onChange={this.handleChange}
                      />
                    </FormControl>
                  </div>
                )
              },
              {
                tabName: "Seller Profile",
                tabContent: (
                  <div>
                    <h3>Seller Profile</h3>
                    <FormControl fullWidth={true} >
                      <InputLabel htmlFor="seller_detail">
                        Seller Details
                      </InputLabel>
                      <Input
                        id="seller_detail"
                        name="seller_detail"
                        multiline={true}
                        rows={10}
                        value={this.state.seller_detail}
                        onChange={this.handleChange}
                      />
                    </FormControl>

                     <FormControl fullWidth={true} >
                      <InputLabel htmlFor="tags">
                        Tags, Separate Entries with commas eg. bar, restaurant
                      </InputLabel>
                      <Input
                        id="tags"
                        name="tags"
                        value={this.state.tags}
                        onChange={this.handleChange}
                      />
                    </FormControl>
                  </div>
                )
              },
              {
                tabName: "Buyer Profile",
                tabContent: (
                  <div>
                    <h3>Buyer Profile</h3>
                    <FormControl fullWidth={true} >
                      <InputLabel htmlFor="buyer_detail">
                        Buyer Details
                      </InputLabel>
                      <Input
                        id="buyer_detail"
                        name="buyer_detail"
                        multiline={true}
                        rows={10}
                        value={this.state.buyer_detail}
                        onChange={this.handleChange}
                      />
                    </FormControl>
                  </div>
                )
              }
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
            <CardBody>
              <input
                id="file_input" type="file"
                ref={(ref => this.upload = ref)}
                style={{ display: 'none' }}
                onChange={(e) => this.uploadPhoto(e.target.files[0]) } />
              <Button
                color="info" style={styles.button}
                onClick={(e) => this.upload.click()}>
                Upload Photo
              </Button>

              <a href={"/account/" + this.state.id}>
                <Button color="info" style={styles.button}>
                  View Profile
                </Button>
              </a>
              <FormControl fullWidth={true} >
                <InputLabel htmlFor="username">
                  Username
                </InputLabel>
                <Input
                  id="username"
                  name="username"
                  value={this.state.username}
                  onChange={this.handleChange}
                />
              </FormControl>
              <FormControl fullWidth={true} >
                <InputLabel htmlFor="eth_address">
                  Ethereum Address
                </InputLabel>
                <Input
                  id="eth_address"
                  name="eth_address"
                  disabled={true}
                  value={this.state.eth_address}
                  onChange={this.handleChange}
                />
              </FormControl>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
      <div className="container" style={styles.centerer1}>
        <div className="container" style={styles.centerer2}>
          <Button color="info" style={styles.fullbutton} onClick={this.handleSubmit}>
            Save
          </Button>
          <Snackbar
            anchorOrigin={{horizontal: "right", vertical: "bottom" }}
            message={this.state.snackbarMessage}
            autoHideDuration={3000}
            onClose={this.handleSnackbarClose}
            open={this.state.snackbarOpen}
          />
        </div>
      </div>

      </div>
    );
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