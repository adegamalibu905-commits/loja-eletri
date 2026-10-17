# Como editar esta loja (para o Claude)
- Produtos: data/produtos.json (id único; ativo:false esconde; imagem: caminho em img/ ou vazio para placeholder).
- Textos, WhatsApp, frete, cupons, rodapé: data/config.json.
- Cores, fontes, bordas, espaços: SOMENTE variáveis em css/tema.css.
- Avaliações iniciais: data/avaliacoes.json. Envio: função enviarAvaliacao em js/app.js.
- Pagamento: api/criar-pagamento.js (variáveis RAVEN_API_KEY e RAVEN_API_URL). Nunca coloque chaves no front-end.
Regras: mostre sempre o arquivo completo alterado, mantenha JSON válido, não quebre a estrutura.
