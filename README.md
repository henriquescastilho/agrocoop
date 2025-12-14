# AgroCoop (Agroboy)

**Conectando o campo a mesa, reduzindo o desperdicio com Inteligencia Artificial.**

Bem-vindo ao repositorio oficial do **AgroCoop** (hackathon HACKATHON_RJ). Nossa missao e criar uma "Rede Viva" logistica que combate o desperdicio de alimentos pereciveis atraves de tecnologia de ponta.

## O Problema
O desperdicio na cadeia logistica de pereciveis e alarmante. Produtores perdem safras por falta de transporte ou comprador imediato, enquanto mercados e consumidores pagam caro por produtos que, muitas vezes, nem chegam em boas condicoes.

## Nossa Solucao: Agroboy
Desenvolvemos uma plataforma integrada que une **Produtores**, **Compradores** e **Transportadores**. O coracao do nosso sistema e o **Agroboy**, um assistente baseado em IA via WhatsApp que facilita toda a negociacao, desde o cadastro ate o fechamento do frete.

## Arquitetura Tecnica

### Stack Tecnologica
- **Backend**: Node.js, Express, Prisma (SQLite/Postgres).
- **Frontend**: Next.js 14, React, TailwindCSS.
- **AI/ML**: Google Gemini 2.5 Flash, Google Vertex AI (Speech-to-Text).
- **Messaging**: WhatsApp (via WAHA).
- **Deploy**: Deco.cx.

### Diferenciais Tecnologicos

#### IA Generativa (Gemini 2.5 Flash)
Atua como coordenador de conversas no WhatsApp, entendendo audios, imagens e intencoes complexas para fechar negocios sem burocracia. Utilizamos o Gemini para:
1. **Interacao Natural**: Transcrevendo e interpretando necessidades em tempo real.
2. **Matchmaking Inteligente**: Cruzando ofertas e demandas considerando localizacao e validade.
3. **Analise de Risco**: Avaliando rotas e condicoes climaticas.

#### Otimizacao de Custos com WAHA (WhatsApp HTTP API)
Para garantir a viabilidade economica e escalabilidade do projeto, optamos por utilizar o **WAHA (WhatsApp HTTP API)** em vez da API oficial do WhatsApp Business. 
- **Custo**: O WAHA permite operar sem os custos recorrentes por mensagem da API oficial.
- **Flexibilidade**: Permite maior controle sobre a sessao e automacao.
- **Open Source**: Baseado em tecnologias abertas, alinhado com a filosofia do projeto.

#### Monitoramento e Logistica
- **Monitoramento Ambiental**: Integracao com APIs do Google para monitorar condicoes que afetam a carga.
- **Otimizacao de Rotas**: Algoritmos inteligentes (TSP + Gemini Analysis) para sugerir o melhor caminho.

## Contribua com o Projeto (Open Source)
Acreditamos que combater a fome e o desperdicio e um dever coletivo. Este projeto esta **ABERTO** para a comunidade.

Queremos sua ajuda para:
- Melhorar os algoritmos de match.
- Otimizar o custo computacional.
- Criar novas integracoes logisticas.
- Aprimorar a UX para o trabalhador rural.

### Como Ajudar
1. Faca um **Fork** deste repositorio.
2. Crie uma branch para sua feature (`git checkout -b feature/minha-melhoria`).
3. Commit suas mudancas (`git commit -m 'feat: melhoria incrivel no match'`).
4. Faca o **Push** (`git push origin feature/minha-melhoria`).
5. Abra um **Pull Request**.

---
*Construido com IA para o futuro do agro.*
