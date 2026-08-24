import React from 'react';
import { Container, VBox, BannerHeader, BasicSegment, Button } from '@ombiel/aek-lib';

export default class Screen extends React.Component {
  state = {
    loading: true,
    file: null,
    error: null
  };

  componentDidMount() {
    this.fetchFileDetails();
  }

  fetchFileDetails = async () => {
    try {
      const response = await fetch('/router/welcomePack', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success && data.file) {
        this.setState({ file: data.file, loading: false });
      } else {
        this.setState({ error: data.error || 'Could not fetch the document.', loading: false });
      }
    } catch (err) {
      this.setState({ error: 'Failed to load document details: ' + err.message, loading: false });
    }
  };

  openPDF = () => {
    const { file } = this.state;
    if (file && file.webUrl) {
      window.open(file.webUrl, '_blank');
    }
  };

  render() {
    const { loading, file, error } = this.state;

    return (
      <Container>
        <VBox>
          <BannerHeader theme="alt">
            Welcome Pack
          </BannerHeader>
          <BasicSegment>
            {loading && <p>Loading document...</p>}

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {file && !loading && (
              <div>
                <h3>{file.name}</h3>
                <p>Click the button below to view your welcome guide.</p>
                <Button onClick={this.openPDF} theme="primary">
                  Open PDF
                </Button>
              </div>
            )}
          </BasicSegment>
        </VBox>
      </Container>
    );
  }
}
