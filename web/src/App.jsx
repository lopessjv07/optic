import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import {
  Upload,
  Brain,
  Eye,
  ScanText,
  Bot,
  ShieldCheck,
  Search,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileImage,
  Instagram,
  Linkedin,
  Github,
  RefreshCw
} from 'lucide-react'
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

  const handleReset = () => {
    setFile(null)
    setPreview(null)
    setResult(null)
    setError(null)
  }

  return (
    <div className="app-container">
      <header>
        <div className="logo-container">
          <img src="/optic.png" alt="Optic Logo" className="logo-img" />
        </div>
        <nav className="header-socials">
          <a href="https://www.instagram.com/lopessvj/" target="_blank" rel="noopener noreferrer"><Instagram size={24} /></a>
          <a href="https://www.linkedin.com/in/jo%C3%A3o-vitor-lopes-467714312/" target="_blank" rel="noopener noreferrer"><Linkedin size={24} /></a>
          <a href="https://github.com/lopessjv07/optic" target="_blank" rel="noopener noreferrer"><Github size={24} /></a>
        </nav>
      </header>
      <div className="main-content">
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
                    <Upload size={48} className="icon-placeholder" />
                  <p>Arraste e solte uma imagem aqui, ou clique para selecionar</p>
                </div>
              )}
            </div>



            <div className="controls">
              {!result && !error ? (
                <button
                  className="analyze-button"
                  onClick={handleAnalyze}
                  disabled={!file || loading}
                >
                  {loading ? (
                    <>
                      <Search className="spin" size={20} /> Analisando...
                    </>
                  ) : (
                    <>
                      <Search size={20} /> Analisar Imagem
                    </>
                  )}
                </button>
              ) : (
                <button className="reset-button" onClick={handleReset}>
                  <RefreshCw size={20} /> Verificar Outra Imagem
                </button>
              )}
            </div>

            {error && (
              <div className="result-card error">
                <h3><AlertTriangle size={24} /> Erro</h3>
                <p>{error}</p>
              </div>
            )}

            {result && (
              <div className={`result-card ${result.is_licit ? 'safe' : 'unsafe'}`}>
                <h3>
                  {result.is_licit ? (
                    <>
                      <CheckCircle2 size={24} /> Galos ou galinhas são bem vindos!
                    </>
                  ) : (
                    <>
                      <XCircle size={24} /> Sapos não são bem vindos por aqui!
                    </>
                  )}
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

        <section className="about-section">
          <h2>Sobre o Projeto</h2>
          <div className="about-content">
            <div className="analogy-card">
              <h3><FileImage size={24} /> O Problema (Sapos)</h3>
              <p>
                Imagine que nosso servidor é um galinheiro seguro e produtivo.
                Os <strong>Sapos</strong> representam conteúdo ilícito, tóxico ou indesejado
                que tenta invadir nosso espaço. Eles não pertencem aqui e atrapalham
                a convivência.
              </p>
            </div>
            <div className="analogy-card highlight">
              <h3><ShieldCheck size={24} /> A Solução (Galinhas)</h3>
              <p>
                As <strong>Galinhas</strong> são o conteúdo legítimo, seguro e bem-vindo.
                O Optic atua como o guardião que sabe diferenciar visualmente um sapo
                de uma galinha instantaneamente, garantindo que apenas o que é bom permaneça.
              </p>
            </div>
          </div>
        </section>

        <section className="tech-stack-section">
          <h2>Tecnologias & "Mágica"</h2>
          <p className="section-desc">
            Para realizar esse banimento automático com precisão, utilizamos uma stack poderosa.
            Veja porque cada peça foi escolhida:
          </p>

          <div className="tech-grid">
            <div className="tech-item">
              <h4><Brain size={24} /> TensorFlow & Keras</h4>
              <p>
                O cérebro da operação. Treinamos uma Rede Neural Convolucional (CNN)
                que "aprendeu" a ver padrões de pixels. Ela não apenas lê nomes de arquivos,
                ela <em>enxerga</em> a imagem como um humano faria.
              </p>
            </div>
            <div className="tech-item">
              <h4><Eye size={24} /> OpenCV</h4>
              <p>
                Os olhos do bot. O OpenCV processa as imagens brutas, redimensiona,
                ajusta cores e prepara tudo para que o cérebro (TensorFlow) possa
                analisar sem erros.
              </p>
            </div>
            <div className="tech-item">
              <h4><ScanText size={24} /> Tesseract OCR</h4>
              <p>
                Os óculos de leitura. Muitas vezes o "sapo" (conteúdo ruim) tenta se esconder
                em forma de texto dentro de uma imagem meme. O Tesseract lê esses textos ocultos.
              </p>
            </div>
            <div className="tech-item">
              <h4><Bot size={24} /> Nextcord</h4>
              <p>
                O corpo do bot. É a biblioteca que conecta toda essa inteligência ao
                Discord, permitindo interagir, apagar mensagens e banir usuários em tempo real.
              </p>
            </div>
          </div>
        </section>

        <section className="features">
          <div className="card">
            <div className="card-icon"><Eye size={32} /></div>
            <h3>Detecção Visual</h3>
            <p>
              Nossa IA analisa cada imagem enviada em tempo real, 
              identificando conteúdo impróprio com alta precisão.
            </p>
          </div>

          <div className="card">
            <div className="card-icon"><ScanText size={32} /></div>
            <h3>Leitura OCR</h3>
            <p>
               Capacidade de ler textos ocultos dentro de imagens para garantir 
               que nenhuma regra seja quebrada.
            </p>
          </div>

          <div className="card">
            <div className="card-icon"><ShieldCheck size={32} /></div>
            <h3>Proteção 24/7</h3>
            <p>
              Monitoramento constante do seu servidor, garantindo uma 
              experiência segura para todos os membros.
            </p>
          </div>
        </section>
      </div>
      <footer className="footer">
        <p>Joao Vitor lopes - 2026 todos os direitos reservados</p>
        <div className="social-links">
          <a href="#" target="_blank" rel="noopener noreferrer"><Instagram size={24} /></a>
          <a href="#" target="_blank" rel="noopener noreferrer"><Linkedin size={24} /></a>
          <a href="#" target="_blank" rel="noopener noreferrer"><Github size={24} /></a>
        </div>
      </footer>
    </div>
  )
}

export default App
