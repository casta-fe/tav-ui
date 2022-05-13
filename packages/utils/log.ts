const NAME = 'TavUI'
export function warn(message: string) {
  console.warn(`[${NAME} warn]:${message}`)
}

export function error(message: string) {
  throw new Error(`[${NAME} error]:${message}`)
}
