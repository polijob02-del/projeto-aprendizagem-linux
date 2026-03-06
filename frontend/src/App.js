import { useRef } from "react"
import "./App.css"

import Upload from "./components/Upload"
import FileList from "./components/FileList"

function App() {

  const atualizarListaRef = useRef(null)

  const atualizarLista = () => {
    if (atualizarListaRef.current) {
      atualizarListaRef.current()
    }
  }

  return (
    <div className="container">

      <h1>Meu Drive</h1>

      <Upload atualizarLista={atualizarLista} />

      <FileList atualizarListaRef={atualizarListaRef} />

    </div>
  )
}

export default App