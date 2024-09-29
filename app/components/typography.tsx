import logger from '@funhouse-atelier/logger'
import { Link } from '@remix-run/react'

const log = logger({ name: '@/app/components/typography.tsx', level: 2 })

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
type TextBaseSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
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
  xs: 'text-xs sm:text-sm lg:text-base',
  sm: 'text-sm sm:text-base lg:text-lg',
  md: 'text-base sm:text-lg lg:text-xl',
  lg: 'text-lg sm:text-xl lg:text-2xl',
  xl: 'text-xl sm:text-2xl lg:text-3xl',
  '2xl': 'text-2xl sm:text-3xl lg:text-4xl',
  '3xl': 'text-3xl sm:text-4xl lg:text-5xl',
}

export const Heading = ({
  children,
  tag = 'h1',
  size = baseSizeByHeadingTag[tag],
  className,
}: {
  children: React.ReactNode
  tag?: HeadingTag
  size?: TextBaseSize
  className?: string
}) => {
  const Tag = tag
  return (
    <Tag
      className={`
    ${classListByBaseSize[size]}
    leading-relaxed sm:leading-relaxed lg:leading-relaxed
    font-semibold mt-[0.25em] mb-[0.5em]
    ${className ?? ''}
  `}
    >
      {children}
    </Tag>
  )
}

type TextTag =
  | 'blockquote'
  | 'cite'
  | 'code'
  | 'dd'
  | 'dfn'
  | 'div'
  | 'dt'
  | 'em'
  | 'figcaption'
  | 'kbd'
  | 'mark'
  | 'p'
  | 'pre'
  | 'q'
  | 'samp'
  | 'small'
  | 'span'
  | 'strong'
  | 'time'
  | 'var'
export const Text = ({
  children,
  tag = 'span',
  size = 'md',
  className,
}: {
  children: React.ReactNode
  tag?: TextTag
  size?: TextBaseSize
  className?: string
}) => {
  const Tag = tag
  return (
    <Tag
      className={`
        ${classListByBaseSize[size]}
        leading-relaxed sm:leading-relaxed lg:leading-relaxed
        ${tag === 'p' ? 'my-[0.75em]' : ''}
        ${className ?? ''}
      `}
    >
      {children}
    </Tag>
  )
}

export const TextLink = ({
  children,
  to,
  prefetch = 'viewport',
  size = 'md',
  className,
}: {
  children: React.ReactNode
  to: string
  prefetch?: 'none' | 'intent' | 'render' | 'viewport'
  size?: TextBaseSize
  className?: string
}) => {
  return (
    <Link
      to={to}
      prefetch={prefetch}
      className={`
        ${classListByBaseSize[size]}
        leading-relaxed sm:leading-relaxed lg:leading-relaxed
        text-pink-900
        hover:underline active:text-pink-500
        ${className ?? ''}
      `}
    >
      {children}
    </Link>
  )
}

export const TextExternalLink = ({
  children,
  href,
  size = 'md',
  className,
}: {
  children: React.ReactNode
  href: string
  size?: TextBaseSize
  className?: string
}) => {
  return (
    <a
      href={href}
      className={`
        ${classListByBaseSize[size]}
        leading-relaxed sm:leading-relaxed lg:leading-relaxed
        text-pink-900
        hover:underline active:text-pink-500
        ${className ?? ''}
      `}
    >
      {children}
    </a>
  )
}
