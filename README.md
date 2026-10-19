# krameldocs

Portal de documentação técnica com conteúdo em Markdown armazenado em um repositório GitHub independente. Oferece navegação hierárquica, realce de sintaxe, links entre páginas e suporte a imagens e anexos.

## Requisitos

- Node.js compatível com a versão do Next.js utilizada pelo projeto.
- npm.
- Um repositório GitHub com os arquivos da documentação.

## Instalação

Instale as dependências:

```bash
npm install
```

Crie o arquivo `.env.local` na raiz do projeto e configure as variáveis de ambiente descritas abaixo.

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Configuração

Configure as seguintes variáveis de ambiente:

| Variável | Obrigatória | Descrição |
|---|---|---|
| `DOCS_GIT_REPOSITORY` | Sim | Repositório GitHub no formato `organização/repositório`. |
| `DOCS_GIT_BRANCH` | Não | Branch do conteúdo. Padrão: `main`. |
| `DOCS_GIT_PATH` | Não | Diretório dentro do repositório onde está a documentação. |
| `DOCS_CACHE_TTL` | Não | Tempo de cache em segundos. Padrão: `60`. |
| `GITHUB_TOKEN` | Depende | Token para acessar conteúdo privado ou autenticar requisições à API do GitHub. |

Exemplo:

```dotenv
DOCS_GIT_REPOSITORY=kramelworks/krameldocs-content
DOCS_GIT_BRANCH=main
DOCS_GIT_PATH=
DOCS_CACHE_TTL=60
GITHUB_TOKEN=
```

Para repositórios privados, configure um token do GitHub com as permissões mínimas necessárias para ler o conteúdo do repositório.

**Segurança:** mantenha o token exclusivamente no servidor. Não utilize o prefixo `NEXT_PUBLIC_` nem inclua credenciais no código enviado ao navegador. Não versione `.env.local` ou qualquer arquivo que contenha segredos.

O arquivo `.env.example` serve como referência para configurar os ambientes.

## Estrutura do repositório de conteúdo

Exemplo de organização:

```text
krameldocs-content/
├── navigation.json
├── index.md
├── guias/
│   ├── instalacao.md
│   └── configuracao.md
├── referencia/
│   └── api.md
└── assets/
    ├── arquitetura.png
    └── manual.pdf
```

### Navegação

O arquivo `navigation.json` define a hierarquia e a ordem das páginas. Grupos podem conter outros grupos ou páginas. Cada página utiliza a propriedade `file` para apontar para um arquivo Markdown relativo à raiz do repositório de conteúdo.

Consulte o `navigation.json` do repositório de conteúdo para verificar o formato utilizado.

### Markdown e anexos

O portal suporta Markdown com extensões GFM, incluindo tabelas, além de realce de sintaxe para blocos de código.

Links para outros arquivos `.md` são resolvidos para as rotas correspondentes do portal. Imagens e anexos relativos devem utilizar caminhos a partir da raiz do repositório:

```markdown
![Diagrama de arquitetura](assets/arquitetura.png)

[Consultar o manual em PDF](assets/manual.pdf)
```

Os anexos são disponibilizados por uma rota da aplicação, inclusive quando o repositório de conteúdo é privado.

## Desenvolvimento

Executar o servidor:

```bash
npm run dev
```

Verificar o lint:

```bash
npm run lint
```

Verificar os tipos TypeScript:

```bash
npx tsc --noEmit
```

Executar os testes:

```bash
npm test
```

Gerar o build de produção:

```bash
npm run build
```

Executar a aplicação compilada:

```bash
npm run start
```

## Deploy

O krameldocs pode ser implantado em um ambiente compatível com Next.js.

1. Configure o repositório da aplicação no provedor de hospedagem.
2. Cadastre as variáveis de ambiente de produção.
3. Configure `GITHUB_TOKEN` como segredo do ambiente, quando necessário.
4. Execute o build de produção.
5. Verifique as rotas `/`, `/docs` e uma página de documentação.
6. Verifique também o carregamento de imagens e anexos.

Não publique credenciais nos logs, no repositório ou no código do cliente.

Consulte a [documentação oficial de deploy do Next.js](https://nextjs.org/docs/app/building-your-application/deploying) para instruções específicas do ambiente escolhido.

## Tecnologias

- Next.js
- React
- TypeScript
- Tailwind CSS
- GitHub Contents API
- Unified, Remark e Rehype
- Shiki para realce de sintaxe
- Vitest para testes

## Licença

Defina a licença do projeto antes de distribuir ou publicar o código.
