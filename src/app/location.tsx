import * as Location from "expo-location";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Linking,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import type { LocationInfoProps, UserLocation } from "../types";

/** Exibe uma informação da localização. */
function LocationInfo({ label, value }: LocationInfoProps) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

/** Permite consultar a posição atual e abrir as coordenadas no mapa. */
export default function LocationScreen() {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const [isPermissionDenied, setIsPermissionDenied] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [addressError, setAddressError] = useState<string | null>(null);

  /** Solicita a permissão e consulta a localização atual. */
  async function handleGetLocation(): Promise<void> {
    setIsLoading(true);
    setError(null);
    setAddressError(null);
    setIsPermissionDenied(false);
    setUserLocation(null);

    try {
      const permission = await Location.requestForegroundPermissionsAsync();

      if (permission.status !== "granted") {
        setIsPermissionDenied(true);
        return;
      }

      const isLocationEnabled = await Location.hasServicesEnabledAsync();

      if (!isLocationEnabled) {
        setError(
          "A localização do dispositivo está desativada. Ative-a e tente novamente.",
        );
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const currentLocation: UserLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        city: null,
        state: null,
      };

      // Preserva as coordenadas mesmo se a consulta do endereço falhar.
      setUserLocation(currentLocation);

      try {
        const [address] = await Location.reverseGeocodeAsync({
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
        });

        setUserLocation({
          ...currentLocation,
          city: address?.city ?? address?.subregion ?? null,
          state: address?.region ?? null,
        });

        if (!address) {
          setAddressError(
            "A posição foi encontrada, mas o endereço não está disponível.",
          );
        }
      } catch {
        setAddressError(
          "A posição foi encontrada, mas não foi possível consultar a cidade e o estado.",
        );
      }
    } catch {
      setError(
        "Não foi possível obter sua localização. Verifique o GPS e tente novamente.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  /** Abre as configurações do aplicativo. */
  async function handleOpenSettings(): Promise<void> {
    try {
      await Linking.openSettings();
    } catch {
      Alert.alert(
        "Não foi possível abrir",
        "Abra as configurações do dispositivo e permita o acesso à localização.",
      );
    }
  }

  /** Abre a posição encontrada no Google Maps. */
  async function handleOpenMap(): Promise<void> {
    if (!userLocation) {
      return;
    }

    const coordinates = encodeURIComponent(
      `${userLocation.latitude},${userLocation.longitude}`,
    );

    try {
      await Linking.openURL(
        `https://www.google.com/maps/search/?api=1&query=${coordinates}`,
      );
    } catch {
      Alert.alert(
        "Não foi possível abrir o mapa",
        "Tente novamente em alguns instantes.",
      );
    }
  }

  const locationTitle = userLocation
    ? [userLocation.city, userLocation.state].filter(Boolean).join(" - ") ||
      "Endereço não disponível"
    : "";

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Onde estou?</Text>

        <Text style={styles.description}>
          Descubra sua posição atual e visualize no mapa.
        </Text>

        <Pressable
          accessibilityRole="button"
          disabled={isLoading}
          onPress={handleGetLocation}
          style={({ pressed }) => [
            styles.button,
            styles.primaryButton,
            isLoading && styles.disabledButton,
            pressed && styles.pressedButton,
          ]}
        >
          <Text style={styles.buttonText}>
            {isLoading
              ? "BUSCANDO POSIÇÃO..."
              : userLocation
                ? "ATUALIZAR POSIÇÃO"
                : "DESCOBRIR MINHA POSIÇÃO"}
          </Text>
        </Pressable>

        {isLoading ? (
          <View
            style={styles.feedbackContainer}
            accessibilityLiveRegion="polite"
          >
            <ActivityIndicator size="large" color="#527D2C" />

            <Text style={styles.feedbackText}>Buscando sua localização...</Text>
          </View>
        ) : isPermissionDenied ? (
          <View style={styles.permissionContainer}>
            <Text style={styles.permissionTitle}>Permissão necessária</Text>

            <Text style={styles.permissionDescription}>
              Permita o acesso à localização nas configurações do aplicativo.
              Depois, volte e toque em descobrir minha posição.
            </Text>

            <Pressable
              accessibilityRole="button"
              onPress={handleOpenSettings}
              style={({ pressed }) => [
                styles.button,
                styles.secondaryButton,
                pressed && styles.pressedButton,
              ]}
            >
              <Text style={styles.buttonText}>ABRIR CONFIGURAÇÕES</Text>
            </Pressable>
          </View>
        ) : error ? (
          <View style={styles.errorContainer} accessibilityLiveRegion="polite">
            <Text style={styles.errorTitle}>Não foi possível localizar</Text>

            <Text style={styles.errorText}>{error}</Text>

            <Pressable
              accessibilityRole="button"
              onPress={handleGetLocation}
              style={({ pressed }) => [
                styles.button,
                styles.secondaryButton,
                pressed && styles.pressedButton,
              ]}
            >
              <Text style={styles.buttonText}>TENTAR NOVAMENTE</Text>
            </Pressable>
          </View>
        ) : userLocation ? (
          <View style={styles.locationContainer}>
            <Text style={styles.city}>{locationTitle}</Text>

            <View style={styles.infoContainer}>
              <LocationInfo
                label="Latitude"
                value={userLocation.latitude.toFixed(5)}
              />

              <LocationInfo
                label="Longitude"
                value={userLocation.longitude.toFixed(5)}
              />
            </View>

            <Text style={styles.accuracy}>
              {userLocation.accuracy !== null
                ? `Precisão: aproximadamente ${Math.round(
                    userLocation.accuracy,
                  )} metros`
                : "Precisão não disponível"}
            </Text>

            {addressError ? (
              <Text style={styles.warningText}>{addressError}</Text>
            ) : null}

            <Pressable
              accessibilityRole="button"
              onPress={handleOpenMap}
              style={({ pressed }) => [
                styles.button,
                styles.secondaryButton,
                pressed && styles.pressedButton,
              ]}
            >
              <Text style={styles.buttonText}>VER NO MAPA</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.feedbackContainer}>
            <Text style={styles.feedbackText}>
              Toque no botão acima para descobrir sua posição.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
  title: {
    marginBottom: 8,
    fontSize: 28,
    fontWeight: "700",
    color: "#252B2F",
  },
  description: {
    marginBottom: 24,
    fontSize: 15,
    lineHeight: 22,
    color: "#747B80",
  },
  button: {
    minHeight: 50,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 10,
  },
  primaryButton: {
    backgroundColor: "#527D2C",
  },
  secondaryButton: {
    backgroundColor: "#252B2F",
  },
  disabledButton: {
    opacity: 0.6,
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
  locationContainer: {
    marginTop: 24,
  },
  city: {
    marginBottom: 16,
    fontSize: 18,
    fontWeight: "500",
    color: "#252B2F",
  },
  infoContainer: {
    gap: 10,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderRadius: 10,
    backgroundColor: "#EEF4E7",
  },
  infoLabel: {
    fontSize: 16,
    color: "#343B3E",
  },
  infoValue: {
    flexShrink: 1,
    fontSize: 17,
    fontWeight: "700",
    textAlign: "right",
    color: "#527D2C",
  },
  accuracy: {
    marginTop: 18,
    marginBottom: 20,
    fontSize: 14,
    lineHeight: 20,
    color: "#747B80",
  },
  feedbackContainer: {
    alignItems: "center",
    gap: 16,
    paddingVertical: 32,
  },
  feedbackText: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    color: "#747B80",
  },
  permissionContainer: {
    marginTop: 24,
    padding: 18,
    borderRadius: 12,
    backgroundColor: "#FFF4E8",
  },
  permissionTitle: {
    marginBottom: 8,
    fontSize: 18,
    fontWeight: "700",
    color: "#8A531B",
  },
  permissionDescription: {
    marginBottom: 18,
    fontSize: 14,
    lineHeight: 22,
    color: "#795B3C",
  },
  errorContainer: {
    marginTop: 24,
    padding: 18,
    borderRadius: 12,
    backgroundColor: "#FFF0F0",
  },
  errorTitle: {
    marginBottom: 8,
    fontSize: 18,
    fontWeight: "700",
    color: "#A83232",
  },
  errorText: {
    marginBottom: 18,
    fontSize: 14,
    lineHeight: 22,
    color: "#8A4141",
  },
  warningText: {
    marginBottom: 18,
    fontSize: 14,
    lineHeight: 21,
    color: "#8A531B",
  },
});
