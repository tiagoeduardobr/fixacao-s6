/** Dados usados no cartão de visita. */
export type BusinessCard = {
  name: string;
  jobTitle: string;
  phone: string;
  email: string;
  whatsapp: string;
  address: string;
};

/** Propriedades dos botões do cartão de visita. */
export type ActionButtonProps = {
  label: string;
  backgroundColor: string;
  onPress?: () => void;
};

/** Dados de localização exibidos na tela. */
export type UserLocation = {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  city: string | null;
  state: string | null;
};

/** Propriedades de uma linha de informação da localização. */
export type LocationInfoProps = {
  label: string;
  value: string;
};

/** Propriedades dos cartões de acesso aos exercícios. */
export type ExerciseCardProps = {
  number: string;
  title: string;
  description: string;
  technologies: string;
  onPress: () => void;
};