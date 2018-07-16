import React from 'react';
import PropTypes from 'prop-types';

// to use session to store eth address instead
// forms is used for development purposes
const AddUser = (props, context) => {
  
  const web3Context = context.web3;
  
  return(
    <form>
      <div className="form-group">
        <input 
          name="eth_address"
          className="form-control input-lg"
          placeholder="No Ethereum Address Detected!"
          value={ web3Context.selectedAccount }
          disabled
          required
        />
        <input
          name="username"
          className="form-control input-lg"
          placeholder="Enter a username"
          required
        />
        <input
          name="email"
          className="form-control input-lg"
          placeholder="Enter an email address"
          required
        />
      </div>
      <input
        type="submit"
        className="btn btn-primary btn-lg btn-block"
        value="Submit"
      />
    </form>
  )
};

AddUser.contextTypes = {
  web3: PropTypes.object 
};

export default AddUser;
