# Exercício 1 — O cartão de visita nativo

## Haptics · Share · Linking · 20 minutos

## 1. Crie o projeto Expo

No terminal, execute:

```bash
npx create-expo-app@latest fixacao-s6
cd fixacao-s6
```

## 2. Instale a dependência

Dentro da pasta do projeto, execute:

```bash
npx expo install expo-haptics
```

## 3. Desenvolva o cartão em TypeScript

Crie um cartão com seu nome, cargo e 4 botões:

- 📞 Ligar (`tel:`).
- ✉️ E-mail (`mailto:`).
- 💬 WhatsApp (`https://wa.me/55...`).
- 📤 Compartilhar cartão (`Share.share` com nome, telefone e e-mail).

Todo botão deve dar uma batidinha (`impactAsync`) antes de abrir.

Use `try/catch` no `openURL`: se não abrir, exiba um `Alert`.

## 4. Execute o projeto

No terminal, dentro da pasta do projeto, execute:

```bash
npx expo start
```

## Desafio extra

- Adicione um botão "🗺️ Como chegar" que abra o endereço no Google Maps.
- Adicione uma vibração de `Success` ao compartilhar.
