import React from "react";
import { Container, VBox, BannerHeader, BasicSegment } from "@ombiel/aek-lib";

import PdfViewer from "./pdf-viewer";
import {
  getWelcomePackInfo,
  getWelcomePackContent,
  getParticipantType,
} from "../../services/documentService";
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
      error: "",
    };

    this.loadDocumentInfo = this.loadDocumentInfo.bind(this);
    this.openDocument = this.openDocument.bind(this);
    this.closeDocument = this.closeDocument.bind(this);
  }

  componentDidMount() {
    this.loadDocumentInfo();
  }

  async loadDocumentInfo() {
    this.setState({ loadingInfo: true, available: false, error: "" });

    try {
      // 1. Fetch ParticipantType dynamically from AIFS API using Contact ID
      const fetchedCampus = await getParticipantType(contactid);

      // 2. Immediately reflect the fetched campus in state
      this.setState({ campus: fetchedCampus });

      // 3. Fetch SharePoint document using the updated campus
      const result = await getWelcomePackInfo(
        fetchedCampus,
        this.state.documentType,
      );

      this.setState({
        loadingInfo: false,
        available: result.available === true,
        campus: fetchedCampus,
        documentType: result.documentType || this.state.documentType,
        fileName: result.fileName || "",
        fileSize: result.fileSize || null,
        error: "",
      });
    } catch (error) {
      this.setState({
        loadingInfo: false,
        available: false,
        error: error.message || String(error),
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
        error: "",
      });
    } catch (error) {
      this.setState({
        openingPdf: false,
        error: error.message || String(error),
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
      error,
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
                        <strong>File Size:</strong>{" "}
                        {Math.round(fileSize / 1024)} KB
                      </p>
                    )}

                    <br />
                    <button
                      type="button"
                      onClick={this.openDocument}
                      disabled={openingPdf}
                      style={{ padding: "10px 20px", cursor: "pointer" }}
                    >
                      {openingPdf
                        ? `Opening ${documentType}...`
                        : `View ${documentType}`}
                    </button>
                  </div>
                ) : (
                  <p>
                    No <strong>{documentType}</strong> is currently available
                    for <strong>{campus}</strong>.
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
