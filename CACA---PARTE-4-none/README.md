# CACA---PARTE-3

Trabalho realizado por:
- Miguel Medeiros 2024109933 
- Sara Freire 2024109364
- Tomás Moreira 2023108679

# Centro Académico Clínico dos Açores (CACA) 

Este projeto consiste na evolução do portal institucional do CACA, integrando funcionalidades avançadas de persistência de dados local, gestão dinâmica de eventos e integração com serviços externos (Meteorologia e Mapas).


# Especificações Implementadas

### 1. Gestão de Eventos 
**Adicionar Evento:** Formulário completo para registo de novos eventos (título, descrição, data, hora e local).
**Visualizar Eventos:** Exibição dinâmica em grelha de todos os eventos registados na base de dados local.
**Editar Evento:** Interface para modificação imediata de detalhes de eventos já existentes.
**Remover Evento:** Funcionalidade de exclusão com confirmação para gestão da listagem.
**Persistência:** Implementação de IndexedDB para garantir que os dados não se percam ao fechar ou atualizar o navegador.

### 2. Subscrição de Newsletter
**Formulário de Subscrição:** Recolha de nome e e-mail no rodapé do portal.
**Armazenamento Local:** Dados dos subscritores guardados na objectStore dedicada dentro da IndexedDB.
**Validação e Feedback:** Sistema de validação de campos obrigatórios e formato de e-mail com mensagens visuais de sucesso ou erro.

### 3. Integração com Web APIs Externas
**API de Previsão Meteorológica:** Integração com a Visual Crossing API para exibir condições climáticas (temperatura, descrição, ícone) com base na data e local inseridos no evento.
**API de Mapas:** Integração com OpenStreetMap (Leaflet.js) para renderizar um mapa interativo com marcador posicionado no local definido pelo utilizador.

### 4. Interface e Experiência do Utilizador (UI/UX)
**Identidade Visual:** Manutenção da paleta de cores e tipografia estabelecida nos projetos anteriores.
**Design Responsivo:** Adaptabilidade total para dispositivos móveis e desktop (menu hambúrguer, grelhas flexíveis).
**Interatividade:** Sistema de Tabs para alternar entre Mapa e Meteorologia, spinners de carregamento e transições suaves.


