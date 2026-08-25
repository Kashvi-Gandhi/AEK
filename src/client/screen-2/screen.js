import React from "react";
import {
  Container,
  VBox,
  BannerHeader,
  BasicSegment,
} from "@ombiel/aek-lib";

export default class Screen extends React.Component {
  render() {
    const userDetails = window.userDetails || {};

    return (
      <Container>
        <VBox>
          <BannerHeader theme="alt" key="header" data-flex={0}>
            User Details
          </BannerHeader>

          <BasicSegment>
            <pre>
              {JSON.stringify(userDetails, null, 2)}
            </pre>
          </BasicSegment>
        </VBox>
      </Container>
    );
  }
}