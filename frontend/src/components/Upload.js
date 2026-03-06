import { useState } from "react"
import api from "../services/api"

function Upload({ atualizarLista }) {

  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [progress, setProgress] = useState(0)

  const selecionarArquivo = (e) => {
    const arquivo = e.target.files[0]
    setFile(arquivo)

    if (arquivo && arquivo.type.startsWith("image")) {
      setPreview(URL.createObjectURL(arquivo))
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()

    const arquivo = e.dataTransfer.files[0]
    setFile(arquivo)

    if (arquivo && arquivo.type.startsWith("image")) {
      setPreview(URL.createObjectURL(arquivo))
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const enviarArquivo = async () => {

    if (!file) {
      alert("Selecione um arquivo")
      return
    }

    const formData = new FormData()
    formData.append("file", file)

    await api.post("/upload", formData, {

      onUploadProgress: (event) => {

        const percent = Math.round(
          (event.loaded * 100) / event.total
        )

        setProgress(percent)

      }

    })

    setFile(null)
    setPreview(null)
    setProgress(0)

    atualizarLista()
  }

  return (

    <div>

      <h2>Enviar arquivo</h2>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        style={{
          border: "2px dashed #aaa",
          padding: "40px",
          textAlign: "center",
          marginBottom: "20px"
        }}
      >

        Arraste o arquivo aqui

      </div>

      <input type="file" onChange={selecionarArquivo} />

      <button onClick={enviarArquivo}>
        Upload
      </button>

      {preview && (
        <div>
          <p>Preview:</p>
          <img src={preview} alt="preview" style={{ width: "200px" }} />
        </div>
      )}

      {progress > 0 && (
        <div>
          <progress value={progress} max="100"></progress>
          {progress}%
        </div>
      )}

    </div>

  )
}

export default Upload