import { drizzleConnect } from 'drizzle-react'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import DataFetchComponent from "./custom-data-fetcher.js";
import EventContract from "../../data/EventContract.json";
import NameCard from '../../custom-components/Card/NameCard.jsx'
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';


import Card from "@material-ui/core/Card";
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CardImage from "../../components/Card/CardImage.jsx";

import reactElementToJSXString from 'react-element-to-jsx-string';
import ReactCardFlip from 'react-card-flip';
import Button from '@material-ui/core/Button';
import ActivateComponent from "./activate-component.js";
import CancelComponent from "./cancelEvent-component.js";
import SuccessComponent from "./success-component.js";

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import CardMedia from '@material-ui/core/CardMedia';

import Avatar from '@material-ui/core/Avatar';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import CallIcon from '@material-ui/icons/Call';

import FolderIcon from '@material-ui/icons/Folder';
import PageviewIcon from '@material-ui/icons/Pageview';
import AssignmentIcon from '@material-ui/icons/Assignment';
import pink from '@material-ui/core/colors/pink';
import green from '@material-ui/core/colors/green';
import MoneyIcon from '@material-ui/icons/Money';
import PersonIcon from '@material-ui/icons/Person';
import Alarm from '@material-ui/icons/AccessAlarm';

const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },

}))(TableCell);

/*
 * Create component.
 */
 var cardStyle = {
    display: 'block',
    width: '18vw',
    transitionDuration: '0.3s',
    height: '255vw',

    media: {
    height: 5,
    paddingTop: '26.25%', // 16:9,
    marginTop:'30'
    }
}


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
       <div>
       <ReactCardFlip isFlipped={this.state.isFlipped} height="100px">
         <Card key="front" style={cardStyle}>

             <CardHeader align="center"
               avatar={
                 <Avatar aria-label="Recipe">
                   {this.props.data.contractId}
                 </Avatar>
               }
               title={this.props.data.name}
               subheader={this.props.data.eventDate}
             />

             <CardMedia
              image="./media/event-cover-photo.jpeg"
              title={this.props.data.name}
              style={cardStyle.media}
             />

             <CardContent>

             <Table align="center" colspan="12">
                <TableRow>
                  <CustomTableCell>
                  <Avatar style={{color: '#fff', backgroundColor: green[500]}}>
                     <AssignmentIcon />
                  </Avatar>
                 {this.props.data.status}
                 </CustomTableCell>

                  <CustomTableCell>
                  <Avatar style={{color: '#fff', backgroundColor: pink[500]}}>
                     <MoneyIcon />
                  </Avatar>
                 {this.props.data.totalPayment}
                  </CustomTableCell>
                </TableRow>


                <TableRow>
                  <CustomTableCell>
                  <Avatar style={{color: '#fff', backgroundColor: green[500]}}>
                     <PersonIcon />
                     B
                  </Avatar>
                 {this.props.data.buyer}
                 </CustomTableCell>

                  <CustomTableCell>
                  <Avatar style={{color: '#fff', backgroundColor: pink[500]}}>
                     <PersonIcon />
                     S
                  </Avatar>
                 {this.props.data.seller}
                  </CustomTableCell>
                </TableRow>


                <TableRow>
                  <CustomTableCell>
                  <Avatar style={{color: '#fff', backgroundColor: green[500]}}>
                     <Alarm />
                     B
                  </Avatar>
                 {this.props.data.buyerActAmount}
                 </CustomTableCell>

                  <CustomTableCell>
                  <Avatar style={{color: '#fff', backgroundColor: pink[500]}}>
                     <Alarm />
                     S
                  </Avatar>
                 {this.props.data.sellerActAmount}
                  </CustomTableCell>
                </TableRow>

             </Table>
           </CardContent>

           <div align="center">
           <Button variant="fab" color="primary" aria-label="Add"  onClick = {this.handleClick}>
            <CallIcon/>
           </Button>
           <br/>
           <br/>
           </div>
         </Card>


         <Card key="back" style={cardStyle}>

           <CardHeader align="center"
             avatar={
               <Avatar aria-label="Recipe">
                 {this.props.data.contractId}
               </Avatar>
             }
             title={this.props.data.name}
             subheader={this.props.data.eventDate}
           />

           <CardContent>
              <ActivateComponent myVal={this.props.data.contractId}/>
              <SuccessComponent myVal={this.props.data.contractId}/>
              <br/>
              <CancelComponent myVal={this.props.data.contractId}/>
           </CardContent>


           <div align="center">
           <Button variant="fab" color="primary" aria-label="Add"  onClick = {this.handleClick}>
           <CallIcon/>
           </Button>
           <br/>
           </div>

         </Card>
       </ReactCardFlip>
       </div>
     )
   }
 }


class GetCustomComponent extends Component {
  constructor(props, context) {
    super(props);
    this.state = {
      spender: null,
      name: "",
      buyer: "",
      seller: "",
      advance: "",
      totalPayment: "",
      eventDate: "",
      status: "",
      btColor: "primary",
      location: "",
      buyerActAmount: "",
      sellerActAmount: "",
      isFlipped: false,
      contracts: context.drizzle.contracts,
      contractAddress: "",
      contractId: this.props.contractId,
    };
    this.precisionRound = this.precisionRound.bind(this);
    this.convertToEther = this.convertToEther.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  precisionRound(number, precision) {
    var factor = Math.pow(10, precision)
    return Math.round(number * factor) / factor
  }

  convertToEther(number){
    return number/(Math.pow(10, 18));
  }

  handleClick(e) {
    e.preventDefault();
    this.setState({ isFlipped: !this.state.isFlipped });
  }

  render() {
    if (this.props.drizzleStatus.initialized === true && this.context.drizzle.contracts.EventContract !== undefined){

      this.state.name = <DataFetchComponent contract="EventContract" method="getEventName" methodArgs={[parseInt(this.state.contractId), {from: this.props.accounts[0]}]} />
      this.state.status = <DataFetchComponent contract="EventContract" method="getEventState" methodArgs={[parseInt(this.state.contractId), {from: this.props.accounts[0]}]} />
      this.state.eventDate= <DataFetchComponent contract="EventContract" method="getEventDate" methodArgs={[parseInt(this.state.contractId), {from: this.props.accounts[0]}]} />
      this.state.totalPayment = <DataFetchComponent contract="EventContract" method="getEventPaymentCharges" methodArgs={[parseInt(this.state.contractId), {from: this.props.accounts[0]}]} />
      this.state.buyer = <DataFetchComponent contract="EventContract" method="getBuyer" methodArgs={[parseInt(this.state.contractId), {from: this.props.accounts[0]}]} />
      this.state.seller = <DataFetchComponent contract="EventContract" method="getSeller" methodArgs={[parseInt(this.state.contractId), {from: this.props.accounts[0]}]} />
      this.state.location = <DataFetchComponent contract="EventContract" method="getEventLocation" methodArgs={[parseInt(this.state.contractId), {from: this.props.accounts[0]}]} />
      this.state.buyerActAmount = <DataFetchComponent contract="EventContract" method="getBuyerActivationAmount" methodArgs={[parseInt(this.state.contractId), {from: this.props.accounts[0]}]} />
      this.state.sellerActAmount = <DataFetchComponent contract="EventContract" method="getSellerActivationAmount" methodArgs={[parseInt(this.state.contractId), {from: this.props.accounts[0]}]} />
      this.state.contractAddress = this.context.drizzle.contracts.EventContract.address;

      var data = {
        name: this.state.name,
        status: this.state.status,
        eventDate: this.state.eventDate,
        advance: this.state.advance,
        totalPayment: this.state.totalPayment,
        buyer: this.state.buyer,
        seller: this.state.seller,
        location: this.state.location,
        sellerActAmount: this.state.sellerActAmount,
        buyerActAmount: this.state.buyerActAmount,
        contractAddress: this.state.contractAddress,
        contractId: this.state.contractId,
      }

      return (
        <div>
          <TeamComponent data={data}></TeamComponent>
          <h1></h1>
          <h1></h1>
          <h1></h1>
        </div>
      );
    }
    else{
      return(
        <div>
          <h1>Drizzle is not here</h1>
        </div>
      )
    }
  }
}

GetCustomComponent.contextTypes = {
  drizzle: PropTypes.object
}

/*
 * Export connected component.
 */

const mapStateToProps = state => {
  return {
    accounts: state.accounts,
    drizzleStatus: state.drizzleStatus,
    web3: state.web3,
    accountBalances: state.accountBalances,
    contracts: state.contracts,
    units: "ETH"
  }
}

export default drizzleConnect(GetCustomComponent, mapStateToProps)
