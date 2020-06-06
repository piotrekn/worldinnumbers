export interface Dictionary<T> {
  [Key: string]: T;
}

export interface Entity<T> {
  dictionary: Dictionary<T>;
  keys: T[];
}

export function EMPTY_ENTITY<T>(): Entity<T> {
  return { dictionary: {}, keys: [] };
}
