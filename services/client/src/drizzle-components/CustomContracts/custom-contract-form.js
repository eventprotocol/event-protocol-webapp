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
import AcknowledgeCancelButton from "./acknowledge-cancel-component.js";

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import Avatar from '@material-ui/core/Avatar';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import CallIcon from '@material-ui/icons/Call';

const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },

}))(TableCell);

/*
 * Create component.
 */
 var cardStyle = {
    display: 'block',
    width: '40vw',
    transitionDuration: '0.3s',
    height: '255vw'
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
       <ReactCardFlip isFlipped={this.state.isFlipped} height="100px">
         <Card key="front" style={cardStyle}>

             <CardContent>

             <CardHeader align="center"
               avatar={
                 <Avatar aria-label="Recipe">
                   PM
                 </Avatar>
               }
               title={this.props.data.name}
               subheader={this.props.data.eventDate}
             />

             <Paper>
             <Table>

                <TableRow>
                  <CustomTableCell style={{backgroundColor:'#b5b1ae', color: 'black',}}>Status</CustomTableCell>
                  <CustomTableCell style={{backgroundColor:'#b5b1ae', color: 'black',}}>{this.props.data.status}</CustomTableCell>
                </TableRow>

                <TableRow>
                  <TableCell style={{backgroundColor:'#cbf7ed', color: 'black',}}>Amount</TableCell>
                  <TableCell style={{backgroundColor:'#cbf7ed', color: 'black',}}>{this.props.data.totalPayment}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell style={{backgroundColor:'#b5b1ae', color: 'black',}}>Client</TableCell>
                  <TableCell style={{backgroundColor:'#b5b1ae', color: 'black',}}>{this.props.data.buyer}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell style={{backgroundColor:'#cbf7ed', color: 'black',}}>Vendor</TableCell>
                  <TableCell style={{backgroundColor:'#cbf7ed', color: 'black',}}>{this.props.data.seller}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell style={{backgroundColor:'#b5b1ae', color: 'black',}}>Buyer Activation</TableCell>
                  <TableCell style={{backgroundColor:'#b5b1ae', color: 'black',}}>{this.props.data.buyerActAmount}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell style={{backgroundColor:'#cbf7ed', color: 'black',}}>Seller Activation</TableCell>
                  <TableCell style={{backgroundColor:'#cbf7ed', color: 'black',}}>{this.props.data.sellerActAmount}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell style={{backgroundColor:'#b5b1ae', color: 'black',}}>Contract Address</TableCell>
                  <TableCell style={{backgroundColor:'#b5b1ae', color: 'black',}}>{this.props.data.contractAddress}</TableCell>
                </TableRow>

             </Table>
             </Paper>
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
                 PM
               </Avatar>
             }
             title={this.props.data.name}
             subheader={this.props.data.eventDate}
           />

           <CardContent>
              <ActivateComponent/>
              <CancelComponent/>
              <AcknowledgeCancelButton/>
           </CardContent>


           <div align="center">
           <Button variant="fab" color="primary" aria-label="Add"  onClick = {this.handleClick}>
           <CallIcon/>
           </Button>
           <br/>
           <br/>
           </div>

         </Card>
       </ReactCardFlip>
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
    if (this.props.drizzleStatus.initialized === true && this.context.drizzle.contracts.EventToken !== undefined){

      this.state.name = <DataFetchComponent contract="EventContract" method="getEventName" methodArgs={[{from: this.props.accounts[0]}]} />
      this.state.status = <DataFetchComponent contract="EventContract" method="getEventState" methodArgs={[{from: this.props.accounts[0]}]} />
      this.state.eventDate= <DataFetchComponent contract="EventContract" method="getEventDate" methodArgs={[{from: this.props.accounts[0]}]} />
      this.state.advance = <DataFetchComponent contract="EventContract" method="getSellerAdvanceFee" methodArgs={[{from: this.props.accounts[0]}]} />
      this.state.totalPayment = <DataFetchComponent contract="EventContract" method="getEventPaymentCharges" methodArgs={[{from: this.props.accounts[0]}]} />
      this.state.buyer = <DataFetchComponent contract="EventContract" method="getBuyer" methodArgs={[{from: this.props.accounts[0]}]} />
      this.state.seller = <DataFetchComponent contract="EventContract" method="getSeller" methodArgs={[{from: this.props.accounts[0]}]} />
      this.state.location = <DataFetchComponent contract="EventContract" method="getEventLocation" methodArgs={[{from: this.props.accounts[0]}]} />
      this.state.buyerActAmount = <DataFetchComponent contract="EventContract" method="getBuyerActivationAmount" methodArgs={[{from: this.props.accounts[0]}]} />
      this.state.sellerActAmount = <DataFetchComponent contract="EventContract" method="getSellerActivationAmount" methodArgs={[{from: this.props.accounts[0]}]} />
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
      }

      return (
        <div>
          <TeamComponent data={data}></TeamComponent>
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
