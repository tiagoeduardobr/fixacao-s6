import { router } from 'expo-router';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import type { ExerciseCardProps } from '../types';

/** Cartão de acesso a um exercício. */
function ExerciseCard({
  number,
  title,
  description,
  technologies,
  onPress,
}: ExerciseCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Abrir exercício ${number}: ${title}`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.exerciseCard,
        pressed && styles.pressedCard,
      ]}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.exerciseNumber}>EXERCÍCIO {number}</Text>
        <Text style={styles.arrow}>→</Text>
      </View>

      <Text style={styles.exerciseTitle}>{title}</Text>

      <Text style={styles.exerciseDescription}>{description}</Text>

      <View style={styles.technologiesContainer}>
        <Text style={styles.technologiesText}>{technologies}</Text>
      </View>

      <Text style={styles.openText}>Abrir exercício</Text>
    </Pressable>
  );
}

/** Menu inicial com acesso aos dois exercícios. */
export default function HomeScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.subtitle}>PRÁTICA COM EXPO</Text>

          <Text style={styles.title}>Recursos nativos</Text>

          <Text style={styles.description}>
            Escolha um exercício para explorar os recursos do dispositivo.
          </Text>
        </View>

        <View style={styles.exerciseList}>
          <ExerciseCard
            number="01"
            title="Cartão de visita"
            description="Acesse os contatos, compartilhe o cartão e veja como chegar."
            technologies="Haptics · Share · Linking"
            onPress={() => router.push('/business-card')}
          />

          <ExerciseCard
            number="02"
            title="Onde estou?"
            description="Descubra sua posição, consulte as coordenadas e visualize no mapa."
            technologies="Location · Linking"
            onPress={() => router.push('/location')}
          />
        </View>

        <Text style={styles.footer}>
          Desenvolvimento mobile com React Native e TypeScript
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 32,
    backgroundColor: '#F4F6F1',
  },
  content: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
  header: {
    marginBottom: 28,
  },
  subtitle: {
    marginBottom: 10,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: '#527D2C',
  },
  title: {
    marginBottom: 12,
    fontSize: 32,
    fontWeight: '700',
    color: '#252B2F',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#747B80',
  },
  exerciseList: {
    gap: 18,
  },
  exerciseCard: {
    padding: 24,
    borderWidth: 1,
    borderColor: '#E0E7D8',
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
  },
  pressedCard: {
    opacity: 0.8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  exerciseNumber: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#527D2C',
  },
  arrow: {
    fontSize: 26,
    color: '#527D2C',
  },
  exerciseTitle: {
    marginBottom: 10,
    fontSize: 23,
    fontWeight: '700',
    color: '#252B2F',
  },
  exerciseDescription: {
    marginBottom: 18,
    fontSize: 15,
    lineHeight: 23,
    color: '#747B80',
  },
  technologiesContainer: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#EEF4E7',
  },
  technologiesText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#527D2C',
  },
  openText: {
    marginTop: 22,
    fontSize: 14,
    fontWeight: '700',
    color: '#527D2C',
  },
  footer: {
    marginTop: 28,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    color: '#747B80',
  },
});