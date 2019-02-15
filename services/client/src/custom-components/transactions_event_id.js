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

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import EventToken from "./EventToken.json"
import EventContract from "./EventContract.json"
import Contract from "./EventContract.json"
import SnackbarContent from '@material-ui/core/SnackbarContent';
//import get_id from "./get_contract_id.js"

import DataFetchComponent from "../drizzle-components/CustomContracts/custom-data-fetcher.js";

var Web3 = require('web3');
var BigNumber = require('bignumber.js');
const web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/JRIhcMSUX50sCH9PKk6b"));
const token_abi = EventToken.abi
const event_abi = EventContract.abi

const event_contract_address = "0x89e8a23ca8bab8bef769df2c10c060dc1c30053f"

const contract = new web3.eth.Contract(event_abi, event_contract_address)

const abi = Contract.abi

// for (var i = 0; i < abi.length; i++) {
//   // if (i === 1){
//   //   continue;
//   // }
//   console.log(web3.eth.abi.encodeFunctionSignature(abi[i]))
// }

// create an instance of web3 using the HTTP provider.
// NOTE in mist web3 is already available, so check first if it's available before instantiating
//var web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/JRIhcMSUX50sCH9PKk6b"));

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
});


// To swap data.img to data.img_src when alternative data storage
// is used
class Transactions extends React.Component {
  constructor(){
        super();
        this.state = {
            value: [],
            value_1: [],
        }
        this.getContractId = this.getContractId.bind(this);
        this.getStringTime = this.getStringTime.bind(this);
    }

    componentDidMount(){
      const str = 'http://api-rinkeby.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${token}'
      const obj = {address:this.props.buyer, token:'RA5HQDQNQXD9V1FK6ZTEJYWDGYWPAEPURC'}
      const result = new Function('const {' + Object.keys(obj).join(',') + '} = this.obj;return `' + str + '`').call({obj})

        axios.get(result)
          .then((response) => {
              let fileList = response;
              fileList.data.result = fileList.data.result.filter((el, i) => (
                el.to === '0x7143a8faa78b56fbdfefe0cfba58016f21620bf6' || el.from === '0x7143a8faa78b56fbdfefe0cfba58016f21620bf6' || el.to === "0x89e8a23ca8bab8bef769df2c10c060dc1c30053f" || el.from === "0x89e8a23ca8bab8bef769df2c10c060dc1c30053f"
              ))
              this.setState({
                  value: fileList
              });
          })


      const obj = {address:this.props.seller, token:'RA5HQDQNQXD9V1FK6ZTEJYWDGYWPAEPURC'}
      const result = new Function('const {' + Object.keys(obj).join(',') + '} = this.obj;return `' + str + '`').call({obj})

        axios.get(result)
          .then((response) => {
              let fileList = response;
              fileList.data.result = fileList.data.result.filter((el, i) => (
                el.to === '0x7143a8faa78b56fbdfefe0cfba58016f21620bf6' || el.from === '0x7143a8faa78b56fbdfefe0cfba58016f21620bf6' || el.to === "0x89e8a23ca8bab8bef769df2c10c060dc1c30053f" || el.from === "0x89e8a23ca8bab8bef769df2c10c060dc1c30053f"
              ))
              this.setState({
                  value_1: fileList
              });
          })
    }

    getContractId(transaction_input){
      var event_id = "Wallet"
      var value = 0
      console.log(<DataFetchComponent contract="EventContract" method="getEventName" methodArgs={[parseInt(1), {from: this.props.eth_address}]} />)
      //tokenfallback function abi
      const tokenFallback_ = "0x95f847fd"
      const resolve_event = "0xda9db866"

      var key = transaction_input.slice(0, 10)
      var input = transaction_input.slice(10, transaction_input.length)

      if (key === tokenFallback_){
        event_id = web3.eth.abi.decodeParameters(token_abi[10].inputs, input)[2]
        value = new BigNumber(web3.eth.abi.decodeParameters(token_abi[10].inputs, input)[1])/(Math.pow(10, 18))
        event_id = <DataFetchComponent contract="EventContract" method="getEventName" methodArgs={[parseInt(event_id), {from: this.props.eth_address}]} />

        if (event_id === this.props.id){
          return [event_id, value]
        }
      }

      if (key === resolve_event){
        event_id = web3.eth.abi.decodeParameters(event_abi[5].inputs, input)[0]
        event_id = <DataFetchComponent contract="EventContract" method="getEventName" methodArgs={[parseInt(event_id), {from: this.props.eth_address}]} />

        if (event_id === this.props.id){
          return [event_id, value]
        }
      }

      return [null, null]

    }

    getStringTime(timestamp){
      var date = new Date(timestamp * 1000);
      var formattedDate = ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear() + ' ' + ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2);
      return formattedDate
    }
    render(){
        console.log(this.state)
        if(this.state.value === undefined)
            return null;

        if(this.state.value.data === undefined)
            return null;

        if(this.state.value_1 === undefined)
            return null;

        if(this.state.value_1.data === undefined)
            return null;

        //let imagess = this.state.value.data.result.map(result => <li>{this.state.value.data.result.hash}: {this.state.value.data.result.hash}</li>)


        let images = this.state.value.data.result.map((el, i) => {
          if (this.getContractId(el.input)[0] === null){
            return(
            <TableRow key={el.hash}>
              <TableCell>{this.getStringTime(el.timeStamp)}</TableCell>
              <TableCell>{el.from}</TableCell>
              <TableCell>{el.to}</TableCell>
              <TableCell>{this.getContractId(el.input)[1]}</TableCell>
              <TableCell>{this.getContractId(el.input)[0]}</TableCell>
              </TableRow>
            )
          }
        })

        let images_1 = this.state.value_1.data.result.map((el, i) => (
            <TableRow key={el.hash}>
              <TableCell>{this.getStringTime(el.timeStamp)}</TableCell>
              <TableCell>{el.from}</TableCell>
              <TableCell>{el.to}</TableCell>
              <TableCell>{this.getContractId(el.input)[1]}</TableCell>
              <TableCell>{this.getContractId(el.input)[0]}</TableCell>
              </TableRow>
        ))

        return (
            <div className="folioWrapper">
            <Paper>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>TimeStamp</TableCell>
                    <TableCell align="right">From</TableCell>
                    <TableCell align="right">To</TableCell>
                    <TableCell align="right">ET transferred</TableCell>
                    <TableCell align="right">Transaction</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {images}
                  {images_1}
                </TableBody>
              </Table>
            </Paper>
            </div>

        );
    }
}

export default withStyles(styles)(Transactions);
