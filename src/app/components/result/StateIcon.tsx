import React from 'react'
import { Tag } from '@zendeskgarden/react-tags'

const resultStates = {
  PASSED: { color: 'successHue', label: 'pass' },
  FAILED: { color: 'dangerHue', label: 'fail' },
  SKIPPED: { color: 'neutralHue', label: 'skip' }
}

const StateIcon = ({ state }) => (
  <Tag hue={resultStates[state]?.color ?? 'primaryHue'} style={{ width: '4em', minWidth: '4em' }}>
    <span>{resultStates[state]?.label ?? 'n/a'}</span>
  </Tag>
)

export default StateIcon
