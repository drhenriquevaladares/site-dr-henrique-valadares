# Site Dr. Henrique Valadares

Site institucional estático para odontologia estética, desenvolvido com HTML, CSS e JavaScript puro.

## Publicar no GitHub Pages

1. Crie um repositório no GitHub e envie os arquivos deste projeto.
2. No repositório, acesse **Settings > Pages**.
3. Em **Build and deployment**, selecione **Deploy from a branch**.
4. Escolha a branch `main` e a pasta `/(root)`.
5. Salve e aguarde o GitHub disponibilizar o endereço do site.

O arquivo `index.html` está na raiz e todos os caminhos do site são relativos, portanto a publicação funciona tanto em um domínio próprio quanto no endereço padrão do GitHub Pages, inclusive em subdiretórios.

## Estrutura principal

```text
index.html
style.css
script.js
images/
icons/
```

## Observações

- Não é necessário instalar dependências ou executar uma etapa de compilação.
- A imagem principal utilizada pelo site é `images/dentista-hero.webp`.
- Antes de publicar em um domínio definitivo, atualize as URLs absolutas de `canonical`, `og:url` e `og:image` caso queira ampliar a prévia de compartilhamento nas redes sociais.
