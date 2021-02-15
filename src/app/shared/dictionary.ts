export interface Dictionary<T> {
  [Key: string]: T;
}

export interface Entity<T> {
  dictionary: Dictionary<T>;
  keys: string[];
}

/* eslint-disable */
export function EMPTY_ENTITY<T>(): Entity<T> {
  return { dictionary: {}, keys: [] };
}
/* eslint-enable */
