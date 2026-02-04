#!/usr/bin/env python3
"""
Script para converter modelo Keras (.h5) para TensorFlow Lite (.tflite)

Uso:
    python convert_to_tflite.py meu_modelo.h5 modelo.tflite

Após conversão, faça upload do arquivo .tflite para seu storage (Supabase, R2, S3)
e configure a variável MODEL_URL no Vercel.
"""

import sys
import tensorflow as tf

def convert_h5_to_tflite(input_path: str, output_path: str):
    """Converte modelo .h5 para .tflite"""
    print(f"Carregando modelo de {input_path}...")
    model = tf.keras.models.load_model(input_path)
    
    print("Convertendo para TFLite...")
    converter = tf.lite.TFLiteConverter.from_keras_model(model)
    
    # Otimizações opcionais (descomentar se quiser modelo menor)
    # converter.optimizations = [tf.lite.Optimize.DEFAULT]
    
    tflite_model = converter.convert()
    
    print(f"Salvando em {output_path}...")
    with open(output_path, 'wb') as f:
        f.write(tflite_model)
    
    original_size = len(open(input_path, 'rb').read()) / 1024 / 1024
    tflite_size = len(tflite_model) / 1024 / 1024
    
    print(f"\n✅ Conversão concluída!")
    print(f"   Tamanho original (.h5):  {original_size:.2f} MB")
    print(f"   Tamanho TFLite (.tflite): {tflite_size:.2f} MB")
    print(f"   Redução: {((1 - tflite_size/original_size) * 100):.1f}%")
    print(f"\nPróximos passos:")
    print(f"   1. Faça upload de '{output_path}' para seu storage (Supabase, R2, S3)")
    print(f"   2. Configure MODEL_URL no Vercel com a URL do arquivo")


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Uso: python convert_to_tflite.py <input.h5> <output.tflite>")
        print("Exemplo: python convert_to_tflite.py meu_modelo.h5 modelo.tflite")
        sys.exit(1)
    
    convert_h5_to_tflite(sys.argv[1], sys.argv[2])
