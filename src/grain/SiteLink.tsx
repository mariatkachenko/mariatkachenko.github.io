import type { AnchorHTMLAttributes, MouseEvent } from 'react'
import { navigate, type RoutePath } from '../router'

export default function SiteLink({ href, onClick, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: RoutePath }) {
  return <a href={href} {...props} onClick={(event: MouseEvent<HTMLAnchorElement>) => { event.preventDefault(); onClick?.(event); navigate(href) }} />
}
