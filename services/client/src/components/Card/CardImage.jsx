import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// @material-ui/icons
// core components

import cardImageStyle from "../../assets/jss/material-dashboard-react/components/cardImageStyle.jsx";

function CardImage({ ...props }) {
  const { classes, children, className, plain, profile, ...rest } = props;
  const cardImageClasses = classNames({
    [classes.cardImage]: true,
    [classes.cardImageProfile]: profile,
    [classes.cardImagePlain]: plain,
    [className]: className !== undefined
  });
  return (
    <div className={cardImageClasses} {...rest}>
      {children}
    </div>
  );
}

CardImage.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  profile: PropTypes.bool,
  plain: PropTypes.bool
};

export default withStyles(cardImageStyle)(CardImage);
