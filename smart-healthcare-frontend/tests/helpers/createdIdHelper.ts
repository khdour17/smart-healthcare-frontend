export function makeCreatedId(): string {
  return `9${Date.now()}${Math.floor(Math.random() * 100000)}`;
}

export function withCreatedId(value: string, createdId: string): string {
  return `${value}_${createdId}`;
}
