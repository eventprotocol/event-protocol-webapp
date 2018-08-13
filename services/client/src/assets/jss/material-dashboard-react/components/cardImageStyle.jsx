const cardImageStyle = {
  cardImage: {
    "&$cardImageProfile img": {
      width: "100%",
      height: "auto"
    }
  },
  cardImageProfile: {
    maxWidth: "415px",
    maxHeight: "301px",
    margin: "-15px auto 0",
    overflow: "hidden",
    borderRadius: "2%",
    padding: "0",
    boxShadow:
      "0 4px 4px -12px rgba(0, 0, 0, 0.20), 0 6px 5px -2px rgba(0, 0, 0, 0.15), 0 4px 10px -8px rgba(0, 0, 0, 0.20)",
    "&$cardImagePlain": {
      marginTop: "0"
    }
  },
  cardImagePlain: {}
};

export default cardImageStyle;
