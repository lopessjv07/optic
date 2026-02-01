# Optic - Bot de Moderação de Conteúdo para Discord

**Optic** é um bot inteligente para Discord projetado para moderar conteúdo visual e textual automaticamente usando Inteligência Artificial. Ele atua como um guardião, garantindo que sua comunidade permaneça segura e saudável.

## 🐔 A Analogia: Galinhas vs. Sapos 🐸

Para tornar o funcionamento da IA mais intuitivo, utilizamos uma analogia simples:

*   **O Galinheiro (Servidor)**: É o seu servidor do Discord, um lugar que deve ser seguro e produtivo.
*   **As Galinhas (Conteúdo Lícito)**: Representam todas as imagens e textos permitidos, saudáveis e bem-vindos.
*   **Os Sapos (Conteúdo Ilícito)**: Representam conteúdo tóxico, NSFW, violento ou proibido que tenta invadir o galinheiro.

O **Optic** é o fazendeiro atento que usa "visão de raio-x" (IA) para identificar instantaneamente se algo é uma Galinha ou um Sapo, removendo os sapos antes que eles causem problemas.

## 🚀 Funcionalidades

*   **Classificação de Imagem (IA)**: Utiliza uma Rede Neural Convolucional (CNN) construída com **TensorFlow/Keras** para "enxergar" imagens e classificá-las.
*   **Leitura de Texto em Imagens (OCR)**: Usa **Tesseract** para extrair textos ocultos dentro de memes ou prints, detectando palavras proibidas que filtros de texto comuns não pegam.
*   **Moderação de Texto**: Remove automaticamente mensagens de texto contendo palavras da lista negra.
*   **Proteção em Tempo Real**: Analisa cada mensagem e anexo enviado no servidor instantaneamente.
*   **Interface Web**: Dashboard moderno para testar a IA (Galo vs. Sapo) e visualizar o status.

## 🛠️ Stack Tecnológica

O projeto é "Mágica" pura, construída com:

*   **Cérebro (IA)**: Python 3, TensorFlow, Keras.
*   **Olhos (Visão Computacional)**: OpenCV (cv2).
*   **Óculos de Leitura (OCR)**: Tesseract OCR.
*   **Corpo (Bot)**: Nextcord (Biblioteca Discord).
*   **Frontend (Web)**: React, Vite, CSS (Glassmorphism), Lucide Icons.
*   **Backend (API)**: FastAPI/Uvicorn.

## 📂 Estrutura do Projeto

*   `botia/bot_discord.py`: Lógica principal do bot.
*   `botia/treinamento.py`: Script para treinar o modelo de IA (CNN).
*   `web/`: Código fonte da interface web (React).
*   `api/`: API Backend que serve o modelo para a web.
*   `dataset/`: Pasta onde devem ficar as imagens de treino (`train/licit`, `train/illicit`).

## ⚙️ Instalação e Configuração

### Pré-requisitos

1.  **Python 3.8+** instalado.
2.  **Tesseract OCR** instalado no sistema:
    *   **Linux (Ubuntu/Debian)**: `sudo apt install tesseract-ocr`
    *   **Windows**: Baixe e instale do [UB-Mannheim](https://github.com/UB-Mannheim/tesseract/wiki).
3.  **Node.js & npm** (para a interface web).

### Passo a Passo

1.  **Clone o Repositório**
    ```bash
    git clone https://github.com/lopessjv07/optic.git
    cd optic
    ```

2.  **Crie e Ative o Ambiente Virtual**
    ```bash
    python3 -m venv venv
    source venv/bin/activate  # No Windows: venv\Scripts\activate
    ```

3.  **Instale as Dependências Python**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Configure as Variáveis de Ambiente**
    Crie um arquivo `.env` na raiz e adicione seu Token do Discord:
    ```env
    DISCORD_TOKEN=seu_token_aqui
    ```

## 🧠 Como Usar

### 1. Treinar o Modelo
Antes de rodar o bot, você precisa ensinar a IA o que é bom e o que é ruim.

Coloque suas imagens em `dataset/train/licit` e `dataset/train/illicit`, depois rode:
```bash
./train_model.sh
# OU manualmente:
# python botia/treinamento.py
```
Isso gera o arquivo `meu_modelo.h5` (o cérebro da IA).

### 2. Rodar o Bot do Discord
Com o modelo treinado:
```bash
./run_bot.sh
# OU:
# python botia/bot_discord.py
```

### 3. Rodar a Interface Web (Dashboard)
Para testar a IA visualmente:

1.  **Inicie a API (Terminal 1)**:
    ```bash
    ./venv/bin/uvicorn api.main:app --reload --port 8000
    ```

2.  **Inicie o Site (Terminal 2)**:
    ```bash
    cd web
    npm install  # Apenas na primeira vez
    npm run dev
    ```
    Acesse `http://localhost:5173` no navegador.

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para fazer um fork e enviar pull requests.

## 📄 Licença

Este projeto é open-source.
