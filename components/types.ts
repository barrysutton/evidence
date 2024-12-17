// types.ts
export interface TokenMapping {
  [imageId: string]: number | null;  // null represents unminted tokens
}

export interface SecretPhrase {
  id: string;
  text: string;
}

export interface SecretPhrasesData {
  secret_phrases: SecretPhrase[];
}