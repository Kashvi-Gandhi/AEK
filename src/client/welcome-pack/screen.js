import React from 'react';
import { Container, VBox, BannerHeader, BasicSegment, Button } from '@ombiel/aek-lib';

export default class Screen extends React.Component {
  state = {
    loading: false,
    error: null
  };

  handleFetchAndOpen = async () => {
    this.setState({ loading: true, error: null });

    try {
      const response = await fetch('/api/welcome-pack');
      const data = await response.json();

      if (data.success && data.file) {
        window.open(data.file.webUrl, '_blank');
        this.setState({ loading: false });
      } else {
        this.setState({ error: 'Could not fetch document.', loading: false });
      }
    } catch (err) {
      this.setState({ error: err.message, loading: false });
    }
  };

  render() {
    const { loading, error } = this.state;

    return (
      <Container>
        <VBox>
          <BannerHeader theme="alt" key="header" data-flex={0}>
            Welcome Pack
          </BannerHeader>
          <BasicSegment>
            <h3>Student Welcome Handbook</h3>
            <p>Click below to view your destination welcome guide.</p>
            
            <Button 
              onClick={this.handleFetchAndOpen} 
              theme="primary"
              disabled={loading}
            >
              {loading ? 'Fetching PDF...' : 'Welcome Pack'}
            </Button>

            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
          </BasicSegment>
        </VBox>
      </Container>
    );
  }
}