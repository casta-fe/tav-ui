const hexList: string[] = []
for (let i = 0; i <= 15; i++) {
  hexList[i] = i.toString(16)
}

export function buildUUID(): string {
  let uuid = ''
  for (let i = 1; i <= 36; i++) {
    if (i === 9 || i === 14 || i === 19 || i === 24) {
      uuid += '-'
    } else if (i === 15) {
      uuid += 4
    } else if (i === 20) {
      uuid += hexList[(Math.random() * 4) | 8]
    } else {
      uuid += hexList[(Math.random() * 16) | 0]
    }
  }
  return uuid.replace(/-/g, '')
}

let unique = 0
export function buildShortUUID(prefix = ''): string {
  const time = Date.now()
  const random = Math.floor(Math.random() * 1000000000)
  unique++
  return `${prefix}_${random}${unique}${String(time)}`
}

// const urlAlphabet = 'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict'
export const nanoid = (
  e = 21,
  urlAlphabet = 'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict'
) => {
  let t = ''
  const r = crypto.getRandomValues(new Uint8Array(e))
  for (let n = 0; n < e; n++) t += urlAlphabet[63 & r[n]]
  return t
}
