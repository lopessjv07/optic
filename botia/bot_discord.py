import nextcord
import os
import cv2
import pytesseract
from nextcord.ext import commands
from tensorflow.keras.preprocessing.image import load_img, img_to_array
import numpy as np
from tensorflow.keras.models import load_model
from dotenv import load_dotenv

load_dotenv()

intents = nextcord.Intents.default()
intents.messages = True
intents.message_content = True
client = commands.Bot(command_prefix='!', intents=intents)

# Carregar o modelo treinado para classificação de imagens ilícitas
# Usando caminho relativo baseado na raiz do projeto ou local do arquivo
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# Assumindo que o arquivo está em botia/ e o modelo na raiz, sobe um nível
MODEL_PATH = os.path.join(BASE_DIR, '..', 'meu_modelo.h5')

if os.path.exists(MODEL_PATH):
    model = load_model(MODEL_PATH)
    print(f"Modelo carregado de: {MODEL_PATH}")
else:
    print(f"ERRO: Modelo não encontrado em {MODEL_PATH}")
    model = None

# Lista de palavras proibidas para texto ilícito (tanto no chat quanto nas imagens)
palavras_proibidas = ['bosta','b0sta','b0s7a','b*sta',
  'merda','m3rda','m3rd4','m€rda',
  'porra','p0rra','pohra','p0h@','p0rr@',
  'caralho','c4ralho','karalho','krl','k@ralho',
  'puta','pvt@','pu7a','p#ta',
  'viado','v1ado','v14d0','v!ado',
  'arrombado','4rrombado','ar0mbado','arr0mb@do',
  'cu','c#','c*','cú',
  'buceta','bvceta','buc3ta','bucet@',
  'pau','p4u','paü',
  'pica','p1ca','p!ca',
  'foder','f0der','f0d3r','fud3r',
  'foda','f0da','f0d@',
  'desgraça','d3sgraca','desgr4ça','desgraç@',
  'inferno','1nferno','inf3rno',
  'idiota','1diota','idi0ta',
  'imbecil','1mbecil','imb3cil',
  'retardado','r3tardado','ret4rdado',
  'escroto','3scroto','escrot0',
  'safado','s4fado','saf4do','s@fado',
  'sucudo','sucud0','54cudo','sucud@']

# Função para classificar imagem como lícita ou ilícita usando modelo treinado
def classificar_imagem(caminho_imagem):
    if model is None:
        return "indefinido"
        
    img = load_img(caminho_imagem, target_size=(64, 64))  # Carrega e redimensiona a imagem
    img = img_to_array(img)
    img = np.expand_dims(img, axis=0)
    img /= 255.0  # Normaliza a imagem

    resultado = model.predict(img)[0][0]
    return "lícita" if resultado > 0.5 else "ilícita"

# Função para verificar se uma mensagem contém palavras ilícitas
def verificar_palavras_ilicitas(texto):
    for palavra in palavras_proibidas:
        if palavra in texto.lower():
            return True
    return False

# Função para extrair texto de uma imagem usando OCR (Tesseract)
def extrair_texto_imagem(caminho_imagem):
    # Configurar o caminho do Tesseract
    # Tenta encontrar no path ou usa o padrão linux
    pytesseract.pytesseract.tesseract_cmd = "/usr/bin/tesseract"
    
    # Ler e processar a imagem para melhorar a extração de texto
    imagem = cv2.imread(caminho_imagem)
    if imagem is None:
        return None
    imagem_cinza = cv2.cvtColor(imagem, cv2.COLOR_BGR2GRAY)
    imagem_binarizada = cv2.adaptiveThreshold(imagem_cinza, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)
    imagem_suave = cv2.medianBlur(imagem_binarizada, 3)

    # Extrair texto usando Tesseract
    try:
        texto = pytesseract.image_to_string(imagem_suave, config='--psm 3', lang='por')
        return texto
    except Exception as e:
        print(f"Erro no OCR: {e}")
        return ""

# Mostra quando o bot está funcionando
@client.event
async def on_ready():
    print(f'Bot {client.user} está funcionando!')

# Evento para monitorar as mensagens do servidor
@client.event
async def on_message(message):
    # Ignorar mensagens enviadas pelo próprio bot
    if message.author == client.user:
        return

    # Verificar se a mensagem contém anexos (imagens)
    if message.attachments:
        for attachment in message.attachments:
            if attachment.filename.endswith(('.png', '.jpg', '.jpeg')):
                caminho_imagem = f'./{attachment.filename}'
                await attachment.save(caminho_imagem)
                print(f"Imagem {attachment.filename} recebida e salva.")

                # Classificar a imagem como lícita ou ilícita
                resultado_imagem = classificar_imagem(caminho_imagem)
                if resultado_imagem == "ilícita":
                    await message.delete()
                    await message.channel.send("⚠️ Sapos não são bem vindos por aqui! 🐸🚫")
                else:
                    # Extrair o texto da imagem e verificar se contém palavras ilícitas
                    texto_extraido = extrair_texto_imagem(caminho_imagem)
                    if texto_extraido and verificar_palavras_ilicitas(texto_extraido):
                        await message.delete()
                        await message.channel.send(f"⚠️ {message.author.mention}, imagem removida devido a texto ilícito detectado!")
                    else:
                        print("Imagem lícita e sem texto ilícito.")
                
                # Remover a imagem após o processamento
                if os.path.exists(caminho_imagem):
                    os.remove(caminho_imagem)

    # Verificar se a mensagem de texto contém palavras ilícitas
    if verificar_palavras_ilicitas(message.content):
        await message.delete()
        await message.channel.send(f"⚠️ {message.author.mention}, sem palavras ilícitas no chat!")

    # Continuar processando outros comandos do bot, se houver
    await client.process_commands(message)

# Rodar o bot
TOKEN = os.getenv('DISCORD_TOKEN')
if TOKEN:
    client.run(TOKEN)
else:
    print("ERRO: Token não encontrado no arquivo .env")
