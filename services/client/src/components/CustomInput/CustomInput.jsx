import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
// @material-ui/icons
import Clear from "@material-ui/icons/Clear";
import Check from "@material-ui/icons/Check";
// core components
import customInputStyle from "../../assets/jss/material-dashboard-react/components/customInputStyle";

class CustomInput extends React.Component {
  // constructor(props) {
  //   super(props);
  //   // const {
  //   //   classes,
  //   //   formControlProps,
  //   //   labelText,
  //   //   id,
  //   //   labelProps,
  //   //   inputProps,
  //   //   error,
  //   //   success,
  //   //   value
  //   // } = props;
  // }

  render() {
    const labelClasses = classNames({
      [" " + this.props.classes.labelRootError]: this.props.error,
      [" " + this.props.classes.labelRootSuccess]: this.props.success && !this.props.error
    });
    const underlineClasses = classNames({
      [this.props.classes.underlineError]: this.props.error,
      [this.props.classes.underlineSuccess]: this.props.success && !this.props.error,
      [this.props.classes.underline]: true
    });
    const marginTop = classNames({
      [this.props.classes.marginTop]: this.props.labelText === undefined
    });

    return (
      <FormControl
        {...this.props.formControlProps}
        className={this.props.formControlProps.className + " " + this.props.classes.formControl}
      >
        {this.props.labelText !== undefined ? (
          <InputLabel
            className={this.props.classes.labelRoot + this.props.labelClasses}
            htmlFor={this.props.id}
            {...this.props.labelProps}
          >
            {this.props.labelText}
          </InputLabel>
        ) : null}
        <Input
          classes={{
            root: marginTop,
            disabled: this.props.classes.disabled,
            underline: underlineClasses
          }}
          id={this.props.id}
          value={this.props.value}
          onChange={this.props.onChange}
          {...this.props.inputProps}
        />
        {this.props.error ? (
          <Clear className={this.props.classes.feedback + " " + this.props.classes.labelRootError} />
        ) : this.props.success ? (
          <Check className={this.props.classes.feedback + " " + this.props.classes.labelRootSuccess} />
        ) : null}
      </FormControl>
    );

  }
}

CustomInput.propTypes = {
  classes: PropTypes.object.isRequired,
  labelText: PropTypes.node,
  labelProps: PropTypes.object,
  id: PropTypes.string,
  inputProps: PropTypes.object,
  formControlProps: PropTypes.object,
  error: PropTypes.bool,
  success: PropTypes.bool
};

export default withStyles(customInputStyle)(CustomInput);
