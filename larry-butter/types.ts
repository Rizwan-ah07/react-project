// types.ts

export interface Character {
  id: string;
  name: string;
  house: string;
  image?: string;
  actor?: string;
  ancestry?: string;
  patronus?: string;
}

export interface Spell {
  id: string;
  name: string;
  type?: string;
  difficulty?: string;
  description?: string;
}
