import { useState, useCallback } from 'react'
import data from '@/../product/sections/human-review-and-adjustment/data.json'
import { ReviewConsoleView } from './components/ReviewConsoleView'
import type { ReviewEstimate } from '@/../product/sections/human-review-and-adjustment/types'

export default function ReviewConsolePreview() {
  const [expandedFeatureIds, setExpandedFeatureIds] = useState<Set<string>>(new Set())

  const review = data.review as unknown as ReviewEstimate

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

  return (
    <ReviewConsoleView
      review={review}
      expandedFeatureIds={expandedFeatureIds}
      onExpandFeature={handleExpand}
      onCollapseFeature={handleCollapse}
      onAcceptFeature={(id) => console.log('Accept feature:', id)}
      onAdjustFeature={(id) => console.log('Adjust feature:', id)}
      onAcceptRisk={(id) => console.log('Accept risk:', id)}
      onAdjustRisk={(id) => console.log('Adjust risk:', id)}
      onAddRisk={() => console.log('Add risk')}
      onAdjustTeam={() => console.log('Adjust team')}
      onSaveDraft={() => console.log('Save draft')}
      onApproveAndExport={() => console.log('Approve and export')}
    />
  )
}
