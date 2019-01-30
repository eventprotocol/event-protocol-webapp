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
    }

    componentDidMount(){
      const str = 'http://api-rinkeby.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${token}'
      const obj = {address:this.props.eth_address, token:'RA5HQDQNQXD9V1FK6ZTEJYWDGYWPAEPURC'}


      const result = new Function('const {' + Object.keys(obj).join(',') + '} = this.obj;return `' + str + '`').call({obj})

        axios.get(result)
          .then((response) => {
              let fileList = response;
              this.setState({
                  value: fileList
              });
          })
    }

    render(){
        console.log(this.props.eth_address)
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
              <TableCell>{el.value}</TableCell>
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
                    <TableCell align="right">Value</TableCell>
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
