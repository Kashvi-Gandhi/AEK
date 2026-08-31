// import React from "react";
// import { Container, VBox, BannerHeader, BasicSegment } from "@ombiel/aek-lib";

// export default class Screen extends React.Component {
//   render() {
//     // Retrieves user details from window object (supports both direct object or nested details object)
//     const rawData = window.userDetails || {};
//     const userDetails = rawData.details || rawData;

//     const contactId = userDetails.ContactID || userDetails.username || "Not available";
//     const firstName = userDetails.FirstName || userDetails.firstName || userDetails.givenName || "Not available";
//     const lastName = userDetails.LastName || userDetails.lastName || userDetails.surname || "Not available";
//     const email = userDetails.EmailAddress || userDetails.emailAddress || userDetails.email || "Not available";

//     const hasAttributes = Object.keys(userDetails).length > 0;

//     return (
//       <Container>
//         <VBox>
//           <BannerHeader theme="alt" key="header" data-flex={0}>
//             User Details
//           </BannerHeader>

//           <BasicSegment>
//             <h3>My Details</h3>

//             <p>
//               <strong>Contact ID:</strong> {contactId}
//             </p>

//             <p>
//               <strong>First Name:</strong> {firstName}
//             </p>

//             <p>
//               <strong>Last Name:</strong> {lastName}
//             </p>

//             <p>
//               <strong>Email Address:</strong> {email}
//             </p>

//             <hr />

//             <h4>All Available User Attributes</h4>

//             <pre
//               style={{
//                 overflowX: "auto",
//                 padding: "10px",
//                 background: "#f5f5f5",
//               }}
//             >
//               {hasAttributes
//                 ? JSON.stringify(userDetails, null, 2)
//                 : "Not available"}
//             </pre>
//           </BasicSegment>
//         </VBox>
//       </Container>
//     );
//   }
// }



























import React from "react";
import { Container, VBox, BannerHeader, BasicSegment } from "@ombiel/aek-lib";

export default class Screen extends React.Component {
  render() {
    const userDetails = window.userDetails || {};
    const entries = Object.entries(userDetails);

    return (
      <Container>
        <VBox>
          <BannerHeader theme="alt" key="header" data-flex={0}>
            Raw CMAuth Attributes
          </BannerHeader>

          <BasicSegment>
            <h3>All Available Attributes ({entries.length})</h3>

            {entries.length > 0 ? (
              <ul>
                {entries.map(([key, value]) => (
                  <li key={key} style={{ marginBottom: "8px" }}>
                    <strong>{key}:</strong>{" "}
                    {typeof value === "object"
                      ? JSON.stringify(value)
                      : String(value)}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No attributes found (window.userDetails is empty).</p>
            )}

            <hr />

            <h4>Raw JSON Object Dump</h4>

            <pre
              style={{
                overflowX: "auto",
                padding: "10px",
                background: "#f5f5f5",
                fontSize: "12px",
              }}
            >
              {JSON.stringify(userDetails, null, 2)}
            </pre>
          </BasicSegment>
        </VBox>
      </Container>
    );
  }
}


//need to show user details on the page in basic any form (json, etc). 