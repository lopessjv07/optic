import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import './App.css'

function App() {
  const discordLink = "https://discord.com/channels/1262060832599310436/1380173879946776687"

  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const onDrop = useCallback(acceptedFiles => {
    const selectedFile = acceptedFiles[0]
    setFile(selectedFile)
    setPreview(URL.createObjectURL(selectedFile))
    setResult(null)
    setError(null)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    multiple: false
  })

  const handleAnalyze = async () => {
    if (!file) return;

    setLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      // In production, this URL should be configurable
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        if (response.status === 503) {
          throw new Error("O modelo de IA ainda não foi treinado/carregado no servidor.")
        }
        throw new Error("Erro na conexão com a API.")
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      console.error(err)
      setError(err.message || "Falha ao analisar imagem.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-container">
      <div className="main-content">
        <header>
          <div className="logo">OPTIC</div>
          <nav>
            {/* Future nav items */}
          </nav>
        </header>

        <section className="hero">
          <h1>
            Mantenha sua comunidade <br />
            <span>Segura e Saudável</span>
          </h1>
          <p>
            O Optic utiliza Inteligência Artificial avançada para diferenciar
            <strong>Galinhas</strong> de <strong>Sapos</strong>. O objetivo é manter o ambiente limpo de sapos!
          </p>
          <a href={discordLink} target="_blank" rel="noopener noreferrer">
            <button className="cta-button">Acessar Servidor</button>
          </a>
        </section>

        <section className="demo-section">
          <h2>Teste a IA Agora</h2>
          <p>Arraste uma imagem para verificar se é um Galo/Galinha (Bem-vindo) ou um Sapo (Indesejado).</p>

          <div className="demo-container">
            <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
              <input {...getInputProps()} />
              {preview ? (
                <img src={preview} alt="Preview" className="preview-image" />
              ) : (
                <div className="dropzone-placeholder">
                  <span className="icon">📁</span>
                  <p>Arraste e solte uma imagem aqui, ou clique para selecionar</p>
                </div>
              )}
            </div>

            <div className="controls">
              <button
                className="analyze-button"
                onClick={handleAnalyze}
                disabled={!file || loading}
              >
                {loading ? "Analisando..." : "Analisar Imagem"}
              </button>
            </div>

            {error && (
              <div className="result-card error">
                <h3>Erro</h3>
                <p>{error}</p>
              </div>
            )}

            {result && (
              <div className={`result-card ${result.is_licit ? 'safe' : 'unsafe'}`}>
                <h3>
                  {result.is_licit
                    ? "Galos ou galinhas são bem vindos! 🐔"
                    : "Sapos não são bem vindos por aqui! 🐸🚫"}
                </h3>
                <p>Confiança: {(result.confidence * 100).toFixed(2)}%</p>
                <div className="confidence-bar">
                  <div
                    className="fill" 
                    style={{ width: `${result.confidence * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="features">
          <div className="card">
            <div className="card-icon">👁️</div>
            <h3>Detecção Visual</h3>
            <p>
              Nossa IA analisa cada imagem enviada em tempo real, 
              identificando conteúdo impróprio com alta precisão.
            </p>
          </div>

          <div className="card">
            <div className="card-icon">📝</div>
            <h3>Leitura OCR</h3>
            <p>
               Capacidade de ler textos ocultos dentro de imagens para garantir 
               que nenhuma regra seja quebrada.
            </p>
          </div>

          <div className="card">
            <div className="card-icon">🛡️</div>
            <h3>Proteção 24/7</h3>
            <p>
              Monitoramento constante do seu servidor, garantindo uma 
              experiência segura para todos os membros.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}

export default App
