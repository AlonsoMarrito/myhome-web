import React from "react";

const TextTitle = ({ textTitleParam }) => {
    const textTitle = {
        width: "100%",
        textAlign: "center",
        marginBottom: "2vh"
    }

  return (
    <div style={textTitle}>
        <h1>{textTitleParam}</h1>
    </div>
  );
};

export default TextTitle;
