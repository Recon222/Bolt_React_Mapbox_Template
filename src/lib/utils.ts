export function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

export const mapTransition = {
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
}
