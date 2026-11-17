import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#527D2C',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: '700',
        },
        contentStyle: {
          backgroundColor: '#F4F6F1',
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Exercícios',
        }}
      />

      <Stack.Screen
        name="business-card"
        options={{
          title: 'Cartão de visita',
        }}
      />

      <Stack.Screen
        name="location"
        options={{
          title: 'Onde estou?',
        }}
      />
    </Stack>
  );
}