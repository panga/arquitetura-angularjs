Aplicação de Exemplo
====================

Esta aplicação de exemplo utiliza o framework [AngularJS](https://angularjs.org/) e já contém toda a estrutura necessária para o desenvolvimento e a distribuição da aplicação, utilizando um conjunto de boas práticas e design patterns que aumentarão a produtividade do desenvolvimento e reduzirão o código boilerplate.  

Entre os recursos utilizados posso citar o [LESS](http://lesscss.org/), mecanismo de log, mock da API back-end, controle de rotas, camada de modelo, animações, loading, testes unitários e testes end-to-end.  

Para que a aplicação funcione corretamente é necessário que as dependências do [NodeJS](http://nodejs.org/) sejam instaladas, para isto, abra um terminal, navegue até o diretório raiz da aplicação e execute o comando `npm install`.  

[Demonstração](https://panga.github.io/arquitetura-angularjs)

### Estrutura de diretórios e arquivos

#### Árvore
```
/
    /app
        /assets
            /fonts
            /images
        /components
        /libs
        /mocks
        /scripts
            /config
                config.js
                local.js
                routes.js
            /models
            /services
            app.js
        /states
        /styles
            main.less
        index.html
    /test
        /e2e
            /states
        /unit
            /components
            /mocks
            /scripts
            /states
    /dist
    .bowerrc
    .editorconfig
    .jshintrc
    bower.json
    Gruntfile.js
    karma.conf.js
    package.json
    protractor.conf.js
    resources.json
```

#### Descrição
```
/app -> Código-fonte da aplicação
/app/assets -> Armazena recursos utilizados pela aplicação (imagens, fontes, json, etc.)
/app/assets/fonts -> Específico para armazenar fontes
/app/assets/images -> Específico para armazenar imagens
/app/components -> Armazena os componentes criados para a aplicação (widgets ou directives), podem conter HTML, JS e LESS
/app/libs -> Armazena as bibliotecas utilizadas pela aplicação e que são gerenciadas pelo Bower, podem ser bibliotecas de terceiros ou próprias
/app/mocks -> Armazena os mocks utilizados durante o desenvolvimento da aplicação
/app/scripts -> Armazena os arquivos de scripts da aplicação, pode conter apenas arquivos JS
/app/scripts/config -> Scripts de configuração de aplicação como por exemplo API e rotas
/app/scripts/config/config.js -> Configuração da API e dos providers
/app/scripts/config/local.js -> Configuração local da API utilizada apenas para desenvolvimento
/app/scripts/config/routes.js -> Configuração global das rotas
/app/scripts/models -> Armazena a camada de modelo da aplicação utilizando o pattern Active Record
/app/scripts/services -> Armazena os serviços da aplicação (factories, providers, etc.)
/app/scripts/app.js -> Módulo principal da aplicação AngularJS
/app/states -> Armazena os estados da aplicação (views, controllers e estilos), pode conter apenas arquivos HTML, JS e LESS
/app/styles -> Armazena os estilos da aplicação, pode conter apenas arquivos LESS
/app/styles/main.less -> Centraliza todos os estilos utilizados na aplicação que posteriormente serão compilados no arquivo main.css
index.html -> Página principal da aplicação que utiliza o modelo SPA e inclui todos os recursos de scripts e estilos.
/test -> Armazena os testes da aplicação, utilizando o framework Jasmine
/test/e2e -> Específico para os testes end-to-end da aplicação
/test/e2e/states -> Específico para os estados
/test/unit -> Armazena os testes unitários da aplicação
/test/unit/components -> Específico para os componentes
/test/unit/mocks -> Armazena os mocks utilizados nos testes unitários
/test/unit/scripts -> Específico para os scripts
/test/unit/states -> Específico para os estados
/dist -> Diretório da aplicação gerada para distribuição
.bowerrc -> Configurações do Bower e da estrutura de diretórios da aplicação
.editorconfig -> Configurações de editor do projeto utilizado pelas IDE que o suportam (SublimeText)
.jshintrc -> Configurações de qualidade do código utilizado pelo JSHint
bower.json -> Dependências de bibliotecas da aplicação, deve ser gerenciado pelo Bower
Gruntfile.js -> Configurações de build da aplicação com 20+ plugins configurados e utilizados pelo Grunt
karma.conf.js -> Configurações de testes unitários da aplicação, utilizado pelo Karma
package.json -> Dependências do NodeJS utilizadas no ambiente de desenvolvimento
protractor.conf.js -> Configurações do testes end-to-end da aplicação, utilizado pelo Protractor
resources.json -> Configuração dos recursos utilizados pela aplicação que serão inseridos automaticamente no index.html
```

### Bibliotecas
Os módulos do AngularJS e bibliotecas já incluídas na aplicação são:  

[Mocks](https://docs.angularjs.org/api/ngMock) -> Cria mocks para testes unitários e mock da API.  

[Messages](https://docs.angularjs.org/api/ngMessages) -> Gerencia as mensagens de validação dos formulários.  

[Animate](https://docs.angularjs.org/api/ngAnimate) -> Adiciona animações via CSS para as ações do Angular.  

[Cookies](https://docs.angularjs.org/api/ngCookies) -> Gerencia os cookies da aplicação.  

[Sanitize](https://docs.angularjs.org/api/ngSanitize) -> Formata e escapa o HTML que será demonstrado na página.   

[Locale](https://docs.angularjs.org/guide/i18n) -> Adiciona suporte para localização (pt_BR) nos filtros de data, moeda e pluralização.  

[UI-Router](https://github.com/angular-ui/ui-router) -> Gerencia as rotas da aplicação, sem utilizar o provedor padrão do Angular.  

[UI-Bootstrap](http://angular-ui.github.io/bootstrap/) -> Biblioteca para utilizar os componentes do Bootstrap.  

[Busy](https://github.com/cgross/angular-busy) -> Adiciona o controle de carregamento de partes da página utilizando [promises](https://docs.angularjs.org/api/ng/service/$q).  

[Loading Bar](http://chieffancypants.github.io/angular-loading-bar/) -> Cria uma barra de progresso global para as requisições HTTP.  

[Local Storage](http://gregpike.net/demos/angular-local-storage/demo/demo.html) -> Gerencia o localStorage, novo recurso do HTML5, com fallback para cookies.  

[Rails Resource](https://github.com/FineLinePrototyping/angularjs-rails-resource) -> Camada de modelo da aplicação utilizando o pattern Active Record para se comunicar com a API.  

[UUID](https://github.com/ajsd/angular-uuid) -> Fábrica de identificações no formato UUID.  

[JQuery](http://jquery.com/) -> Biblioteca JavaScript para manipulação de DOM utilizada pelo AngularJS.  

[Log](http://adamschwartz.co/log) -> Biblioteca de Logging.  

[Lodash](http://lodash.com/) -> Biblioteca para manipulações de coleções em JavaScript.  

[Jasmine](http://jasmine.github.io/2.0/introduction.html) -> Biblioteca para escrever testes.  

### Tarefas
As tarefas são gerenciadas pelo [GRUNT](http://gruntjs.com/), que é um build system baseado na execução de tarefas.
Uma tarefa pode ser composta de uma ou mais tarefas e geralmente essas tarefas são plugins instalados pelo gerenciador de pacotes da plataforma.  

Além disso, elas podem ser executadas de forma paralela, podem possuir classificações específicas (targets) e também executarem indefinitivamente até que sejam interrompidas pelo usuário.  

Para executar as tarefas, abra um terminal, navegue até o diretório raiz da aplicação e execute o seguinte comando `grunt <tarefa>`.  
As tarefas pré-definidas são:  

__build__ -> Prepara a aplicação para distribuição, executando as tarefas de testes unitários, concatenação, minificação e revisão, disponibilizando a aplicação no diretório dist.  

__build:dev__ -> Prepara a aplicação para distribuição, porém não executa as tarefas para tratamento dos arquivos, apenas testa e disponibiliza a aplicação na versão development no diretório dist.  

__test__ -> Executa os testes unitários da aplicação que estão no diretório test/unit, existe a opção de autowatch para que os testes fiquem executando e sempre que houver alterações em arquivos os testes são executados automaticamente.  

__test-e2e__ -> Executa os testes end-to-end da aplicação que estão no diretório test/e2e, para esta tarefa funcionar é necessário que o selenium webdriver server esteja iniciado, conforme documentação do [Protractor](https://github.com/angular/protractor), e que possua os navegadores Chrome e Firefox instalados.  

__server__ -> Executa um servidor HTTP na porta 9000 e abre o navegador padrão, utilizando os arquivos de desenvolvimento que estão no diretório app e fica escutando por alterações que ocorram nos arquivos, carregando-as automaticamente no navegador que foi aberto, este recurso é conhecido como livereload. Esta opção utiliza os mocks da API que estão mo diretório app/mocks.  

__server:dist__ -> Realiza o build da aplicação e executa um servidor HTTP na porta 9000, utilizando os arquivos da versão de distribuição que estão no diretório dist.  

_Obs.: Algumas tarefas podem gerar o diretório .tmp no diretório raiz da aplicação, este diretório é necessário enquanto as tarefas estiverem sendo executadas, depois disso podem ser apagados e não devem ser versionados._
