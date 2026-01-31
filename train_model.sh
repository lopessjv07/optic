#!/bin/bash
# Script para treinar o modelo

cd "$(dirname "$0")"

if [ ! -d "venv" ]; then
    echo "Erro: venv não encontrado."
    exit 1
fi

echo "Iniciando treinamento..."
./venv/bin/python botia/treinamento.py
