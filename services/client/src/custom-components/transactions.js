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
//import get_id from "./get_contract_id.js"

var Web3 = require('web3');
var BigNumber = require('bignumber.js');
const web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/JRIhcMSUX50sCH9PKk6b"));
const token_abi = EventToken.abi
const event_abi = EventContract.abi

const event_contract_address = "0x89e8a23ca8bab8bef769df2c10c060dc1c30053f"

const contract = new web3.eth.Contract(event_abi, event_contract_address)



const abi = Contract.abi
console.log(abi)

var input = "00000000000000000000000089e8a23ca8bab8bef769df2c10c060dc1c30053f00000000000000000000000000000000000000000000000ad78ebc5ac62000000000000000000000000000000000000000000000000000000000000000000001"
// abi[2] is tokenfallback
console.log(abi)
console.log(web3.eth.abi.encodeFunctionSignature(abi[5]))


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
            value: []
        }
        this.getContractId = this.getContractId.bind(this);
    }

    componentDidMount(){
      const str = 'http://api-rinkeby.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${token}'
      const obj = {address:this.props.eth_address, token:'RA5HQDQNQXD9V1FK6ZTEJYWDGYWPAEPURC'}
      const result = new Function('const {' + Object.keys(obj).join(',') + '} = this.obj;return `' + str + '`').call({obj})

        axios.get(result)
          .then((response) => {
              let fileList = response;
              fileList.data.result = fileList.data.result.filter((el, i) => (
                el.to === '0x7143a8faa78b56fbdfefe0cfba58016f21620bf6' || el.from === '0x7143a8faa78b56fbdfefe0cfba58016f21620bf6'
              ))
              this.setState({
                  value: fileList
              });
          })

        console.log(this.state.value)

    }

    getContractId(transaction_input){
      var event_id = "Wallet"
      var value = 0
      //tokenfallback function abi
      const tokenFallback_ = "0x95f847fd"
      const resolve_event = "0xda9db866"

      var key = transaction_input.slice(0, 10)
      var input = transaction_input.slice(10, transaction_input.length)

      if (key === tokenFallback_){
        event_id = "Event " + web3.eth.abi.decodeParameters(token_abi[10].inputs, input)[2]
        value = new BigNumber(web3.eth.abi.decodeParameters(token_abi[10].inputs, input)[1])/(Math.pow(10, 18))
      }

      if (key === resolve_event){
        event_id = web3.eth.abi.decodeParameters(event_abi[5].inputs, input)[0]
      }

      return [event_id, value]

    }

    render(){
        console.log(this.state)
        if(this.state.value === undefined)
            return null;

        if(this.state.value.data === undefined)
            return null;

        //let imagess = this.state.value.data.result.map(result => <li>{this.state.value.data.result.hash}: {this.state.value.data.result.hash}</li>)


        let images = this.state.value.data.result.map((el, i) => (
            <TableRow key={el.hash}>
              <TableCell>{el.timeStamp}</TableCell>
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
                    <TableCell align="right">Transaction Type</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {images}
                </TableBody>
              </Table>
            </Paper>
            </div>
        );
    }
}

export default withStyles(styles)(Transactions);
