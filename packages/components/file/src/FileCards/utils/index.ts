import { castArray as ensureArray } from 'lodash-es'
import { type Arrayable } from '../../utils'
import { type FileCardContext, type FileCardPropKey } from '../../FileCard'

export const filterCards = (cards: FileCardContext[], props: Arrayable<FileCardPropKey>) => {
  const normalized = ensureArray(props)
  return normalized.length > 0
    ? cards.filter((card) => card.prop && normalized.includes(card.prop))
    : cards
}
