import data from '@/../product/sections/prd-ingestion/data.json'
import { ExtractionReview } from './components/ExtractionReview'
import type { EstimationRequest } from '@/../product/sections/prd-ingestion/types'

export default function ExtractionReviewPreview() {
  const request = data.estimationRequests[0] as unknown as EstimationRequest

  return (
    <ExtractionReview
      request={request}
      onUpdateTitle={(id, title) => console.log('Update title:', id, title)}
      onUpdateOverview={(id, overview) => console.log('Update overview:', id, overview.slice(0, 50))}
      onAddFeature={(id, feat) => console.log('Add feature:', id, feat)}
      onUpdateFeature={(id, fid, updates) => console.log('Update feature:', id, fid, updates)}
      onRemoveFeature={(id, fid) => console.log('Remove feature:', id, fid)}
      onUpdateConstraints={(id, items) => console.log('Update constraints:', id, items.length)}
      onUpdateAmbiguities={(id, items) => console.log('Update ambiguities:', id, items.length)}
      onUpdateImplicitRequirements={(id, items) => console.log('Update implicit:', id, items.length)}
      onRetryParse={(id) => console.log('Retry parse:', id)}
      onConfirm={(id) => console.log('Confirm:', id)}
    />
  )
}
