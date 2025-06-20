import { Tag } from '@zendeskgarden/react-tags'
import { CheckResultState } from '../api/HealthCheck'

const resultStates = {
  PASSED: { color: 'successHue', label: 'pass' },
  FAILED: { color: 'dangerHue', label: 'fail' },
  SKIPPED: { color: 'neutralHue', label: 'skip' },
} as Record<CheckResultState, {color: string, label: string}>

type StateIconProps = {
  state: CheckResultState
}

const StateIcon = ({state}: StateIconProps) => (
  <Tag
    hue={resultStates[state]?.color ?? 'primaryHue'}
    style={{
      width: '5em',
      minWidth: '4em',
      height: '2em',
    }}
  >
    <span>{resultStates[state]?.label ?? 'n/a'}</span>
  </Tag>
)

export default StateIcon
