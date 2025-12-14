import subprocess
import os
import sys
import time

def check_file_exists(path, description):
    if not os.path.exists(path):
        print(f"⚠️  AVISO: {description} não encontrado em: {path}")
        return False
    return True

def main():
    """
    Script Mestre para o AgroCoop MVP.
    Verifica o ambiente e inicia Backend (API) e Frontend (Web).
    """
    project_root = os.path.dirname(os.path.abspath(__file__))
    
    print("\n" + "="*50)
    print("   🚜  AGROCOOP - INFRAESTRUTURA DIGITAL  🚜")
    print("="*50)
    print(f"📂 Raiz: {project_root}")
    
    # 1. Verificações de Ambiente
    print("\n[1/3] 🔍 Verificando ambiente...")
    
    # Check node_modules
    if not os.path.isdir(os.path.join(project_root, "node_modules")):
        print("❌ 'node_modules' não encontrado. Rodando 'npm install'...")
        subprocess.run(["npm", "install"], cwd=project_root, check=True)
    else:
        print("✅ Dependências Node instaladas.")

    # Check Env Vars
    api_env = os.path.join(project_root, "apps/api/.env")
    web_env = os.path.join(project_root, "apps/web/.env.local")
    
    if not check_file_exists(api_env, "Arquivo .env da API"):
        print(f"   👉 Crie {api_env} baseado no .env.example")
    
    if not check_file_exists(web_env, "Arquivo .env.local da Web"):
        print(f"   👉 Crie {web_env} baseado no .env.local.example")
        
    # 2. Iniciar Serviços
    print("\n[2/3] 🚀 Iniciando Serviços (API + Web)...")
    print("   - API: http://localhost:4000")
    print("   - Web: http://localhost:3000")
    print("   (Pressione CTRL+C para parar)")
    print("-" * 50 + "\n")

    try:
        # Executa o script 'dev' do package.json que usa 'concurrently'
        subprocess.run(["npm", "run", "dev"], cwd=project_root, check=True)
    except KeyboardInterrupt:
        print("\n\n🛑 Encerrando serviços...")
    except subprocess.CalledProcessError as e:
        print(f"\n❌ Erro na execução: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
