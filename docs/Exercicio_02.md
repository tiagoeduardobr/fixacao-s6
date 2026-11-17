# Exercício 2 — Onde estou?

## expo-location · 25 minutos

1. Instale a dependência:

   ```bash
   npx expo install expo-location
   ```

2. Adicione um botão "Descobrir minha posição" que peça a permissão e busque a posição.

3. Mostre latitude, longitude e precisão (em metros).

4. Com `reverseGeocodeAsync`, mostre a cidade e o estado no formato "cidade - estado".

5. Implemente os 3 estados:
   - Carregando: exiba um `ActivityIndicator`.
   - Permissão negada: exiba uma mensagem e um botão "Abrir configurações".
   - Dados disponíveis: exiba as informações da localização.

## Desafio extra

Adicione um botão "🗺️ Ver no mapa" com:

```typescript
Linking.openURL('[https://maps.google.com/?q=](https://maps.google.com/?q=)' + lat + ',' + lng);
```
