import { useState, useCallback } from 'react'
import data from '@/../product/sections/calibration/data.json'
import { CalibrationWorkbenchView } from './components/CalibrationWorkbenchView'
import type { Calibration, Complexity } from '@/../product/sections/calibration/types'

export default function CalibrationWorkbenchPreview() {
  const [calibration, setCalibration] = useState<Calibration>(
    () => structuredClone(data.calibration) as unknown as Calibration,
  )
  const [expandedFeatureIds, setExpandedFeatureIds] = useState<Set<string>>(new Set())

  const handleExpand = useCallback((featureId: string) => {
    setExpandedFeatureIds((prev) => new Set(prev).add(featureId))
  }, [])

  const handleCollapse = useCallback((featureId: string) => {
    setExpandedFeatureIds((prev) => {
      const next = new Set(prev)
      next.delete(featureId)
      return next
    })
  }, [])

  const handleUpdateSummary = useCallback(
    (updates: Partial<Calibration['summary']>) => {
      setCalibration((prev) => ({
        ...prev,
        summary: { ...prev.summary, ...updates },
      }))
    },
    [],
  )

  const handleUpdateFeatureActuals = useCallback(
    (featureId: string, actualHours: number | null) => {
      setCalibration((prev) => ({
        ...prev,
        features: prev.features.map((f) =>
          f.featureId === featureId
            ? {
                ...f,
                actualHours,
                status: actualHours !== null ? ('calibrated' as const) : ('pending' as const),
              }
            : f,
        ),
      }))
    },
    [],
  )

  const handleUpdateFeatureComplexity = useCallback(
    (featureId: string, complexity: Complexity) => {
      setCalibration((prev) => ({
        ...prev,
        features: prev.features.map((f) =>
          f.featureId === featureId ? { ...f, actualComplexity: complexity } : f,
        ),
      }))
    },
    [],
  )

  const handleUpdateFeatureFeedback = useCallback(
    (featureId: string, feedback: string) => {
      setCalibration((prev) => ({
        ...prev,
        features: prev.features.map((f) =>
          f.featureId === featureId ? { ...f, feedback } : f,
        ),
      }))
    },
    [],
  )

  const handleUpdateTeamFeedback = useCallback((feedback: string) => {
    setCalibration((prev) => ({ ...prev, teamFeedback: feedback }))
  }, [])

  const handleUpdateTechEffort = useCallback((id: string, percentage: number) => {
    setCalibration((prev) => ({
      ...prev,
      techEffortBreakdown: prev.techEffortBreakdown.map((t) =>
        t.id === id ? { ...t, percentage } : t,
      ),
    }))
  }, [])

  const handleUpdateEffortReasoning = useCallback((reasoning: string) => {
    setCalibration((prev) => ({ ...prev, effortBreakdownReasoning: reasoning }))
  }, [])

  return (
    <CalibrationWorkbenchView
      calibration={calibration}
      expandedFeatureIds={expandedFeatureIds}
      onExpandFeature={handleExpand}
      onCollapseFeature={handleCollapse}
      onUpdateSummary={handleUpdateSummary}
      onUpdateFeatureActuals={handleUpdateFeatureActuals}
      onUpdateFeatureComplexity={handleUpdateFeatureComplexity}
      onUpdateFeatureFeedback={handleUpdateFeatureFeedback}
      onUpdateTeamFeedback={handleUpdateTeamFeedback}
      onUpdateTechEffort={handleUpdateTechEffort}
      onUpdateEffortReasoning={handleUpdateEffortReasoning}
      onSaveDraft={() => console.log('Save draft', calibration)}
      onMarkComplete={() => console.log('Mark as complete', calibration)}
    />
  )
}
