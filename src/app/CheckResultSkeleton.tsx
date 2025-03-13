
import React from 'react';
import { Row, Col } from '@zendeskgarden/react-grid';
import { MD, XXL } from '@zendeskgarden/react-typography';
import { Skeleton } from '@zendeskgarden/react-loaders';

const CheckResultSkeleton = () => (
  <Row justifyContent="center">
    <Col sm={5}>
      <XXL>
        <Skeleton />
      </XXL>
      <MD>
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </MD>
    </Col>
  </Row>
);

export default CheckResultSkeleton;
