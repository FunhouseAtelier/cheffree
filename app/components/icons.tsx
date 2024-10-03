import type { IconProp, SizeProp } from '@fortawesome/fontawesome-svg-core'

import logger from '@funhouse-atelier/logger'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faKitchenSet,
  faGear,
  faXmark,
  faCheck,
  faFilePen,
} from '@fortawesome/free-solid-svg-icons'

const log = logger({ name: '@app/components/icons.tsx', level: 2 })

const makeSvgIconComponent = (iconProp: IconProp) => {
  return ({ size = '1x' }: { size?: SizeProp }) => (
    <FontAwesomeIcon icon={iconProp} size={size} />
  )
}

export const KitchenSetIcon = makeSvgIconComponent(faKitchenSet)
export const GearIcon = makeSvgIconComponent(faGear)
export const XmarkIcon = makeSvgIconComponent(faXmark)
export const CheckIcon = makeSvgIconComponent(faCheck)
export const EditDocumentIcon = makeSvgIconComponent(faFilePen)
