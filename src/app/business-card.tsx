import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";

import type { ActionButtonProps, BusinessCard } from "../types";

const contact: BusinessCard = {
  name: "Tiago Eduardo Zimmermann",
  jobTitle: "Desenvolvedor Mobile",
  phone: "5548999990000",
  email: "tiago@email.com",
  whatsapp: "5548999990000",
  address: "Blumenau, SC",
};

/** Botão reutilizável para as ações do cartão. */
function ActionButton({ label, backgroundColor, onPress }: ActionButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor },
        pressed && styles.pressedButton,
      ]}
    >
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
  );
}

/** Cartão de visita com ações nativas do dispositivo. */
export default function BusinessCardScreen() {
  const initials = contact.name
    .trim()
    .split(/\s+/)
    .map((namePart: string) => namePart.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();

  /** Executa o feedback tátil sem interromper a ação caso falhe. */
  async function triggerImpact(): Promise<void> {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // A ação principal continua mesmo sem feedback tátil.
    }
  }

  /** Executa o feedback tátil de sucesso. */
  async function triggerSuccess(): Promise<void> {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      // A ausência de feedback tátil não altera o compartilhamento.
    }
  }

  /** Abre um endereço externo com tratamento de erro. */
  async function openExternalUrl(
    url: string,
    errorMessage: string,
  ): Promise<void> {
    await triggerImpact();

    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert("Não foi possível abrir", errorMessage);
    }
  }

  /** Abre o aplicativo de telefone. */
  async function handleCall(): Promise<void> {
    const phoneNumber = contact.phone.replace(/\D/g, "");

    await openExternalUrl(
      `tel:+${phoneNumber}`,
      "Verifique se o dispositivo possui um aplicativo de telefone disponível.",
    );
  }

  /** Abre o aplicativo de e-mail com o destinatário preenchido. */
  async function handleSendEmail(): Promise<void> {
    const subject = encodeURIComponent("Contato pelo cartão de visita");

    await openExternalUrl(
      `mailto:${contact.email}?subject=${subject}`,
      "Verifique se existe um aplicativo de e-mail configurado no dispositivo.",
    );
  }

  /** Abre uma conversa no WhatsApp. */
  async function handleOpenWhatsApp(): Promise<void> {
    const phoneNumber = contact.whatsapp.replace(/\D/g, "");

    const message = encodeURIComponent(
      `Olá, ${contact.name}! Vi seu cartão de visita.`,
    );

    await openExternalUrl(
      `https://wa.me/${phoneNumber}?text=${message}`,
      "Não foi possível abrir o WhatsApp. Verifique sua conexão e tente novamente.",
    );
  }

  /** Abre o endereço do contato no Google Maps. */
  async function handleOpenDirections(): Promise<void> {
    const destination = encodeURIComponent(contact.address);

    await openExternalUrl(
      `https://www.google.com/maps/dir/?api=1&destination=${destination}`,
      "Não foi possível abrir o endereço no mapa. Tente novamente.",
    );
  }

  /** Compartilha os dados do cartão pela interface do sistema. */
  async function handleShareContact(): Promise<void> {
    await triggerImpact();

    const message = [
      contact.name,
      contact.jobTitle,
      "",
      `Telefone: +${contact.phone}`,
      `E-mail: ${contact.email}`,
      `WhatsApp: https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`,
      `Endereço: ${contact.address}`,
    ].join("\n");

    try {
      const result = await Share.share({
        title: `Cartão de visita - ${contact.name}`,
        message,
      });

      if (result.action === Share.sharedAction) {
        await triggerSuccess();
      }
    } catch {
      Alert.alert(
        "Não foi possível compartilhar",
        "Tente compartilhar o cartão novamente.",
      );
    }
  }

  /** Abre o exercício de localização. */
  async function handleOpenLocation(): Promise<void> {
    await triggerImpact();
    router.push("/location");
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>

        <Text style={styles.name}>{contact.name}</Text>

        <Text style={styles.jobTitle}>{contact.jobTitle}</Text>

        <View style={styles.contactContainer}>
          <Text style={styles.contactText}>{contact.email}</Text>
          <Text style={styles.contactText}>{contact.address}</Text>
        </View>

        <View style={styles.actionsContainer}>
          <ActionButton
            label="LIGAR"
            backgroundColor="#527D2C"
            onPress={handleCall}
          />

          <ActionButton
            label="MANDAR E-MAIL"
            backgroundColor="#252B2F"
            onPress={handleSendEmail}
          />

          <ActionButton
            label="WHATSAPP"
            backgroundColor="#239B56"
            onPress={handleOpenWhatsApp}
          />

          <ActionButton
            label="COMPARTILHAR CARTÃO"
            backgroundColor="#3296EB"
            onPress={handleShareContact}
          />

          <ActionButton
            label="COMO CHEGAR"
            backgroundColor="#707780"
            onPress={handleOpenDirections}
          />
        </View>

        <View style={styles.divider} />

        <Text style={styles.locationDescription}>
          Quer descobrir sua posição atual?
        </Text>

        <Pressable
          accessibilityRole="button"
          onPress={handleOpenLocation}
          style={({ pressed }) => [
            styles.locationButton,
            pressed && styles.pressedButton,
          ]}
        >
          <Text style={styles.locationButtonText}>ONDE ESTOU?</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 32,
    backgroundColor: "#F4F6F1",
  },
  card: {
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5EADD",
    backgroundColor: "#FFFFFF",
  },
  avatar: {
    width: 80,
    height: 80,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    borderRadius: 40,
    backgroundColor: "#EEF4E7",
  },
  avatarText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#527D2C",
  },
  name: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    color: "#252B2F",
  },
  jobTitle: {
    marginTop: 8,
    fontSize: 16,
    textAlign: "center",
    color: "#747B80",
  },
  contactContainer: {
    gap: 6,
    marginTop: 18,
    marginBottom: 28,
  },
  contactText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    color: "#747B80",
  },
  actionsContainer: {
    gap: 12,
  },
  button: {
    minHeight: 50,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 10,
  },
  pressedButton: {
    opacity: 0.8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
    color: "#FFFFFF",
  },
  divider: {
    height: 1,
    marginVertical: 24,
    backgroundColor: "#E5EADD",
  },
  locationDescription: {
    marginBottom: 12,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    color: "#747B80",
  },
  locationButton: {
    minHeight: 50,
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    borderWidth: 1,
    borderColor: "#527D2C",
    borderRadius: 10,
    backgroundColor: "#EEF4E7",
  },
  locationButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#527D2C",
  },
});
