import React from "react";
import { Container, VBox, BannerHeader, BasicSegment } from "@ombiel/aek-lib";

export default class Screen extends React.Component {
  render() {
    // Retrieves user details from window object (supports both direct object or nested details object)
    const rawData = window.userDetails || {};
    const userDetails = rawData.details || rawData;

    const contactId = userDetails.ContactID || userDetails.username || "Not available";
    const firstName = userDetails.FirstName || userDetails.firstName || userDetails.givenName || "Not available";
    const lastName = userDetails.LastName || userDetails.lastName || userDetails.surname || "Not available";
    const email = userDetails.EmailAddress || userDetails.emailAddress || userDetails.email || "Not available";

    const hasAttributes = Object.keys(userDetails).length > 0;

    return (
      <Container>
        <VBox>
          <BannerHeader theme="alt" key="header" data-flex={0}>
            User Details
          </BannerHeader>

          <BasicSegment>
            <h3>My Details</h3>

            <p>
              <strong>Contact ID:</strong> {contactId}
            </p>

            <p>
              <strong>First Name:</strong> {firstName}
            </p>

            <p>
              <strong>Last Name:</strong> {lastName}
            </p>

            <p>
              <strong>Email Address:</strong> {email}
            </p>

            <hr />

            <h4>All Available User Attributes</h4>

            <pre
              style={{
                overflowX: "auto",
                padding: "10px",
                background: "#f5f5f5",
              }}
            >
              {hasAttributes
                ? JSON.stringify(userDetails, null, 2)
                : "Not available"}
            </pre>
          </BasicSegment>
        </VBox>
      </Container>
    );
  }
}