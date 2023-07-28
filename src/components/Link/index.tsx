import React from 'react'
import styled from 'styled-components'
import { ExternalLink as LinkIconFeather } from 'react-feather'

const StyledLink = styled.a`
  text-decoration: none;
  color: ${({ theme }) => theme.textPrimary};
  font-weight: 500;

  :hover {
    cursor: pointer;
    color: ${({ theme }) => theme.textSecondary};
  }
  :focus {
    outline: none;
    text-decoration: underline;
  }
  :active {
    text-decoration: none;
  }
`

const LinkIconWrapper = styled.a`
  text-decoration: none;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  display: flex;
  :hover {
    text-decoration: none;
    opacity: 0.7;
  }
  :focus {
    outline: none;
    text-decoration: none;
  }
  :active {
    text-decoration: none;
  }
`

const LinkIcon = styled(LinkIconFeather)`
  height: 16px;
  width: 18px;
  margin-left: 10px;
  stroke: ${({ theme }) => theme.accentCritical};
`

export function ExternalLink({
  href = '#',
  target = '_blank',
  rel = 'noopener noreferrer',
  children,
  ...rest
}: {
  href: string
  target?: string
  rel?: string
  children?: React.ReactNode
  [x: string]: any
}) {
  return (
    <StyledLink href={href} target={target} rel={rel} {...rest}>
      {children}
    </StyledLink>
  )
}

export function ExternalLinkIcon({
  href,
  target = '_blank',
  rel = 'noopener noreferrer',
  ...rest
}: {
  href: string
  target?: string
  rel?: string
  [x: string]: any
}) {
  return (
    <LinkIconWrapper target={target} rel={rel} href={href} {...rest}>
      <LinkIcon />
    </LinkIconWrapper>
  )
}
