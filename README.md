<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://cadastra.com/pt-br">
    <img src="src\img\logo.png" alt="Logo" width="200" weight="200" />
  </a>

  <p align="center">
     Criação de um mini E-Commerce utilizando HTML5, Sass, Javascript, Typescript e Gulp.
  </p>
</p>

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Sumário</summary>
  <ol>
    <li>
      <a href="#sobre-o-projeto">Sobre o projeto</a>
      <ul>
        <li><a href="#feito-com">Feito com</a></li>
      </ul>
    </li>
    <li>
      <a href="#iniciando-o-projeto">Iniciando o projeto</a>
      <ul>
        <li><a href="#pré-requisitos">Pré-requisitos</a></li>
        <li><a href="#instalação">Instalação</a></li>
      </ul>
    </li>
    <li><a href="#contato">Contato</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
### Sobre o projeto
O projeto foi construído com compiladores Javascript, sendo o Webpack e o Gulp. Estes compiladores têm por função interpretar códigos Javascript modernos e converter para Javascript "antigo", a fim de compatibilizar as aplicações com os diversos navegadores. Através do Gulp foram criadas rotinas para minificar CSS e também IMAGENS, visto que este era um ponto proposto no teste, para que eles não fiquem tão pesados na exibição do navegador e para a largura de banda da internet do usuário.

Através do layout proposto neste [link](https://www.figma.com/file/Z5RCG3Ewzwm7XIPuhMUsBZ/Desafio-Cadastra) foram feitas as funcionalidades solicitadas, como a apresentação dos produtos cadastrados em uma api local, filtragem por cor, tamanho e faixa de preço, bem como a ordenação por produtos mais recentes, menor preço, maior preço, além da adição destes produtos no carrinho exibindo o total das compras feitas pelo usuário. Toda a exibição do produto é dinâmica, ou seja, ao tentar comprar um produto sem selecionar uma cor ou tamanho o usuário é notificado através de um "toastify" para realizar a seleção do SKU, ao decorrer da seleção dos filtros, as opções são dinamicamente exibidas, ou seja, ao clicar em uma cor, os tamanhos disponíveis para ela ficam em evidência, as cores não disponíveis ficam indisponíveis para seleção, isso facilita a busca do usuário através de um controle de estoque do para aquele SKU, produtos sem estoque não devem ser vendidos ou apresentados.

### Aplicação desktop

https://github.com/BrunoCarvalhoFeitosa/airbnb-clone/assets/46093815/964f70f4-4223-4c1e-9ccc-31399dd9aa85

### Aplicação mobile

https://github.com/BrunoCarvalhoFeitosa/airbnb-clone/assets/46093815/f75039a8-8f80-42aa-8a0d-b7aa266a5f07

### Feito com

* [Webpack](https://webpack.js.org)
* [Gulp](https://gulpjs.com)
* [Typescript](https://www.typescriptlang.org)
* [Toastify JS](https://apvarun.github.io/toastify-js/)

<!-- GETTING STARTED -->
## Iniciando o projeto

Primeiramente será necessário clonar este projeto em (https://github.com/BrunoCarvalhoFeitosa/desenvolvedor-cadastra-bruno-carvalho-feitosa.git), após o download será necessário abrir este projeto no seu editor e no terminal digitar npm install, posteriormente é digite npm run dev em uma terminal e em outro npm run start para a api de produtos funcionar.

### Pré-requisitos

* npm
  ```sh
  npm install npm@latest -g
  ```

### Instalação

1. Clone o repositório
   ```sh
   git clone https://github.com/BrunoCarvalhoFeitosa/desenvolvedor-cadastra-bruno-carvalho-feitosa.git
   ```
2. Instale os pacotes do NPM
   ```sh
   npm install
   ```
   
3. Inicie o projeto
   ```sh
   npm run dev
   ```

4. Inicie a api de produtos
   ```sh
   npm run start
   ```

<!-- CONTACT -->
## Contato

Bruno Carvalho Feitosa - [GitHub](https://github.com/BrunoCarvalhoFeitosa) - [LinkedIn](https://www.linkedin.com/in/bruno-carvalho-feitosa/)

E-mail para contato: brunocarvalhofeitosa@outlook.com
