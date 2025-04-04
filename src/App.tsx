import { Toaster } from 'react-hot-toast'
import Layout from './components/Layout'
import DocumentEditor from './components/DocumentEditor'
import { WikiProvider } from './contexts/WikiContext'
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <WikiProvider>
        <Layout>
          <DocumentEditor />
        </Layout>
        <Toaster position="bottom-right" />
      </WikiProvider>
    </DndProvider>
  );
}

export default App
