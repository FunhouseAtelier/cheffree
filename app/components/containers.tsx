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

export const MainContainer = ({
  children,
  size = 'md',
  className,
}: {
  children: React.ReactNode
  size?: ContainerSize
  className?: string
}) => {
  return (
    <main
      className={`
        text-base sm:text-lg lg:text-xl
        leading-relaxed sm:leading-relaxed lg:leading-relaxed
        mx-auto p-[0.5em] break-words
        ${maxWidthClassByContainerSize[size]}
        ${className ?? ''}
      `}
    >
      {children}
    </main>
  )
}

export const Container = ({
  children,
  size = 'fluid',
  className,
}: {
  children: React.ReactNode
  size?: ContainerSize
  className?: string
}) => {
  return (
    <div
      className={`
        mx-auto p-[0.5em] break-words
        ${maxWidthClassByContainerSize[size]}
        ${className ?? ''}
      `}
    >
      {children}
    </div>
  )
}
