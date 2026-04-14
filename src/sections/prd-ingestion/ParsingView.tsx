import { ParsingView } from './components/ParsingView'

export default function ParsingViewPreview() {
  return (
    <ParsingView
      fileName="mobile-banking-prd.pdf"
      sourceFormat="pdf"
      steps={[
        {
          label: 'Extracting text',
          description: 'Reading document content from PDF',
          status: 'complete',
        },
        {
          label: 'Identifying project scope',
          description: 'Extracting title and project overview',
          status: 'complete',
        },
        {
          label: 'Extracting features',
          description: 'Breaking down discrete feature requirements',
          status: 'active',
        },
        {
          label: 'Analyzing constraints',
          description: 'Identifying technical constraints and platform requirements',
          status: 'pending',
        },
        {
          label: 'Detecting ambiguities',
          description: 'Surfacing unanswered questions and implicit requirements',
          status: 'pending',
        },
        {
          label: 'Structuring output',
          description: 'Compiling the structured estimation request',
          status: 'pending',
        },
      ]}
      onCancel={() => console.log('Cancel')}
      onRetry={() => console.log('Retry')}
    />
  )
}
