# MGF Barbearia

Aplicação local de gestão feita com Express e SQLite. O acesso é exclusivo da conta `admin`; não há cadastro nem login para outros usuários.

O painel inclui cadastro e consulta de cortes, busca de clientes com histórico e total gasto, relatórios por período e configuração para alterar a senha do administrador.

## Configuração

Requer Node.js instalado. Copie `.env.example` para `.env` e configure `SESSION_SECRET` com pelo menos 32 caracteres aleatórios. Para criar um banco novo, configure também `ADMIN_PASSWORD` com pelo menos 12 caracteres. O banco existente é mantido; a senha antiga do administrador é convertida para hash automaticamente na primeira inicialização atualizada.

No PowerShell, variáveis podem ser definidas para a sessão atual assim:

```powershell
$env:SESSION_SECRET = "um-segredo-aleatorio-com-mais-de-32-caracteres"
$env:ADMIN_PASSWORD = "uma-senha-forte-com-12-ou-mais-caracteres"
npm start
```

Em banco já existente, para trocar a senha do admin:

```powershell
$env:ADMIN_PASSWORD = "uma-nova-senha-forte-com-12-ou-mais-caracteres"
node scripts/definir-senha-admin.js
```

O arquivo `.env` não é carregado automaticamente. Defina as variáveis no ambiente do processo ou use um carregador de ambiente instalado/configurado no seu ambiente de execução.
