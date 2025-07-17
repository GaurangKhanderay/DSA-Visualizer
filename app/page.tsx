"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  BarChart3,
  Search,
  TreePine,
  Network,
  SquareStackIcon as Stack,
  ArrowRight,
  Play,
  BookOpen,
  Sparkles,
  Users,
  Award,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"

const algorithmCategories = [
  {
    id: "sorting",
    title: "Sorting Algorithms",
    description: "Master bubble, quick, merge, insertion, and selection sort with interactive visualizations",
    icon: BarChart3,
    algorithms: ["Bubble Sort", "Quick Sort", "Merge Sort", "Insertion Sort", "Selection Sort"],
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    textColor: "text-blue-600",
    href: "/sorting",
    completed: true,
  },
  {
    id: "searching",
    title: "Search Algorithms",
    description: "Explore linear and binary search with step-by-step execution tracking",
    icon: Search,
    algorithms: ["Linear Search", "Binary Search", "Jump Search"],
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50",
    textColor: "text-green-600",
    href: "/searching",
    completed: true,
  },
  {
    id: "trees",
    title: "Tree Algorithms",
    description: "Navigate binary trees with BFS, DFS, and traversal method visualizations",
    icon: TreePine,
    algorithms: ["Binary Tree", "BST Operations", "Tree Traversals", "AVL Tree"],
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
    textColor: "text-purple-600",
    href: "/trees",
    completed: true,
  },
  {
    id: "graphs",
    title: "Graph Algorithms",
    description: "Discover pathfinding algorithms and graph traversal techniques",
    icon: Network,
    algorithms: ["BFS", "DFS", "Dijkstra's Algorithm", "A* Pathfinding"],
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-50",
    textColor: "text-orange-600",
    href: "/graphs",
    completed: true,
  },
  {
    id: "stacks-queues",
    title: "Stacks & Queues",
    description: "Learn LIFO and FIFO data structures with interactive operations",
    icon: Stack,
    algorithms: ["Stack Operations", "Queue Operations", "Priority Queue", "Deque"],
    color: "from-red-500 to-red-600",
    bgColor: "bg-red-50",
    textColor: "text-red-600",
    href: "/stacks-queues",
    completed: true,
  },
]

const features = [
  {
    icon: Play,
    title: "Interactive Controls",
    description: "Play, pause, step through, and control the speed of algorithm execution with precision",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    icon: BarChart3,
    title: "Real-time Visualization",
    description: "Watch data structures transform with smooth 60fps animations and visual feedback",
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    icon: BookOpen,
    title: "Educational Content",
    description: "Learn with detailed explanations, complexity analysis, and synchronized code examples",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
]

const stats = [
  { label: "Algorithms", value: "20+", icon: Sparkles },
  { label: "Data Structures", value: "8", icon: TreePine },
  { label: "Interactive Demos", value: "15", icon: Play },
  { label: "Learning Modules", value: "5", icon: BookOpen },
]

export default function HomePage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  DSA Visualizer Pro
                </h1>
                <p className="text-sm text-gray-600">Interactive Algorithm Learning Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="hidden sm:flex items-center space-x-1">
                <BookOpen className="w-3 h-3" />
                <span>Educational</span>
              </Badge>
              <Badge variant="outline" className="hidden sm:flex items-center space-x-1">
                <Play className="w-3 h-3" />
                <span>Interactive</span>
              </Badge>
              <Badge className="hidden sm:flex items-center space-x-1 bg-gradient-to-r from-blue-500 to-purple-600">
                <Sparkles className="w-3 h-3" />
                <span>Pro</span>
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full px-4 py-2 mb-6">
            <Award className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Complete DSA Learning Platform</span>
          </div>

          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Master Algorithms Through
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 block mt-2">
              Interactive Visualization
            </span>
          </h2>

          <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
            Transform abstract algorithm logic into dynamic, real-time visual representations. Step through operations
            and understand how code executes frame-by-frame with our comprehensive educational platform.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              )
            })}
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center space-x-2 bg-white rounded-full px-6 py-3 shadow-md border">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">Real-time Visualization</span>
            </div>
            <div className="flex items-center space-x-2 bg-white rounded-full px-6 py-3 shadow-md border">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">Step-by-step Execution</span>
            </div>
            <div className="flex items-center space-x-2 bg-white rounded-full px-6 py-3 shadow-md border">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">Interactive Learning</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sorting">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Learning
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-3 rounded-xl border-2 hover:bg-gray-50 transition-all duration-300 bg-transparent"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              View Documentation
            </Button>
          </div>
        </div>

        {/* Algorithm Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {algorithmCategories.map((category) => {
            const Icon = category.icon
            return (
              <Card
                key={category.id}
                className={`group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-0 shadow-lg ${
                  hoveredCard === category.id ? "ring-2 ring-blue-500 ring-opacity-50 shadow-2xl" : ""
                }`}
                onMouseEnter={() => setHoveredCard(category.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-14 h-14 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg`}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex items-center space-x-2">
                      {category.completed && (
                        <Badge className="bg-green-100 text-green-700 border-green-200">
                          <Award className="w-3 h-3 mr-1" />
                          Complete
                        </Badge>
                      )}
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                  </div>
                  <CardTitle className="text-xl group-hover:text-blue-600 transition-colors duration-300 mb-2">
                    {category.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed">{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {category.algorithms.slice(0, 3).map((algorithm) => (
                      <Badge key={algorithm} variant="secondary" className="text-xs px-3 py-1">
                        {algorithm}
                      </Badge>
                    ))}
                    {category.algorithms.length > 3 && (
                      <Badge variant="outline" className="text-xs px-3 py-1">
                        +{category.algorithms.length - 3} more
                      </Badge>
                    )}
                  </div>
                  <Link href={category.href}>
                    <Button className="w-full group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300 rounded-lg">
                      Explore Algorithms
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="text-center group">
                <div
                  className={`w-20 h-20 ${feature.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                  <Icon className={`w-10 h-10 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-3xl p-12 text-center text-white shadow-2xl">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-3xl font-bold mb-4">Ready to Master Data Structures & Algorithms?</h3>
            <p className="text-xl mb-8 text-blue-100">
              Join thousands of students and professionals who have improved their programming skills with our
              interactive visualizations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sorting">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Start Your Journey
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-xl font-semibold transition-all duration-300 bg-transparent"
              >
                <Users className="w-5 h-5 mr-2" />
                Join Community
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">DSA Visualizer Pro</span>
            </div>
            <p className="text-gray-600 mb-4">Making algorithms accessible through interactive visualization</p>
            <div className="flex justify-center space-x-6 text-sm text-gray-500">
              <span>© 2024 DSA Visualizer Pro</span>
              <span>•</span>
              <span>Educational Platform</span>
              <span>•</span>
              <span>Open Source</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
