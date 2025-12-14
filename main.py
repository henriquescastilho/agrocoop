import subprocess
import os
import sys

def main():
    """
    Script principal para rodar todo o ambiente do AgroCoop (Frontend + Backend).
    Executa 'npm run dev' na raiz do projeto.
    """
    # Obtém o diretório onde o script está localizado
    project_root = os.path.dirname(os.path.abspath(__file__))
    
    print(f"🚀 Iniciando Infraestrutura Digital AgroCoop...")
    print(f"📂 Diretório: {project_root}")
    print("--------------------------------------------------")
    
    try:
        # Executa o comando npm run dev
        # O argumento shell=True não é estritamente necessário no Mac se passarmos a lista, 
        # mas ajuda a garantir que o PATH do shell seja respeitado.
        subprocess.run(["npm", "run", "dev"], cwd=project_root, check=True)
    except KeyboardInterrupt:
        print("\n\n🛑 Encerrando serviços...")
        sys.exit(0)
    except subprocess.CalledProcessError as e:
        print(f"\n❌ Erro ao executar o comando: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Erro inesperado: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
