import { useState, useEffect } from "react"
import api from "../services/api"

function FileList({ atualizarListaRef }) {

  const [files, setFiles] = useState([])

  const carregarArquivos = async () => {

    try {

      const response = await api.get("/files")
      setFiles(response.data)

    } catch (error) {

      console.log("Erro ao carregar arquivos")

    }

  }

  useEffect(() => {

    carregarArquivos()

    if (atualizarListaRef) {
      atualizarListaRef.current = carregarArquivos
    }

  }, [])

  const deletarArquivo = async (nome) => {

    try {

      await api.delete(`/delete/${nome}`)
      carregarArquivos()

    } catch (error) {

      console.log("Erro ao deletar arquivo")

    }

  }

  return (

    <div>

      <h2>Arquivos</h2>

      {files.length === 0 && <p>Nenhum arquivo enviado</p>}

      {files.map((file) => (

        <div className="file-item" key={file}>

          <span>{file}</span>

          <div>

            <a href={`http://localhost:3001/download/${file}`}>
              Download
            </a>

            {" | "}

            <button onClick={() => deletarArquivo(file)}>
              Deletar
            </button>

          </div>

        </div>

      ))}

    </div>

  )
}

export default FileList