## 🔧 Acessando o pgAdmin

Para gerenciar seu banco via pgAdmin, siga estes passos:

1. **Abra o pgAdmin**  
   Acesse no navegador: http://localhost:8081

2. **Login no pgAdmin**  
- **Email**: `PGADMIN_DEFAULT_EMAIL` (do docker-compose.yml)
- **Senha**: `PGADMIN_DEFAULT_PASSWORD` (do docker-compose.yml)

3. **Registrar um novo servidor**  
1. Clique com o botão direito em **Servers** → **Register → Server…**  
2. Na aba **Geral**  
   - **Name**: `f1-data-explorer`  

3. Na aba **Conexão**  
   | Campo                   | Valor                   |
   | ----------------------- | ----------------------- |
   | Host name/address       | `db`                    |
   | Port                    | `5432`                  |
   | Maintenance database    | `f1-data-explorer`      |
   | Username                | `postgres`              |
   | Password                | `123456789`             |
   | Autenticação Kerberos?  | Desligado               |
   | Salvar senha?           | Opcional (à sua escolha) |
   | Role                    | (deixar em branco)      |
   | Serviço                 | (deixar em branco)      |

4. **Salvar e conectar**  
Clique em **Save**. O servidor aparecerá na árvore lateral e você poderá navegar pelas suas bases e tabelas.
