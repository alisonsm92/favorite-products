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

## doc
Diretório com a especificação da documentação da API.

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
    * `SWAGGER_UI_PORT` Especifica a porta onde será disponibilizada a documentação de API com o [Swagger UI](https://swagger.io/tools/swagger-ui/)

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
* **Criar cliente**: Cadastra um novo cliente informando os dados: `nome` e `email`;
* **Obter cliente**: Retorna os dados de um cliente informando o seu identificador;
* **Deletar cliente**: Remove o registro de um cliente informando o seu identificador;
* **Adicionar um produto favorito**: Adiciona um produto na lista de produtos favoritos de um cliente informando o identificador do cliente e do produto;
* **Obter lista de produtos favoritos**: Retorna a lista de produtos favoritos de um cliente informando o identificador do cliente.

## Documentação da API
A documentação da API segue a especificação [OpenAPI](https://spec.openapis.org/oas/v3.1.0) e está implementada no arquivo [openapi.yml](https://github.com/alisonsm92/favorite-products/blob/main/src/doc/openapi.yml) no diretório `src/doc` do projeto. Pode ser acessada por esse [link](http://localhost:3001/docs/) se você inicializou o projeto com o docker compose com as configurações padrões. Senão, configure a porta em que deseja que o [Swagger UI](https://swagger.io/tools/swagger-ui/) irá rodar através da variável de ambiente `SWAGGER_UI_PORT`. Também é possível copiar a especificação do arquivo [openapi.yml](https://github.com/alisonsm92/favorite-products/blob/main/src/doc/openapi.yml) e utilizar o [Swagger Editor](https://editor.swagger.io/) para visualizar.

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
