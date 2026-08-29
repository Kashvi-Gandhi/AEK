// import React from "react";
// import {
//   Container,
//   VBox,
// BannerHeader, BasicSegment,
// } from "@ombiel/aek-lib";

// export default class Screen extends React.Component {
//   render() {
//     const userDetails = window.userDetails || {};

//     return (
//       <Container>
//         <VBox>
//           <BannerHeader theme="alt" key="header" data-flex={0}>
//             User Details
//           </BannerHeader>

//           <BasicSegment>
//             <pre>
//               {JSON.stringify(userDetails, null, 2)}
//             </pre>
//           </BasicSegment>
//         </VBox>
//       </Container>
//     );
//   }
// }









// import React from "react";

// import {
//   Container,
//   VBox,
//   BannerHeader,
//   BasicSegment,
// } from "@ombiel/aek-lib";

// export default class Screen extends React.Component {
//   constructor(props) {
//     super(props);

//     const userDetails = window.userDetails || {};

//     const isGuest =
//       typeof window.isGuest != "boolean"
//         ? window.isGuest
//         : userDetails.username;

//     this.state = {
//       userDetails,
//       isGuest,
//       showDetails: false,
//     };
//   }

//   handleViewDetails = () => {
//     this.setState({
//       showDetails: true,
//     });
//   };

//   renderUserDetails = () => {
//     const { userDetails } = this.state;

//     return (
//       <BasicSegment>
//         <h3>My Details</h3>

//         <p>
//           <strong>Username:</strong>{" "}
//           {userDetails.username || "Not available"}
//         </p>

//         <p>
//           <strong>Email:</strong>{" "}
//           {userDetails.emailAddress || "Not available"}
//         </p>

//         <p>
//           <strong>First Name:</strong>{" "}
//           {userDetails.firstName || "Not available"}
//         </p>

//         <p>
//           <strong>Last Name:</strong>{" "}
//           {userDetails.lastName || "Not available"}
//         </p>

//         <hr />

//         <h4>All Available User Attributes</h4>

//         <pre
//           style={{
//             overflowX: "auto",
//             padding: "10px",
//             background: "#f5f5f5",
//           }}
//         >
//           {JSON.stringify(userDetails, null, 2)}
//         </pre>
//       </BasicSegment>
//     );
//   };

//   render() {
//     const { isGuest, showDetails } = this.state;

//     return (
//       <Container>
//         <VBox>
//           {/* <BannerHeader theme="alt" key="header" data-flex={0}>
//             User Details
//           </BannerHeader> */}

//           <BasicSegment>
//             <p>
//               View the details available for your currently logged-in
//               campusM account.
//             </p>

//             <button
//               type="button"
//               onClick={this.handleViewDetails}
//             >
//               View My Details
//             </button>
//           </BasicSegment>

//           {showDetails && (
//             <>
//               {isGuest ? (
//                 <BasicSegment>
//                   <h3>Guest User</h3>

//                   <p>
//                     You are currently browsing as a guest.
//                     Please log in to campusM to view your account details.
//                   </p>
//                 </BasicSegment>
//               ) : (
//                 this.renderUserDetails()
//               )}
//             </>
//           )}
//         </VBox>
//       </Container>
//     );
//   }
// }































import React from "react";
import { Container, BannerHeader, BasicSegment } from "@ombiel/aek-lib";

export default class Screen extends React.Component {
  render() {
    return (
      <Container>
        <BannerHeader theme="alt">Test Screen</BannerHeader>
        <BasicSegment>
          <p>Hello! Simple text is working successfully.</p>
        </BasicSegment>
      </Container>
    );
  }
}