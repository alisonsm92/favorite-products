# favorite-products-api
API para gerenciar produtos favoritos de clientes.

## Organização do projeto
Arquitetura do projeto foi baseada na [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html). A nomenclatura utilizada teve como referência o repositório [helpdeveloper/java-modular-architecture](https://github.com/helpdeveloper/java-modular-architecture/tree/ede206d172eafa6c52b3d3a183b493aa173acfb4).

Segue as camadas e diretórios em que o projeto está dividido:
## core
Camada onde são implementadas as regras de negócio.

### domain
Diretório que contêm as interfaces que representam as entidades utilizadas pelos casos de uso.

### use-case
Diretório que contêm as classes que implementam o comportamento das funcionalidades exigidas.

## adapter
Camada que abstrai a comunicação com o mundo externo como banco de dados, interfaces de API, comunicação com serviços externos e etc.

### input
Diretório que contêm os controllers que processam as solicitações HTTP de entrada e envia resposta de volta ao cliente.

### output
Diretório que contêm os repositórios para acesso a dados da base de dados e serviços externos.

## app
Camada onde são implementadas as configurações para rodar o servidor HTTP utilizando o framework web escolhido.

## common
Diretório que possui as classes utilizadas em comum por mais de uma camada.

## config
Diretório com as configurações das variáveis de ambiente do projeto.

## Executando a aplicação
* Tenha instalado [NodeJS](https://nodejs.org) ou [Docker](https://docs.docker.com) na sua máquina.
* Crie um arquivo .env, seguindo o exemplo .env-example.
    * `PRODUCTS_API_URL` URL da API de produtos
    * `NODE_ENV` Ambiente em que será executada a aplicação `test|development|production`
    * `PORT` Número da porta em que deseja rodar o servidor HTTP
    * `LOG_LEVEL` Especifica o nível dos logs a serem exibidos `fatal|error|warn|info|debug|trace|silent`
    * `LOG_PRETTY_PRINT` Ativa ou desativa formatação dos logs `true|false`
    * `MONGO_URL` URL para conexão com uma base de dados [mongoDB](https://www.mongodb.com)
    * `MONGO_TIMEOUT_MS` Especifica quanto tempo (em milissegundos) esperar pela conexão com o [mongoDB](https://www.mongodb.com) antes de lançar uma exceção
    * `AXIOS_TIMEOUT_MS` Especifica o tempo (em milissegundos) antes que a requisição a um serviço externo seja abortada
    * `COMPOSE_PROJECT_NAME` Especifica o nome do projeto para o docker compose

### Inicializando a aplicação com Docker Compose
~~~shell
docker compose up
~~~
Neste modo de inicialização um container com o [mongoDB](https://www.mongodb.com) será inicializado localmente, não necessitando configurar a base de dados de forma independente.

### Inicializando a aplicação com NodeJS
~~~shell
npm i
npm run build
npm run start
~~~
Neste modo de inicialização é necessário definir um valor para a variável de ambiente `MONGO_URL` no arquivo `.env` correspondente a uma conexão com uma base de dados [mongoDB](https://www.mongodb.com).

## Casos de uso
* **Criar cliente**: acessível através do endpoint `POST /customer` informando os dados do cliente no corpo da requisição;
* **Obter cliente**: acessível através do endpoint `GET /customer/<id>` informando o identificador do cliente;
* **Deleter cliente**: acessível através do endpoint `DELETE /customer/<id>` informando o identificador do cliente;
* **Adicionar produto a lista de produtos favoritos do cliente**: acessível através do endpoint `POST /customer/<customer-id>/favorite-product/<product-id>` informando o identificador do cliente e do produto;
* **Obter lista de produtos favoritos do cliente**: acessível através do endpoint `GET /customer/<id>/favorite-product` informando o identificador do cliente.

## Comandos
Os comandos a seguir podem ser executados em um ambiente com o [NodeJS](https://nodejs.org) instalado e após instalar as dependências do projeto (`npm i`).
Comando   | Descrição
--------- | ------
`npm run start` | Inicializa aplicação
`npm run build` | Executa o build do projeto transpilando o código em TypeScript
`npm run test` | Executa todos os testes do projeto
`npm run test:unit` | Executa os testes unitários
`npm run test:integration` | Executa os testes de integração
`npm run test:coverage` | Executa todos os testes do projeto e gera relatório de coberta de testes
`npm run lint` | Executa validação de lint nos arquivos do projeto
`npm run lint` | Executa validação de lint nos arquivos do projeto com correção automáica
