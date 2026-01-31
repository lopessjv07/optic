#!/bin/bash
# Script para rodar o Bot do Discord corretamente usando o ambiente virtual

# Garante que estamos no diretório do script
cd "$(dirname "$0")"

# Verifica se o venv existe
if [ ! -d "venv" ]; then
    echo "Erro: Diretório 'venv' não encontrado. As dependências foram instaladas?"
    exit 1
fi

echo "Iniciando o Bot..."
./venv/bin/python botia/bot_discord.py
