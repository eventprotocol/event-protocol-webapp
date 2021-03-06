/* eslint-disable */
import { drizzleConnect } from 'drizzle-react'

import React from "react";
import PropTypes from "prop-types";
import { Switch, Route, Redirect } from "react-router-dom";

// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";

import dashboardRoutes from "../../routes/dashboard.jsx";
import dashboardStyle from "../../assets/jss/material-dashboard-react/layouts/dashboardStyle.jsx";

import image from "../../assets/img/sidebar.jpg";
import logo from "../../assets/img/logo.png";

import AccountBalanceAppBar from "../../custom-components/AppBar/AccountBalanceBar.js";
import history from "../../history";


const switchRoutes = (
  <Switch>
    {dashboardRoutes.map((prop, key) => {
      if (prop.redirect)
        return <Redirect from={prop.path} to={prop.to} key={key} />;

      return <Route path={prop.path} component={prop.component} key={key} />;
    })}
  </Switch>
);


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mobileOpen: false,
      connected: false,
      login: false
    };
    this.resizeFunction = this.resizeFunction.bind(this);
  }

  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };

  getRoute() {
    return this.props.location.pathname !== "/maps";
  }

  onUnload() {
    // Redirect to marketplace on refresh
    history.push('/');
  }

  resizeFunction() {
    if (window.innerWidth >= 960) {
      this.setState({ mobileOpen: false });
    }
  }

  componentDidMount() {
    if (navigator.platform.indexOf("Win") > -1) {
      const ps = new PerfectScrollbar(this.refs.mainPanel);
    }
    window.addEventListener("resize", this.resizeFunction);

    // Handle the state to display dashboard accordingly
    if (this.props.drizzleStatus.initialized === true) {
      this.setState({
        connected: true
      });

      if (this.props.web3.status === 'initialized' && Object.keys(this.props.accounts).length === 0) {
        this.setState({
          login: true
        });
      }
    } else {
      this.setState({
        connected: false,
        login: false
      });
    }
  }

  componentDidUpdate(e) {
    if (e.history.location.pathname !== e.location.pathname) {
      this.refs.mainPanel.scrollTop = 0;
      if (this.state.mobileOpen) {
        this.setState({ mobileOpen: false });
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resizeFunction);
  }

  render() {
    const { classes, ...rest } = this.props;

    // update state
    if (typeof this.props.drizzleStatus.initialized !== "undefined") {
      if (this.props.drizzleStatus.initialized) {
          if (!this.state.connected) {
            this.setState({
              connected: true
            });
          }
          if (this.props.web3.status === 'initialized' && Object.keys(this.props.accounts).length !== 0) {
            if (!this.state.login) {
              this.setState({
                login: true
              });
            }
          }
      } else {
        if (this.state.connected)
        this.setState({
          connected: false,
          login: false
        });
      }
    }



    return (
      <div className={classes.wrapper}>
        <Sidebar
          routes={dashboardRoutes}
          logoText={"Event Protocol"}
          logo={logo}
          image={image}
          handleDrawerToggle={this.handleDrawerToggle}
          open={this.state.mobileOpen}
          color="blue"
          connected={this.state.connected}
          login={this.state.login}
          {...rest}
        />

        <div className={classes.mainPanel} ref="mainPanel">
          <AccountBalanceAppBar></AccountBalanceAppBar>
        </div>

        {/* This is the main content */}
        <div className={classes.mainPanel} ref="mainPanel">

          {/* This is the header */}
          <Header
            routes={dashboardRoutes}
            handleDrawerToggle={this.handleDrawerToggle}
            {...rest}
          />

          {/* This is the body */}
          {this.getRoute() ? (
            <div className={classes.content}>
              <div className={classes.container}>{switchRoutes}</div>
            </div>
          ) : (
            <div className={classes.map}>{switchRoutes}</div>
          )}

          {/* This is the footer */}
          {this.getRoute() ? <Footer /> : null}
        </div>
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    accounts: state.accounts,
    drizzleStatus: state.drizzleStatus,
    web3: state.web3,
  }
}

const drizzleOut = drizzleConnect(App, mapStateToProps);
export default withStyles(dashboardStyle)(drizzleOut);
