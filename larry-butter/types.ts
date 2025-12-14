export interface Character {
  id: string;
  name: string;
  house: string;
  role?: string;
  description?: string;
  image?: string;
}

export interface Spell {
  id: string;
  name: string;
  type?: string;
  difficulty?: string;
  description?: string;
}

export interface DbFavouriteCharacterRow {
  device_id: string;
  character_id: string;
  name: string;
  house: string | null;
  image: string | null;
}
