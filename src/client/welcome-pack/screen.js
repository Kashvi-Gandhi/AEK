// import React from "react";

// import {
//   Container,
//   VBox,
//   BannerHeader,
//   BasicSegment,
// } from "@ombiel/aek-lib";


// import PdfViewer from "../welcome-pack/pdf-viewer";


// /*
//  * ============================================================
//  * Welcome Pack POC
//  * ============================================================
//  *
//  * PDF DISPLAY IS NOW DONE USING PDF.js.
//  *
//  * We no longer use:
//  *
//  *   <iframe src={blobUrl}>
//  *
//  * Instead:
//  *
//  * Node Proxy
//  *      ->
//  * PDF bytes
//  *      ->
//  * ArrayBuffer
//  *      ->
//  * Uint8Array
//  *      ->
//  * PDF.js
//  *      ->
//  * Canvas pages
//  * ============================================================
//  */


// const PROXY_URL =
//   "http://localhost:3001";


// export default class Screen extends React.Component {

//   constructor(props) {

//     super(props);


//     this.state = {

//       loadingInfo:
//         true,

//       openingPdf:
//         false,

//       available:
//         false,

//       campus:
//         "",

//       documentType:
//         "",

//       fileName:
//         "",

//       fileSize:
//         null,

//       /*
//        * With PDF.js we store bytes,
//        * not a Blob URL.
//        */

//       pdfData:
//         null,

//       error:
//         ""
//     };


//     this.loadWelcomePackInfo =
//       this.loadWelcomePackInfo.bind(this);


//     this.openWelcomePack =
//       this.openWelcomePack.bind(this);


//     this.closeWelcomePack =
//       this.closeWelcomePack.bind(this);
//   }


//   /*
//    * ==========================================================
//    * Initial screen load
//    * ==========================================================
//    */

//   componentDidMount() {

//     this.loadWelcomePackInfo();
//   }


//   /*
//    * ==========================================================
//    * Load metadata
//    * ==========================================================
//    */

//   async loadWelcomePackInfo() {

//     console.log(
//       "=========================================="
//     );

//     console.log(
//       "LOADING WELCOME PACK INFORMATION"
//     );

//     console.log(
//       "=========================================="
//     );


//     this.setState({

//       loadingInfo:
//         true,

//       available:
//         false,

//       error:
//         ""
//     });


//     try {

//       const response =
//         await fetch(
//           PROXY_URL +
//           "/api/welcome-pack/info",
//           {

//             method:
//               "GET",

//             headers: {

//               "Accept":
//                 "application/json"
//             }
//           }
//         );


//       const result =
//         await response.json();


//       if (!response.ok) {

//         throw new Error(
//           result.message ||
//           "Unable to retrieve Welcome Pack information."
//         );
//       }


//       console.log(
//         "Welcome Pack found"
//       );


//       console.log(
//         "Campus:",
//         result.campus
//       );


//       console.log(
//         "File:",
//         result.fileName
//       );


//       this.setState({

//         loadingInfo:
//           false,

//         available:
//           result.available === true,

//         campus:
//           result.campus || "",

//         documentType:
//           result.documentType || "",

//         fileName:
//           result.fileName || "",

//         fileSize:
//           result.fileSize || null,

//         error:
//           ""
//       });


//     } catch (error) {

//       console.error(
//         "Welcome Pack information failed:"
//       );


//       console.error(
//         error
//       );


//       this.setState({

//         loadingInfo:
//           false,

//         available:
//           false,

//         error:
//           error.message ||
//           String(error)
//       });
//     }
//   }


//   /*
//    * ==========================================================
//    * Retrieve PDF bytes
//    * ==========================================================
//    */

//   async openWelcomePack() {

//     console.log(
//       "=========================================="
//     );

//     console.log(
//       "RETRIEVING PDF FOR PDF.JS"
//     );

//     console.log(
//       "=========================================="
//     );


//     this.setState({

//       openingPdf:
//         true,

//       error:
//         ""
//     });


//     try {

//       const response =
//         await fetch(
//           PROXY_URL +
//           "/api/welcome-pack/content",
//           {

//             method:
//               "GET",

//             headers: {

//               "Accept":
//                 "application/pdf"
//             }
//           }
//         );


//       if (!response.ok) {

//         let message =
//           "Unable to retrieve Welcome Pack PDF.";


//         try {

//           const result =
//             await response.json();


//           if (result.message) {

//             message =
//               result.message;
//           }

//         } catch (e) {

//           /*
//            * Ignore JSON parsing failure.
//            */
//         }


//         throw new Error(
//           message
//         );
//       }


//       /*
//        * ======================================================
//        * Important difference from iframe version.
//        *
//        * OLD:
//        *
//        * response.blob()
//        * URL.createObjectURL(blob)
//        * iframe
//        *
//        * NEW:
//        *
//        * response.arrayBuffer()
//        * Uint8Array
//        * PDF.js
//        * ======================================================
//        */

//       const arrayBuffer =
//         await response.arrayBuffer();


//       const pdfData =
//         new Uint8Array(
//           arrayBuffer
//         );


//       console.log(
//         "PDF bytes received:",
//         pdfData.length
//       );


//       this.setState({

//         openingPdf:
//           false,

//         pdfData:
//           pdfData,

//         error:
//           ""
//       });


//     } catch (error) {

//       console.error(
//         "Unable to retrieve PDF:"
//       );


//       console.error(
//         error
//       );


//       this.setState({

//         openingPdf:
//           false,

//         error:
//           error.message ||
//           String(error)
//       });
//     }
//   }


//   /*
//    * ==========================================================
//    * Return to Welcome Pack screen
//    * ==========================================================
//    */

//   closeWelcomePack() {

//     this.setState({

//       pdfData:
//         null,

//       error:
//         ""
//     });
//   }


//   /*
//    * ==========================================================
//    * PDF.js screen
//    * ==========================================================
//    */

//   renderPdf() {

//     const {
//       campus,
//       fileName,
//       pdfData
//     } = this.state;


//     return (

//       <Container>

//         <VBox>


//           <BannerHeader
//             theme="alt"
//             key="header"
//             data-flex={0}
//           >

//             Welcome Pack - {campus}

//           </BannerHeader>


//           <BasicSegment>


//             <PdfViewer

//               pdfData={
//                 pdfData
//               }

//               fileName={
//                 fileName
//               }

//               onBack={
//                 this.closeWelcomePack
//               }

//             />


//           </BasicSegment>


//         </VBox>

//       </Container>
//     );
//   }


//   /*
//    * ==========================================================
//    * Main Welcome Pack screen
//    * ==========================================================
//    */

//   renderMain() {

//     const {
//       loadingInfo,
//       openingPdf,
//       available,
//       campus,
//       fileName,
//       fileSize,
//       error
//     } = this.state;


//     return (

//       <Container>

//         <VBox>


//           <BannerHeader
//             theme="alt"
//             key="header"
//             data-flex={0}
//           >

//             Welcome Pack

//           </BannerHeader>


//           <BasicSegment>
//             <h2>
//               Welcome Pack
//             </h2>
//             {
//               loadingInfo
//                 ? (
//                   <p>
//                     Loading Welcome Pack information...
//                   </p>
//                 )
//                 : (
//                   <div>
//                     <p>
//                       <strong>
//                         Campus:
//                       </strong>
//                       {" "}
//                       {campus}
//                     </p>
//                     {
//                       available
//                         ? (

//                           <div>


//                             <p>

//                               <strong>
//                                 Document:
//                               </strong>

//                               {" "}

//                               {fileName}

//                             </p>


//                             {
//                               fileSize
//                                 ? (

//                                   <p>

//                                     <strong>
//                                       File Size:
//                                     </strong>

//                                     {" "}

//                                     {
//                                       Math.round(
//                                         fileSize /
//                                         1024
//                                       )
//                                     }

//                                     {" KB"}

//                                   </p>

//                                 )
//                                 : null
//                             }


//                             <button
//                               type="button"

//                               onClick={
//                                 this.openWelcomePack
//                               }

//                               disabled={
//                                 openingPdf
//                               }
//                             >

//                               {
//                                 openingPdf
//                                   ? "Opening Welcome Pack..."
//                                   : "View Welcome Pack"
//                               }

//                             </button>


//                           </div>

//                         )
//                         : (

//                           <p>
//                             No Welcome Pack is currently
//                             available for this Campus.
//                           </p>

//                         )
//                     }


//                   </div>

//                 )
//             }
//             {
//               error
//                 ? (
//                   <div>
//                     <hr />
//                     <p>
//                       <strong>
//                         Error:
//                       </strong>
//                     </p>
//                     <p>
//                       {error}
//                     </p>
//                   </div>
//                 )
//                 : null
//             }
//           </BasicSegment>
//         </VBox>
//       </Container>
//     );
//   }
//   /*
//    * ==========================================================
//    * Main render
//    * ==========================================================
//    */
//   render() {
//     if (this.state.pdfData) {
//       return this.renderPdf();
//     }
//     return this.renderMain();
//   }
// }



































import React from "react";
import {
  Container,
  VBox,
  BannerHeader,
  BasicSegment,
} from "@ombiel/aek-lib";

import PdfViewer from "./pdf-viewer";
import { getWelcomePackInfo, getWelcomePackContent } from "../../services/documentService";
import config from "../../config/welcome_config";

export default class Screen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      campus: config.DEFAULT_CAMPUS,
      documentType: config.DEFAULT_DOC_TYPE,

      loadingInfo: true,
      openingPdf: false,
      available: false,
      fileName: "",
      fileSize: null,
      pdfData: null,
      error: ""
    };

    this.loadDocumentInfo = this.loadDocumentInfo.bind(this);
    this.openDocument = this.openDocument.bind(this);
    this.closeDocument = this.closeDocument.bind(this);
  }

  componentDidMount() {
    this.loadDocumentInfo();
  }

  async loadDocumentInfo() {
    const { campus, documentType } = this.state;
    this.setState({ loadingInfo: true, available: false, error: "" });

    try {
      const result = await getWelcomePackInfo(campus, documentType);

      this.setState({
        loadingInfo: false,
        available: result.available === true,
        campus: result.campus || campus,
        documentType: result.documentType || documentType,
        fileName: result.fileName || "",
        fileSize: result.fileSize || null,
        error: ""
      });
    } catch (error) {
      this.setState({
        loadingInfo: false,
        available: false,
        error: error.message || String(error)
      });
    }
  }

  async openDocument() {
    const { campus, documentType } = this.state;
    this.setState({ openingPdf: true, error: "" });

    try {
      const arrayBuffer = await getWelcomePackContent(campus, documentType);
      const pdfData = new Uint8Array(arrayBuffer);

      this.setState({
        openingPdf: false,
        pdfData: pdfData,
        error: ""
      });
    } catch (error) {
      this.setState({
        openingPdf: false,
        error: error.message || String(error)
      });
    }
  }

  closeDocument() {
    this.setState({ pdfData: null, error: "" });
  }

  renderPdf() {
    const { campus, documentType, fileName, pdfData } = this.state;

    return (
      <Container>
        <VBox>
          <BannerHeader theme="alt" key="header" data-flex={0}>
            {documentType} - {campus}
          </BannerHeader>

          <BasicSegment>
            <PdfViewer
              pdfData={pdfData}
              fileName={fileName}
              onBack={this.closeDocument}
            />
          </BasicSegment>
        </VBox>
      </Container>
    );
  }

  renderMain() {
    const {
      campus,
      documentType,
      loadingInfo,
      openingPdf,
      available,
      fileName,
      fileSize,
      error
    } = this.state;

    return (
      <Container>
        <VBox>
          <BannerHeader theme="alt" key="header" data-flex={0}>
            {documentType}
          </BannerHeader>

          <BasicSegment>
            <h2>{documentType} Details</h2>

            {loadingInfo ? (
              <p>Searching for your document...</p>
            ) : (
              <div>
                <p>
                  <strong>Campus:</strong> {campus}
                </p>

                {available ? (
                  <div>
                    <p>
                      <strong>Document:</strong> {fileName}
                    </p>

                    {fileSize && (
                      <p>
                        <strong>File Size:</strong> {Math.round(fileSize / 1024)} KB
                      </p>
                    )}

                    <br />
                    <button
                      type="button"
                      onClick={this.openDocument}
                      disabled={openingPdf}
                      style={{ padding: "10px 20px", cursor: "pointer" }}
                    >
                      {openingPdf ? `Opening ${documentType}...` : `View ${documentType}`}
                    </button>
                  </div>
                ) : (
                  <p>
                    No <strong>{documentType}</strong> is currently available for <strong>{campus}</strong>.
                  </p>
                )}
              </div>
            )}

            {error && (
              <div style={{ marginTop: "20px", color: "red" }}>
                <hr />
                <p>
                  <strong>Error:</strong> {error}
                </p>
              </div>
            )}
          </BasicSegment>
        </VBox>
      </Container>
    );
  }

  render() {
    return this.state.pdfData ? this.renderPdf() : this.renderMain();
  }
}