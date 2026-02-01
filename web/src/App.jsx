import './App.css'

function App() {
  const discordLink = "https://discord.com/channels/1262060832599310436/1380173879946776687"

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
            O Optic utiliza Inteligência Artificial avançada para detectar e remover 
            conteúdo ilícito em imagens e texto automaticamente.
          </p>
          <a href={discordLink} target="_blank" rel="noopener noreferrer">
            <button className="cta-button">Acessar Servidor</button>
          </a>
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
