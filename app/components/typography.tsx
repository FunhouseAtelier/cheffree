const baseSizeByHeadingTag: {
  [key in HeadingTag]: TextBaseSize
} = {
  h1: '3xl',
  h2: '2xl',
  h3: 'xl',
  h4: 'lg',
  h5: 'md',
  h6: 'sm',
}

const classListByBaseSize: {
  [key in TextBaseSize]: string
} = {
  xs: 'text-xs sm:text-sm lg:text-base 2xl:text-lg',
  sm: 'text-sm sm:text-base lg:text-lg 2xl:text-xl',
  md: 'text-base sm:text-lg lg:text-xl 2xl:text-2xl',
  lg: 'text-lg sm:text-xl lg:text-2xl 2xl:text-3xl',
  xl: 'text-xl sm:text-2xl lg:text-3xl 2xl:text-4xl',
  '2xl': 'text-2xl sm:text-3xl lg:text-4xl 2xl:text-5xl',
  '3xl': 'text-3xl sm:text-4xl lg:text-5xl 2xl:text-6xl',
}

export function Typography({
  props,
}: {
  props: {
    children: React.ReactNode
    tag: HeadingTag | TextTag
    size: TextBaseSize
    className?: string
  }
}) {
  const { children, tag, size, className } = props
  const responsiveTextClassList = classListByBaseSize[size]
  const classList = `${
    tag in baseSizeByHeadingTag && 'font-semibold'
  } ${responsiveTextClassList} ${className}`
  const Tag = tag
  return <Tag className={classList}>{children}</Tag>
}

export function Heading({
  children,
  tag = 'h1',
  size = baseSizeByHeadingTag[tag],
  className,
}: {
  children: React.ReactNode
  tag?: HeadingTag
  size?: TextBaseSize
  className?: string
}) {
  return <Typography props={{ children, tag, size, className }} />
}

export function Text({
  children,
  tag = 'span',
  size = 'sm',
  className,
}: {
  children: React.ReactNode
  tag?: TextTag
  size?: TextBaseSize
  className?: string
}) {
  return <Typography props={{ children, tag, size, className }} />
}

export type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
export type TextBaseSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
export type TextTag =
  | 'blockquote'
  | 'cite'
  | 'code'
  | 'dd'
  | 'dfn'
  | 'div'
  | 'dt'
  | 'figcaption'
  | 'kbd'
  | 'mark'
  | 'p'
  | 'pre'
  | 'q'
  | 'samp'
  | 'small'
  | 'span'
  | 'time'
  | 'var'
