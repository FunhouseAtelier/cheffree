import logger from '@funhouse-atelier/logger'
import { Link } from '@remix-run/react'

const log = logger({ name: '@/app/components/typography.tsx', level: 2 })

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
type BaselineSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
type LeadingOption = 'none' | 'tight' | 'snug' | 'normal' | 'relaxed' | 'loose'

const baselineSizeByHeadingTag: {
  [key in HeadingTag]: BaselineSize
} = {
  h1: '3xl',
  h2: '2xl',
  h3: 'xl',
  h4: 'lg',
  h5: 'md',
  h6: 'sm',
}

const responsiveTextClassesByBaselineSize: {
  [key in BaselineSize]: string
} = {
  'xs': 'text-xs sm:text-sm lg:text-base',
  'sm': 'text-sm sm:text-base lg:text-lg',
  'md': 'text-base sm:text-lg lg:text-xl',
  'lg': 'text-lg sm:text-xl lg:text-2xl',
  'xl': 'text-xl sm:text-2xl lg:text-3xl',
  '2xl': 'text-2xl sm:text-3xl lg:text-4xl',
  '3xl': 'text-3xl sm:text-4xl lg:text-5xl',
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

export const Heading = ({
  children,
  Tag = 'h1',
  size = baselineSizeByHeadingTag[Tag],
  leading = 'normal',
  className,
}: {
  children: React.ReactNode
  Tag?: HeadingTag
  size?: BaselineSize
  leading?: LeadingOption
  className?: string
}) => (
  <Tag
    className={`
      ${responsiveTextClassesByBaselineSize[size]}
      ${responsiveLeadingClassesByLeadingOption[leading]}
      font-semibold
      ${className ?? ''}
    `}
  >
    {children}
  </Tag>
)

type TextTag = 'label' | 'span' | 'p'

export const Text = ({
  children,
  Tag = 'span',
  size = 'md',
  leading = 'normal',
  htmlFor,
  className,
}: {
  children: React.ReactNode
  Tag?: TextTag
  size?: BaselineSize
  leading?: LeadingOption
  htmlFor?: string
  className?: string
}) => (
  <Tag
    htmlFor={htmlFor}
    className={`
      ${responsiveTextClassesByBaselineSize[size]}
      ${responsiveLeadingClassesByLeadingOption[leading]}
      ${Tag === 'p' ? 'my-[0.75em]' : ''}
      ${className ?? ''}
    `}
  >
    {children}
  </Tag>
)

export const FieldError = ({
  children,
  size = 'sm',
}: {
  children: React.ReactNode
  size?: BaselineSize
}) => (
  <Text
    size={size}
    className="font-semibold text-red-700"
  >
    {children}
  </Text>
)

export const FieldLabel = ({
  children,
  htmlFor,
  size = 'sm',
}: {
  children: React.ReactNode
  htmlFor: string
  size?: BaselineSize
}) => (
  <Text
    Tag="label"
    htmlFor={htmlFor}
    size={size}
    className="font-bold"
  >
    {children}
  </Text>
)

/*  */

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
  size?: BaselineSize
  className?: string
}) => {
  return (
    <Link
      to={to}
      prefetch={prefetch}
      className={`
        ${responsiveTextClassesByBaselineSize[size]}
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
  size?: BaselineSize
  className?: string
}) => {
  return (
    <a
      href={href}
      className={`
        ${responsiveTextClassesByBaselineSize[size]}
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
