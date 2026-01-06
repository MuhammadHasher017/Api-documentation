import './globals.css'

export const metadata = {
  title: 'PDF Generator App',
  description: 'Dynamic PDF generation from JSON configuration',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
