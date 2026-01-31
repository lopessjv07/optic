# Optic - Discord Content Moderation Bot

Optic is an intelligent Discord bot designed to moderate content automatically using Artificial Intelligence. It detects and removes illicit images and text, ensuring a safer community environment.

## 🚀 Features

*   **Image Classification (AI)**: Uses a Convolutional Neural Network (CNN) built with **TensorFlow/Keras** to classify images as "Licit" (Safe) or "Illicit" (Unsafe).
*   **Optical Character Recognition (OCR)**: Extracts text from images using **Tesseract** to detect prohibited words hidden within images.
*   **Text Moderation**: Automatically deletes messages containing banned words.
*   **Real-time Protection**: Instantly analyzes every message and attachment sent to the server.

## 🛠️ Technology Stack

*   **Language**: Python 3
*   **Discord Library**: Nextcord
*   **Machine Learning**: TensorFlow, Keras, NumPy
*   **Image Processing**: OpenCV (cv2)
*   **OCR**: Pytesseract (Tesseract OCR wrapper)

## 📂 Project Structure

*   `botia/bot_discord.py`: Main bot application logic.
*   `botia/treinamento.py`: Script to train the AI model (CNN).
*   `train_model.sh`: Helper script to run the training process.
*   `run_bot.sh`: Helper script to start the bot.
*   `requirements.txt`: Python dependencies.

## ⚙️ Installation & Setup

### Prerequisites

1.  **Python 3.8+** installed.
2.  **Tesseract OCR** installed on your system:
    *   **Linux (Ubuntu/Debian)**: `sudo apt install tesseract-ocr`
    *   **Windows**: Download and install from [UB-Mannheim](https://github.com/UB-Mannheim/tesseract/wiki).
3.  **Git** installed.

### Step-by-Step Guide

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/lopessjv07/optic.git
    cd optic
    ```

2.  **Create and Activate Virtual Environment**
    ```bash
    python3 -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```

3.  **Install Dependencies**
    ```bash
    pip install -r requirements.txt
    ```

    *Note: If `requirements.txt` is missing specific ML libraries, ensure you install: `nextcord tensorflow numpy opencv-python pytesseract python-dotenv`*

4.  **Configure Environment Variables**
    Create a `.env` file in the root directory and add your Discord Bot Token:
    ```env
    DISCORD_TOKEN=your_discord_bot_token_here
    ```

5.  **Prepare Dataset (For Training)**
    *   Create a `train` folder with subfolders for each class (e.g., `train/licit` and `train/illicit`).
    *   Create a `test` folder with similar structure for validation.

## 🧠 How to Use

### 1. Train the Model
Before running the bot, you need to train the AI model so it learns to distinguish between images.

Run the training script:
```bash
./train_model.sh
# OR manually:
# python botia/treinamento.py
```
This will generate a `meu_modelo.h5` file in the project root.

### 2. Run the Bot
Once the model is trained and `.env` is configured, verify the bot is added to your server and run:

```bash
./run_bot.sh
# OR manually:
# python botia/bot_discord.py
```

The bot will print `Bot <Name> está funcionando!` when it's online.

## 🤝 Contribution

Contributions are welcome! Feel free to fork the repository and submit pull requests.

## 📄 License

This project is open-source.
