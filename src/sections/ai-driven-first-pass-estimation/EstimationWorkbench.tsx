import { useState, useCallback } from 'react'
import data from '@/../product/sections/ai-driven-first-pass-estimation/data.json'
import { GenerationProgress } from './components/GenerationProgress'
import { EstimationWorkbenchView } from './components/EstimationWorkbenchView'
import type { Estimate, GenerationStep } from '@/../product/sections/ai-driven-first-pass-estimation/types'

export default function EstimationWorkbenchPreview() {
  const [isGenerating] = useState(false)
  const [expandedFeatureIds, setExpandedFeatureIds] = useState<Set<string>>(new Set())

  const estimate = data.estimate as unknown as Estimate
  const generationSteps = data.generationSteps as unknown as GenerationStep[]

  const handleExpand = useCallback((featureId: string) => {
    setExpandedFeatureIds((prev) => new Set(prev).add(featureId))
    console.log('Expand feature:', featureId)
  }, [])

  const handleCollapse = useCallback((featureId: string) => {
    setExpandedFeatureIds((prev) => {
      const next = new Set(prev)
      next.delete(featureId)
      return next
    })
    console.log('Collapse feature:', featureId)
  }, [])

  if (isGenerating || !estimate) {
    return (
      <GenerationProgress
        steps={generationSteps}
        projectName={estimate?.projectName || 'Loading...'}
        onCancel={() => console.log('Cancel generation')}
      />
    )
  }

  return (
    <EstimationWorkbenchView
      estimate={estimate}
      expandedFeatureIds={expandedFeatureIds}
      onRegenerate={() => console.log('Regenerate estimate')}
      onContinueToReview={() => console.log('Continue to Human Review')}
      onExpandFeature={handleExpand}
      onCollapseFeature={handleCollapse}
    />
  )
}
