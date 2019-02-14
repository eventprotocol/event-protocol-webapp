import EventToken from "./EventToken.json"
import EventContract from "./EventContract.json"

var Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/JRIhcMSUX50sCH9PKk6b"));
const token_abi = EventToken.abi
const event_abi = EventContract.abi

var input = "00000000000000000000000089e8a23ca8bab8bef769df2c10c060dc1c30053f00000000000000000000000000000000000000000000000ad78ebc5ac62000000000000000000000000000000000000000000000000000000000000000000001"
// abi[2] is tokenfallback
console.log(token_abi)
console.log(web3.eth.abi.decodeParameters(token_abi[10].inputs, input))

function getContractId(transaction_input){
  var event_id = -1

  //tokenfallback function abi
  const tokenFallback_ = "0x95f847fd"
  const resolve_event = "0xda9db866"

  var key = transaction_input.slice(0, 10)
  var input = transaction_input.slice(10, transaction_input.length)

  if (key === tokenFallback_){
    event_id = web3.eth.abi.decodeParameters(token_abi[10].inputs, input)
  }

  if (key === resolve_event){
    event_id = web3.eth.abi.decodeParameters(token_abi[5].inputs, input)
  }

  return event_id

}

function isEventTransaction(transaction_input, id){
  var event_id = -1
  var value = 0
  //tokenfallback function abi
  const tokenFallback_ = "0x95f847fd"
  const resolve_event = "0xda9db866"

  var key = transaction_input.slice(0, 10)
  var input = transaction_input.slice(10, transaction_input.length)

  if (key === tokenFallback_){
    event_id =  web3.eth.abi.decodeParameters(token_abi[10].inputs, input)[2]

  }

  if (key === resolve_event){
    event_id = web3.eth.abi.decodeParameters(event_abi[5].inputs, input)[0]
  }

  if (event_id === id){
    return true
  }
  return false

}
