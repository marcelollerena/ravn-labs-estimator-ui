import { IntakeView } from './components/IntakeView'

export default function IntakeViewPreview() {
  return (
    <IntakeView
      onUploadFile={(file) => console.log('Upload file:', file.name)}
      onPasteText={(text) => console.log('Paste text:', text.slice(0, 50) + '...')}
      onSubmitForm={(input) => console.log('Submit form:', input)}
    />
  )
}
