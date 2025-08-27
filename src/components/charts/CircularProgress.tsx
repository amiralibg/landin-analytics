import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import type { CircularProgressProps } from '../../types'

const CircularProgress: React.FC<CircularProgressProps> = ({ score, label, color = '#3500c0' }) => {
  const roundedScore = Math.round(score)
  
  const getTrailColor = (): string => {
    if (roundedScore >= 80) return '#10b981'
    if (roundedScore >= 60) return '#f59e0b'
    return '#ef4444'
  }

  return (
    <div className="text-center">
      <div className="w-20 h-20 mx-auto mb-3">
        <CircularProgressbar
          value={roundedScore}
          text={`${roundedScore}`}
          styles={buildStyles({
            // Rotation of path and trail, in number of turns (0-1)
            rotation: 0.25,
            
            // Whether to use rounded or flat corners on the ends
            strokeLinecap: 'round',
            
            // Text size
            textSize: '24px',
            
            // How long animation takes to go from one percentage to another, in seconds
            pathTransitionDuration: 1.5,
            
            // Can specify path transition in more detail, or remove it entirely
            // pathTransition: 'none',
            
            // Colors
            pathColor: getTrailColor(),
            textColor: '#1f2937',
            trailColor: '#e5e7eb',
            backgroundColor: color,
          })}
        />
      </div>
      <div className="text-sm font-medium text-gray-700">{label}</div>
      <div className="text-xs text-gray-500">امتیاز: {roundedScore}</div>
    </div>
  )
}

export default CircularProgress