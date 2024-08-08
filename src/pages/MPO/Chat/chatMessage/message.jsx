import React from "react";
import Avatar from "@mui/material/Avatar";
import { deepOrange } from "@mui/material/colors";
import { styled } from "@mui/material/styles";

// Styled components for the messages
const MessageRow = styled('div')({
  display: "flex",
});

const MessageRowRight = styled('div')({
  display: "flex",
  justifyContent: "flex-end",
});

const MessageBlue = styled('div')({
  position: "relative",
  marginLeft: "20px",
  marginBottom: "10px",
  padding: "10px",
  backgroundColor: "#A8DDFD",
  width: "auto",
  textAlign: "left",
  font: "400 .9em 'Open Sans', sans-serif",
  border: "1px solid #91c8eb",
  borderRadius: "10px",
  "&:after": {
    content: "''",
    position: "absolute",
    width: "0",
    height: "0",
    borderTop: "15px solid #A8DDFD",
    borderLeft: "15px solid transparent",
    borderRight: "15px solid transparent",
    top: "0",
    left: "-15px",
  },
  "&:before": {
    content: "''",
    position: "absolute",
    width: "0",
    height: "0",
    borderTop: "17px solid #97C6E3",
    borderLeft: "16px solid transparent",
    borderRight: "16px solid transparent",
    top: "-1px",
    left: "-17px",
  },
});

const MessageOrange = styled('div')({
  position: "relative",
  marginRight: "20px",
  marginBottom: "10px",
  padding: "10px",
  backgroundColor: "#145a87",
  width: "auto",
  textAlign: "left",
  font: "400 .9em 'Open Sans', sans-serif",
  border: "1px solid #dfd087",
  borderRadius: "10px",
  "&:after": {
    content: "''",
    position: "absolute",
    width: "0",
    height: "0",
    borderTop: "15px solid #145a87",
    borderLeft: "15px solid transparent",
    borderRight: "15px solid transparent",
    top: "0",
    right: "-15px",
  },
  "&:before": {
    content: "''",
    position: "absolute",
    width: "0",
    height: "0",
    borderTop: "17px solid #dfd087",
    borderLeft: "16px solid transparent",
    borderRight: "16px solid transparent",
    top: "-1px",
    right: "-17px",
  },
});

const MessageContent = styled('p')({
  padding: 0,
  margin: 0,
  color: "white",
});

const MessageTimeStampRight = styled('div')({
  position: "absolute",
  fontSize: ".8em",
  fontWeight: "600",
  marginTop: "10px",
  bottom: "0px",
  right: "5px",
  color: "white",
});

const OrangeAvatar = styled(Avatar)(({ theme }) => ({
  color: theme.palette.getContrastText(deepOrange[500]),
  backgroundColor: deepOrange[500],
  width: theme.spacing(4),
  height: theme.spacing(4),
}));

const DisplayName = styled('div')({
  marginLeft: "20px",
});

export const MessageLeft = (props) => {
  const { message = "no message", timestamp = "", photoURL = "dummy.js", displayName = "Hamro Name" } = props;

  return (
    <MessageRow>
      <OrangeAvatar alt={displayName} src={photoURL} />
      <div>
        <DisplayName>{displayName}</DisplayName>
        <MessageBlue>
          <div>
            <MessageContent>{message}</MessageContent>
          </div>
          <MessageTimeStampRight>{timestamp}</MessageTimeStampRight>
        </MessageBlue>
      </div>
    </MessageRow>
  );
};

export const MessageRight = (props) => {
  const { message = "no message", timestamp = "" } = props;

  return (
    <MessageRowRight>
      <MessageOrange>
        <MessageContent>{message}</MessageContent>
        <MessageTimeStampRight>{timestamp}</MessageTimeStampRight>
      </MessageOrange>
    </MessageRowRight>
  );
};
