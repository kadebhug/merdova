import './globals.css'
import ScrollManager from '@/src/components/Layout/ScrollManager'

export const metadata = {
  title: 'Merdova',
  description: 'Merdova - Your trusted development partner',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/vite.svg" />
      </head>
      <body>
        <ScrollManager>
          {children}
        </ScrollManager>
      </body>
    </html>
  )
}

