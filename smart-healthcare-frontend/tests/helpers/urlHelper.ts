export function urlEndingWith(route: string): RegExp {
  return new RegExp(`${route}$`);
}

export function urlContaining(route: string): RegExp {
  return new RegExp(route);
}
