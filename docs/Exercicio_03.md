# Exercício 1 — O mapa das cafeterias

## react-native-maps · 25 minutos

1. Instale a dependência:

   ```bash
   npx expo install react-native-maps
   ```

2. Crie o tipo `CoffeeShop` em `types/index.ts`, com os campos:
   - `id`.
   - `name`.
   - `neighborhood`.
   - `rating`.
   - `latitude`.
   - `longitude`.

   Monte uma lista com 5 cafeterias usando os dados enviados pelo professor.

3. Adicione um `MapView` na parte superior, com `flex: 1`, começando em Florianópolis e com um `Marker` para cada cafeteria.

4. Abaixo do mapa, adicione uma `FlatList` horizontal de cartões. Ao tocar em um cartão, use `animateToRegion` para mover o mapa até a cafeteria correspondente.

5. Destaque a cafeteria selecionada:
   - Pino verde no mapa.
   - Borda no cartão.

## Desafio extra

- Adicione um botão "Ver a cidade toda".
- Exiba a localização do usuário com a bolinha azul (`showsUserLocation`).
