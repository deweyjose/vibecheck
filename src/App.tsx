import { Toaster } from 'react-hot-toast'
import Layout from './components/Layout'
import DocumentEditor from './components/DocumentEditor'
import { WikiProvider } from './contexts/WikiContext'

function App() {
  return (
    <WikiProvider>
      <Layout>
        <DocumentEditor />
      </Layout>
      <Toaster position="bottom-right" />
    </WikiProvider>
  )
}

export default App
