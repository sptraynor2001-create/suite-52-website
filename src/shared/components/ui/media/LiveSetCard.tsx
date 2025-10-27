import { ReactNode } from 'react'

interface LiveSetCardProps {
  title: string
  children: ReactNode
}

function LiveSetCard({ title, children }: LiveSetCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md py-4 sm:py-6 px-0" style={{ width: '100%' }}>
      <h2 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center px-4 sm:px-6">
        {title}
      </h2>
      <div className="px-4 sm:px-6">
        {children}
      </div>
    </div>
  )
}

export default LiveSetCard
