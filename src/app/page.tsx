'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface App {
  slug: string
  displayName: string
  description: string
  category: string
  mvpFeatures: string[]
  techStack: string[]
  githubUrl: string
  liveUrl: string
}

export default function Home() {
  const [apps, setApps] = useState<App[]>([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const response = await fetch('/apps_manifest.json')
        const data = await response.json()
        setApps(data.apps)
      } catch (error) {
        console.error('Failed to fetch apps:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchApps()
  }, [])

  const categories = ['All', ...Array.from(new Set(apps.map(app => app.category)))]
  const filteredApps = selectedCategory === 'All' 
    ? apps 
    : apps.filter(app => app.category === selectedCategory)

  const getCategoryColor = (category: string) => {
    const colors = {
      'Personal': 'bg-purple-100 text-purple-800',
      'Business': 'bg-blue-100 text-blue-800', 
      'Finance': 'bg-green-100 text-green-800',
      'AI/Tech': 'bg-orange-100 text-orange-800',
      'Faith': 'bg-yellow-100 text-yellow-800',
      'Games': 'bg-pink-100 text-pink-800'
    }
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading EmmanuelOS Dashboard...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            EmmanuelOS Dashboard
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Dynamic dashboard showcasing {apps.length} apps across the EmmanuelOS ecosystem
          </p>
          
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Apps Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredApps.map((app, index) => (
            <motion.div
              key={app.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                  {app.displayName}
                </h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(app.category)}`}>
                  {app.category}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {app.description}
              </p>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Key Features:</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  {app.mvpFeatures.slice(0, 3).map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <span className="w-1 h-1 bg-blue-600 rounded-full mr-2"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex gap-2">
                <a
                  href={app.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-3 rounded-md text-center transition-colors"
                >
                  View Live
                </a>
                <a
                  href={app.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 border border-gray-300 hover:border-gray-400 text-gray-700 text-sm py-2 px-3 rounded-md text-center transition-colors"
                >
                  GitHub
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredApps.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No apps found in this category.</p>
          </div>
        )}
      </div>
    </main>
  )
}
