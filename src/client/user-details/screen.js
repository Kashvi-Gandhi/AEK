import React from "react";
import { Container, VBox, BannerHeader, BasicSegment } from "@ombiel/aek-lib";

const Screen = () => {
  // Read the variable attached to the window object by your .ect file
  console.log("screen.js script added");
  console.log("window.userDetailsData:", window.userDetailsData);
  console.log("window.userData:", window.userData);
  const data = window.userDetailsData || {};
  const username = window.username || "Not available";

  return (
    <Container>
      <BannerHeader title="React Test" />
      <BasicSegment>
        <h1>REACT TEST SUCCESSFUL</h1>
        <p>This content is coming from screen.js</p>

        {/* Displaying ECT Variables */}
        <div
          style={{
            marginTop: "15px",
            padding: "10px",
            background: "#f0f0f0",
            borderRadius: "4px",
          }}
        >
          <h3>Variables from ECT File:</h3>
          <p>
            Test Message Variable:
            {JSON.stringify(data.tokenAttributes, null, 2)}
          </p>
          <p>
            Second Message Variable:
            {JSON.stringify(data.extraAttributes, null, 2)}
          </p>
          <p>Username Variable: {username}</p>

        </div>
      </BasicSegment>
    </Container>
  );
};

export default Screen;
