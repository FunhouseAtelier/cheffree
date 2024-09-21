const maxWidthClassByContainerSize: {
  [key in ContainerSize]: string
} = {
  '2xs': 'max-w-[300px]',
  xs: 'max-w-[360px]',
  sm: 'max-w-[640px]',
  md: 'max-w-[768px]',
  lg: 'max-w-[1024px]',
  xl: 'max-w-[1280px]',
  '2xl': 'max-w-[1536px]',
  fluid: 'max-w-full',
}

export function Container({
  children,
  tag = 'div',
  size = 'fluid',
  className,
}: {
  children: React.ReactNode
  tag?: ContainerTag
  size?: ContainerSize
  className?: string
}) {
  const maxWidthClass = maxWidthClassByContainerSize[size]
  const Tag = tag
  return (
    <Tag
      className={`mx-auto p-2 break-words ${maxWidthClass}${
        className ? ` ${className}` : ''
      }`}
    >
      {children}
    </Tag>
  )
}

export type ContainerTag =
  | 'article'
  | 'blockquote'
  | 'dialog'
  | 'div'
  | 'figure'
  | 'footer'
  | 'form'
  | 'header'
  | 'main'
  | 'menu'
  | 'nav'
  | 'section'
  | 'table'

export type ContainerSize =
  | 'fluid'
  | '2xs'
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
