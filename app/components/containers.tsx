import logger from '@funhouse-atelier/logger'

const log = logger({ name: '@/app/components/containers.tsx', level: 2 })

type ContainerSize = 'fluid' | '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
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

type ContainerTag =
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
export function Container({
  children,
  tag = 'div',
  size = 'fluid',
  center,
  className,
}: {
  children: React.ReactNode
  tag?: ContainerTag
  size?: ContainerSize
  center?: 'x' | 'y' | 'xy'
  className?: string
}) {
  const maxWidthClass = maxWidthClassByContainerSize[size]
  const flexboxClassList = center
    ? ` flex${center.includes('x') ? ' justify-center' : ''}${
        center.includes('y') ? ' items-center' : ''
      }`
    : ''
  const Tag = tag
  return (
    <Tag
      className={`mx-auto py-1 sm:py-1.5 lg:py-2 px-2 sm:px-3 lg:px-4 break-words ${maxWidthClass}${flexboxClassList}${
        className ? ` ${className}` : ''
      }`}
    >
      {children}
    </Tag>
  )
}
