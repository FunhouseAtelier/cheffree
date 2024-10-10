import logger from '@funhouse-atelier/logger'

const log = logger({ name: '@/app/components/containers.tsx', level: 2 })
log.debug('logger instantiated')

type ContainerTag = 'div' | 'header' | 'main' | 'span'
type BaselineTextSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
type ContainerSize = '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'fluid'
type LeadingOption = 'none' | 'tight' | 'snug' | 'normal' | 'relaxed' | 'loose'

const responsiveTextClassesByBaselineSize: {
  [key in BaselineTextSize]: string
} = {
  'xs': 'text-xs sm:text-sm lg:text-base',
  'sm': 'text-sm sm:text-base lg:text-lg',
  'md': 'text-base sm:text-lg lg:text-xl',
  'lg': 'text-lg sm:text-xl lg:text-2xl',
  'xl': 'text-xl sm:text-2xl lg:text-3xl',
  '2xl': 'text-2xl sm:text-3xl lg:text-4xl',
  '3xl': 'text-3xl sm:text-4xl lg:text-[2.75rem]',
}

const responsiveLeadingClassesByLeadingOption: {
  [key in LeadingOption]: string
} = {
  none: 'leading-none sm:leading-none lg:leading-none',
  tight: 'leading-tight sm:leading-tight lg:leading-tight',
  snug: 'leading-snug sm:leading-snug lg:leading-snug',
  normal: 'leading-normal sm:leading-normal lg:leading-normal',
  relaxed: 'leading-relaxed sm:leading-relaxed lg:leading-relaxed',
  loose: 'leading-loose sm:leading-loose lg:leading-loose',
}

const maxWidthClassByContainerSize: {
  [key in ContainerSize]: string
} = {
  '2xs': 'max-w-[240px]',
  'xs': 'max-w-[360px]',
  'sm': 'max-w-[640px]',
  'md': 'max-w-[768px]',
  'lg': 'max-w-[1024px]',
  'xl': 'max-w-[1280px]',
  '2xl': 'max-w-[1536px]',
  'fluid': 'max-w-full',
}

export const Container = ({
  children,
  Tag = 'div',
  textSize = 'md',
  leading = 'normal',
  containerSize = 'md',
  centered = false,
  flex = false,
  inlineFlex = false,
  column = false,
  center = '',
  className,
}: {
  children: React.ReactNode
  Tag?: ContainerTag
  textSize?: BaselineTextSize
  leading?: LeadingOption
  containerSize?: ContainerSize
  centered?: boolean
  flex?: boolean
  inlineFlex?: boolean
  column?: boolean
  center?: '' | 'x' | 'y' | 'xy' | 'yx'
  className?: string
}) => (
  <Tag
    className={`
      ${responsiveTextClassesByBaselineSize[textSize]}
      ${responsiveLeadingClassesByLeadingOption[leading]}
      ${maxWidthClassByContainerSize[containerSize]}
      ${centered && 'mx-auto'}
      ${flex && 'flex'}
      ${inlineFlex && 'inline-flex'}
      ${column && 'flex-col'}
      ${!column && center.includes('x') && 'justify-center'}
      ${!column && center.includes('y') && 'items-center'}
      ${column && center.includes('x') && 'justify-center'}
      ${column && center.includes('y') && 'items-center'}
      ${className ?? ''}
    `}
  >
    {children}
  </Tag>
)

export const MainContainer = ({
  children,
  size = 'md',
  className,
}: {
  children: React.ReactNode
  size?: ContainerSize
  className?: string
}) => (
  <Container
    Tag="main"
    containerSize={size}
    centered
    className={`
      p-[0.5em] break-words
      ${className ?? ''}
    `}
  >
    {children}
  </Container>
)
