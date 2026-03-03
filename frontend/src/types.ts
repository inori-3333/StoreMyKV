export interface BaseEntry {
  id: string;
  notes?: string;
}

export interface PasswordEntry extends BaseEntry {
  url: string;
  username: string;
  password: string;
}

export interface ApiKeyEntry extends BaseEntry {
  platform: string;
  keyName: string;
  keyValue: string;
}

export interface AppData {
  passwords: PasswordEntry[];
  apiKeys: ApiKeyEntry[];
}
