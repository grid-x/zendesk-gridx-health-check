import React from 'react'

import { Alert, Title, Close } from '@zendeskgarden/react-notifications'

type ApiErrorProps = {
  errorMessage: any
  onClose: () => void
}

const ApiError = ({ errorMessage, onClose }: ApiErrorProps) => {
  return (
    <Alert type="error">
      <Title>Error {errorMessage.status}</Title>
      {errorMessage.responseText}
      <Close aria-label="Close" onClick={onClose} />
    </Alert>
  )
}

export default ApiError
