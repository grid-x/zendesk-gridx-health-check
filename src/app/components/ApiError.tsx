import React from 'react'

import { Alert } from '@zendeskgarden/react-notifications'

type ApiErrorProps = {
  errorMessage: any
  onClose: () => void
}

const ApiError = ({ errorMessage, onClose }: ApiErrorProps) => {
  return (
    <Alert type="error">
      <Alert.Title>Error {errorMessage.status}</Alert.Title>
      {errorMessage.responseText}
      <Alert.Close aria-label="Close" onClick={onClose} />
    </Alert>
  )
}

export default ApiError
