export function makeCreatedId(): string {
  return `9${Date.now()}${Math.floor(Math.random() * 100000)}`;
}
