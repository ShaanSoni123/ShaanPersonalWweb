import './globals.css'

export const metadata = {
  title: 'Shaan Soni - Interactive Portfolio',
  description: 'An immersive 3D portfolio experience showcasing projects, skills, and personality',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-dark overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}

