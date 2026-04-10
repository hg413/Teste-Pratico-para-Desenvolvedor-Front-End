# S.G.U - Sistema de Gestão de Usuarios (Desafio Angular)

Este projeto é uma aplicação Angular desenvolvida como parte de um desafio técnico. A aplicação consiste em uma listagem de usuários com funcionalidades de busca, criação e edição.

## 🚀 Tecnologias Utilizadas

- **Angular 18+** (Componentes Standalone, Signals)
- **Angular Material** (UI Components)
- **RxJS** (Filtro com Debounce, Operadores asíncronos)
- **Vitest** (Testes Unitários de alta performance)
- **TypeScript**

## 📂 Estrutura do Projeto

O projeto segue uma arquitetura modular baseada em pastas para melhor organização e escalabilidade:

- `src/app/core`: Contém modelos de dados (`models`) e o serviço principal de estado e dados (`services`).
- `src/app/features/users`: Contém os componentes específicos da funcionalidade de usuários (listagem, card, formulário).
- `src/app/shared`: Componentes reutilizáveis (loading) e utilitários (validadores).

## 🛠️ Como Executar

### Pré-requisitos
- Node.js (versão 18 ou superior recomendada)
- NPM

### Instalação
1. Clone ou baixe o projeto.
2. Na raiz do projeto, execute:
   ```bash
   npm install
   ```

### Rodando a Aplicação
Execute o comando:
```bash
npm start
```
Acesse `http://localhost:4200` no seu navegador.

### Rodando os Testes
Para executar os testes unitários com Vitest:
```bash
npm test
```

## 📝 Decisões Técnicas

1.  **Signals**: Utilizei a nova API de Signals do Angular para gerenciamento de estado. Isso garante uma detecção de mudanças mais fina e performática, eliminando a dependência do Zone.js em versões futuras e simplificando a lógica de estados complexos.
2.  **RxJS no Filtro**: Para o requisito de debounce de 300ms, o RxJS continua sendo a melhor ferramenta. Combinei `valueChanges` com `debounceTime` e `distinctUntilChanged`.
3.  **Mock Data**: Optei por um mock service interno com `delay` do RxJS para simular o comportamento de uma API real sem a necessidade de o avaliador configurar serviços externos (como JSON Server).
4.  **Validadores Customizados**: Implementei validação de CPF e Telefone (Regex e lógica de dígitos) para demonstrar rigor técnico no tratamento de dados.

## ✅ Funcionalidades Implementadas

- [x] Listagem de usuários em cards.
- [x] Filtro por nome com debounce (300ms).
- [x] Feedback de Loading e Erro.
- [x] Modal de Cadastro e Edição.
- [x] Validações de formulário em tempo real.
- [x] Botão FAB vermelho conforme protótipo.
- [x] Gerenciamento de memória (takeUntilDestroyed).

---
Desenvolvido por **Bruno Lima**.
NÃO SEI SE VOCÊS VERÃO ESSA  MENSAGEM, MAS PARA DEIXAR CLARO, PASSEI 2 DIAS VIRADOS TENTANDO APRENDER ANGULAR E FAZER ESSE PROJETO, SIM, EU USEI IA MAS NÃO FOI PARA TUDO e NÃO, NÃO TENHO VERGONHA DE ADMITIR, POIS FINALMENTE ESTOU ENTREGANDO ESSE SISTEMA FUNCIONAL QUE É O OBJETIVO!!!!!!!!!!!
