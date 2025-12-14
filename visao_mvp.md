Você é um arquiteto de produto sênior, especialista em sistemas logísticos, plataformas agrícolas, UX para usuários de baixa fricção, inteligência artificial aplicada a supply chain e geolocalização em tempo real.

Sua tarefa é **analisar TODO o projeto AgroCoop desde o absoluto zero** e gerar **UM ÚNICO ARQUIVO MARKDOWN**, chamado obrigatoriamente:

# visao_mvp.md

⚠️ IMPORTANTE  
Este documento NÃO é:
- documentação técnica para dev
- pitch para investidores
- resumo executivo

Este documento É:
👉 uma **visão total, operacional e funcional** do MVP  
👉 se alguém pegar esse markdown e quiser construir o produto do zero, **não terá dúvidas conceituais**, pois todos os fluxos, decisões e regras estarão explicitados.

---

## CONTEXTO DO PRODUTO

O AgroCoop é um sistema de **planejamento inteligente de produção, compra e logística agrícola**, focado em:

- agricultura familiar
- redução de desperdício
- previsibilidade de oferta
- redução de custo logístico
- uso de IA explicável
- planejamento (não compra por impulso)

O sistema **NÃO é um marketplace simples**.
Ele é um **sistema de coordenação logística e preditiva**.

---

## PRINCÍPIOS OBRIGATÓRIOS

1. Não existe compra emergencial de alimentos (ex: alface)
   → tudo é planejado por safra, clima e logística.

2. O comprador SEMPRE é responsável pelo frete  
   → ele manda buscar no produtor.

3. O sistema pode:
   - consolidar vários produtores em um mesmo caminhão
   - consolidar várias entregas para vários compradores
   - reduzir o número total de viagens

4. O sistema sugere:
   - tipo de transporte (terrestre, fluvial)
   - necessidade de refrigeração
   - melhor dia/horário de coleta (baseado no clima)
   - rota completa do caminhão

5. IA SEMPRE explica suas decisões em linguagem humana.

---

## O QUE VOCÊ DEVE ENTREGAR NO visao_mvp.md

### 1. Visão Geral do Produto
Explique claramente:
- o problema real
- por que soluções tradicionais não resolvem
- o que o AgroCoop faz de diferente

---

### 2. Perfis de Usuário

Detalhe profundamente:

#### Agricultor / Produtor
- quem é
- dores
- nível técnico
- expectativas
- o que ele ganha usando o sistema

#### Comprador (mercado, escola, restaurante, distribuidor)
- como ele compra hoje
- riscos atuais
- o que ele espera do sistema

---

### 3. Fluxos de Autenticação

Descreva:
- tela de login
- tela de cadastro
- diferenças entre agricultor e comprador
- recuperação de senha
- validações mínimas
- o que acontece após o primeiro login

---

### 4. Cadastro do Agricultor (PASSO A PASSO)

Detalhar **tela por tela**, incluindo:
- campos
- botões
- textos explicativos
- validações
- campos opcionais
- campos obrigatórios

Blocos obrigatórios:
1. Identidade produtiva
2. Localização (geolocalização real)
3. Produção e oferta
4. Previsão de colheita
5. Qualidade e manejo (autodeclarado)
6. Pós-colheita e armazenamento
7. Logística disponível
8. Dificuldades atuais
9. Conformidade (opcional, nunca bloqueante)
10. Reputação dinâmica (explicada)

---

### 5. Cadastro do Comprador (PASSO A PASSO)

Detalhar:
- tipo de comprador
- volume médio
- produtos de interesse
- janelas de entrega
- limites de preço
- aceitação de produtos fora do padrão estético
- tolerância a risco

---

### 6. Dashboard do Agricultor

Descrever exatamente:
- o que ele vê ao entrar
- indicadores
- alertas
- sugestões da IA
- previsão de vendas
- reputação e como melhorar
- próximos passos recomendados

---

### 7. Dashboard do Comprador (estilo iFood, mas planejado)

Descrever:
- mapa em tempo real (Mapbox ou similar)
- produtores disponíveis por período futuro
- filtros (preço, risco, distância, qualidade)
- alertas de oportunidade
- visão de planejamento semanal/mensal
- botão de “planejar compra”

---

### 8. Logística Inteligente (MUITO IMPORTANTE)

Descrever com extremo detalhe:

- como o sistema agrupa produtores
- como monta rotas de caminhão
- como define quantidade ótima de veículos
- como considera:
  - clima (INMET)
  - distância
  - volume
  - tipo de produto
  - necessidade de refrigeração
- diferença entre transporte terrestre e fluvial
- como o comprador vê o custo estimado
- como o agricultor vê o plano de coleta

---

### 9. Uso de Mapas e Geolocalização

Explique:
- por que usar Mapbox / Google Maps
- como a geolocalização é usada pela IA
- visualização de rotas
- previsão de atraso
- impacto climático nas rotas

---

### 10. Inteligência Artificial

Detalhar modelos, mesmo que conceituais:

1. Motor de Matching
2. Previsão de risco logístico
3. Reputação dinâmica
4. Sugestão de preço
5. Alertas preditivos

Sempre explicando:
- entradas
- saídas
- explicação ao usuário

---

### 11. Regras de Negócio IMPORTANTES

Liste explicitamente:
- o que é permitido
- o que não é permitido
- o que o sistema nunca fará
- como evitar fraude
- como evitar desperdício

---

### 12. Experiência do Usuário (UX)

Descrever:
- tom da linguagem
- microcopy
- acessibilidade
- uso em celular
- funcionamento em áreas com internet instável

---

### 13. Resultado Esperado do MVP

Explique:
- como saber que o MVP deu certo
- quais métricas importam
- o que NÃO importa no MVP

---

## FORMATO FINAL

- Tudo em **Markdown**
- Texto claro, direto e profundo
- Nenhuma decisão vaga
- Nenhum “pode ser”
- Nenhum “a definir”
- Tudo fechado conceitualmente

O objetivo é que **este documento seja a fonte única de verdade do produto**.

Gere agora o arquivo completo `visao_mvp.md`.