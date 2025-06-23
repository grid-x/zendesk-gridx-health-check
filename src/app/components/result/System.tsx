import { SystemCheckResult, HealthCheckInfo } from '../api/HealthCheck'
import { Accordion } from '@zendeskgarden/react-accordions'
import Check from './Check'
import { Anchor } from '@zendeskgarden/react-buttons'
import { Tag } from '@zendeskgarden/react-tags'


type CheckResultProps = SystemCheckResult & {
  checkInfo: HealthCheckInfo
}

// System of checks for one system
const System = ({ system, results, checkInfo }: CheckResultProps) => (
  <>
    <Tag isPill>
      <Anchor
        href={`https://xenon.gridx.ai/systems/${system.id}`}
        target="_blank"
        isExternal
        isUnderlined={false}
      >
        XENON {system.id}
      </Anchor>
    </Tag>

    <Accordion
      level={4}
      isExpandable
    >
      {results.map((res) => (
        <Check
          key={res.type}
          name={checkInfo[res.type]?.name || res.type}
          description={checkInfo[res.type]?.description}
          {...res}
        />
      ))}
    </Accordion>
  </>
)

export default System
