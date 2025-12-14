import subprocess
import os
import sys
import shutil
import time

def check_file_exists(path, description):
    if not os.path.exists(path):
        print(f"⚠️  AVISO: {description} não encontrado em: {path}")
        return False
    return True

def ensure_env_vars(project_root):
    print("\n[1/4] 🛠️  Configurando Variáveis de Ambiente...")
    
    # API
    api_dest = os.path.join(project_root, "apps/api/.env")
    api_src = os.path.join(project_root, "apps/api/.env.example")
    
    if not os.path.exists(api_dest):
        if os.path.exists(api_src):
            shutil.copy(api_src, api_dest)
            print("   ✅ Criado apps/api/.env (copiado de .env.example)")
        else:
            # Create a default one if example missing, though unlikely
            with open(api_dest, "w") as f:
                f.write('DATABASE_URL="file:../../data/agrocoop.db"\n')
            print("   ✅ Criado apps/api/.env (padrão)")
    else:
        print("   ✅ apps/api/.env já existe.")

    # Web
    web_dest = os.path.join(project_root, "apps/web/.env.local")
    web_src = os.path.join(project_root, "apps/web/.env.local.example")
    
    if not os.path.exists(web_dest):
        if os.path.exists(web_src):
            shutil.copy(web_src, web_dest)
            print("   ✅ Criado apps/web/.env.local (copiado de .env.local.example)")
        else:
             print("   ⚠️  apps/web/.env.local.example ausente. Ignorando criação automática.")
    else:
        print("   ✅ apps/web/.env.local já existe.")

def clean_database(project_root):
    print("\n[2/4] 🧹 Limpando Banco de Dados...")
    db_path = os.path.join(project_root, "data/agrocoop.db")
    
    if os.path.exists(db_path):
        try:
            os.remove(db_path)
            print(f"   🗑️  Removido: {db_path}")
        except Exception as e:
            print(f"   ❌ Falha ao remover banco: {e}")
    else:
        print("   ✅ Banco de dados limpo (arquivo não existia).")

def load_env_file(filepath):
    """Lê um arquivo .env e retorna um dicionário."""
    env_vars = os.environ.copy()
    if os.path.exists(filepath):
        with open(filepath, "r") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#"): continue
                if "=" in line:
                    key, value = line.split("=", 1)
                    # Remove quotes if present
                    value = value.strip(' "\'')
                    env_vars[key.strip()] = value
    return env_vars

def setup_database(project_root):
    print("\n[3/4] 🗄️  Configurando Banco de Dados...")
    
    # Load API env vars to inject into subprocess
    api_dir = os.path.join(project_root, "apps/api")
    api_env_path = os.path.join(api_dir, ".env")
    env = load_env_file(api_env_path)

    # 1. Push Schema (Creates tables)
    # Must run from apps/api to find prisma.config.ts
    print("   👉 Aplicando schema (Prisma db push)...")
    try:
        subprocess.run(
            ["npx", "prisma", "db", "push"],
            cwd=api_dir,
            check=True,
            capture_output=False,
            env=env
        )
        print("   ✅ Schema aplicado.")
    except subprocess.CalledProcessError:
        print("   ❌ Erro ao aplicar schema do Prisma.")
        sys.exit(1)

    # 2. Seed Data
    print("   👉 Populando dados iniciais (Seed)...")
    try:
        subprocess.run(
            ["npm", "run", "seed"],
            cwd=api_dir,
            check=True,
            capture_output=False,
            env=env
        )
        print("   ✅ Seed concluído.")
    except subprocess.CalledProcessError:
        print("   ❌ Erro ao rodar seed.")
        sys.exit(1)

def start_services(project_root):
    """Sobe API e Web usando o script 'dev' do root (concurrently)."""
    print("   ▶️  Disparando 'npm run dev' (API + Web)...")
    print("   ---------------------------------------------------")
    try:
        # Uses the root 'dev' script which calls concurrently
        # We don't need to manually inject env vars because dotenv/Next.js handle files.
        subprocess.run(["npm", "run", "dev"], cwd=project_root, check=True)
    except KeyboardInterrupt:
        print("\n\n🛑 Encerrando...")
    except subprocess.CalledProcessError:
        print("\n\n❌ Erro na execução dos serviços.")



def main():
    """
    Script Mestre para o AgroCoop MVP.
    Setup automático (Clean DB -> Push -> Seed) e Start.
    """
    project_root = os.path.dirname(os.path.abspath(__file__))
    
    print("\n" + "="*50)
    print("   🚜  AGROCOOP - STARTUP AUTOMÁTICO  🚜")
    print("="*50)
    
    # 0. Dependencies
    print("\n[0/4] 📦 Instalando Dependências (raiz + workspaces)...")
    subprocess.run(["npm", "install"], cwd=project_root, check=True)

    # Execute Setup Steps
    ensure_env_vars(project_root)
    
    db_path = os.path.join(project_root, "data/agrocoop.db")
    should_reset = False

    if os.path.exists(db_path):
        response = input("\n[?] Banco de dados encontrado. Deseja resetar (apagar) tudo? (y/N): ").strip().lower()
        if response == 'y':
            should_reset = True
            clean_database(project_root)
            setup_database(project_root)
        else:
            print("   ⏩ Pulando reset do banco. Mantendo dados existentes.")
            # Optional: Run push just in case schema changed? 
            # Usually better to rely on developer to know. For MVP, skipping is safer to avoid seed dupes.
            
            # Ensure at least the file allows connection? 
            # Prisma usually handles connection ok.
    else:
        # DB doesn't exist, must force setup
        should_reset = True
        clean_database(project_root) # Handles 'if exists' internally (safe)
        setup_database(project_root)

    # 4. Start Services
    print("\n[4/4] 🚀 Iniciando Serviços (API + Web)...")
    print("   - API: http://localhost:4000")
    print("   - Web: http://localhost:3000")
    print("-" * 50 + "\n")

    start_services(project_root)

if __name__ == "__main__":
    main()
