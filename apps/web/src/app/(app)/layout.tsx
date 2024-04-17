import React from 'react'
import './globals.scss'
import { Header } from '@/components/Header'
import { GeistSans } from 'geist/font/sans'

/* Our app sits here to not cause any conflicts with payload's root layout  */
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html className={GeistSans.className}>
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  )
}

export default Layout
