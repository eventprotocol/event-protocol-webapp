import React from 'react';

// to use session to store eth address instead
// forms is used for development purposes
const AddUser = (props) => {
  return(
    <form>
      <div className="form-group">
        <input 
          name="eth_address"
          className="form-control input-lg"
          placeholder="No Ethereum Address Detected!"
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

export default AddUser;
