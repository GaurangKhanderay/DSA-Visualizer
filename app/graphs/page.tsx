"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Pause, RotateCcw, SkipForward, ArrowLeft, Network, Shuffle, Target } from "lucide-react"
import Link from "next/link"

interface GraphNode {
  id: string
  label: string
  x: number
  y: number
  isVisiting?: boolean
  isVisited?: boolean
  isStart?: boolean
  isEnd?: boolean
  distance?: number
}

interface GraphEdge {
  from: string
  to: string
  weight: number
}

interface PathStep {
  currentNode: string | null
  visitedNodes: string[]
  queue?: string[]
  stack?: string[]
  distances?: { [key: string]: number }
  description: string
  codeHighlight?: number
}

type GraphAlgorithm = "bfs" | "dfs" | "dijkstra"

const graphAlgorithms = {
  bfs: {
    name: "Breadth-First Search",
    description: "Explores nodes level by level using a queue data structure",
    code: [
      "function bfs(graph, start) {",
      "  const queue = [start];",
      "  const visited = new Set();",
      "  while (queue.length > 0) {",
      "    const node = queue.shift();",
      "    if (!visited.has(node)) {",
      "      visited.add(node);",
      "      for (neighbor of graph[node]) {",
      "        if (!visited.has(neighbor)) {",
      "          queue.push(neighbor);",
      "        }",
      "      }",
      "    }",
      "  }",
      "}",
    ],
    color: "from-blue-500 to-blue-600",
  },
  dfs: {
    name: "Depth-First Search",
    description: "Explores as far as possible along each branch using a stack",
    code: [
      "function dfs(graph, start) {",
      "  const stack = [start];",
      "  const visited = new Set();",
      "  while (stack.length > 0) {",
      "    const node = stack.pop();",
      "    if (!visited.has(node)) {",
      "      visited.add(node);",
      "      for (neighbor of graph[node]) {",
      "        if (!visited.has(neighbor)) {",
      "          stack.push(neighbor);",
      "        }",
      "      }",
      "    }",
      "  }",
      "}",
    ],
    color: "from-green-500 to-green-600",
  },
  dijkstra: {
    name: "Dijkstra's Algorithm",
    description: "Finds shortest path between nodes using weighted edges",
    code: [
      "function dijkstra(graph, start) {",
      "  const distances = {};",
      "  const visited = new Set();",
      "  const pq = new PriorityQueue();",
      "  distances[start] = 0;",
      "  pq.enqueue(start, 0);",
      "  while (!pq.isEmpty()) {",
      "    const current = pq.dequeue();",
      "    if (visited.has(current)) continue;",
      "    visited.add(current);",
      "    for (neighbor of graph[current]) {",
      "      const newDist = distances[current] + weight;",
      "      if (newDist < distances[neighbor]) {",
      "        distances[neighbor] = newDist;",
      "        pq.enqueue(neighbor, newDist);",
      "      }",
      "    }",
      "  }",
      "}",
    ],
    color: "from-purple-500 to-purple-600",
  },
}

export default function GraphVisualizer() {
  const [nodes, setNodes] = useState<GraphNode[]>([])
  const [edges, setEdges] = useState<GraphEdge[]>([])
  const [algorithm, setAlgorithm] = useState<GraphAlgorithm>("bfs")
  const [startNode, setStartNode] = useState<string>("")
  const [endNode, setEndNode] = useState<string>("")
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState<PathStep[]>([])
  const timeoutRef = useRef<NodeJS.Timeout>()

  // Generate sample graph
  const generateSampleGraph = useCallback(() => {
    const sampleNodes: GraphNode[] = [
      { id: "A", label: "A", x: 150, y: 100 },
      { id: "B", label: "B", x: 300, y: 80 },
      { id: "C", label: "C", x: 450, y: 120 },
      { id: "D", label: "D", x: 100, y: 250 },
      { id: "E", label: "E", x: 250, y: 220 },
      { id: "F", label: "F", x: 400, y: 280 },
      { id: "G", label: "G", x: 550, y: 200 },
    ]

    const sampleEdges: GraphEdge[] = [
      { from: "A", to: "B", weight: 4 },
      { from: "A", to: "D", weight: 2 },
      { from: "B", to: "C", weight: 3 },
      { from: "B", to: "E", weight: 1 },
      { from: "C", to: "F", weight: 6 },
      { from: "C", to: "G", weight: 2 },
      { from: "D", to: "E", weight: 5 },
      { from: "E", to: "F", weight: 3 },
      { from: "F", to: "G", weight: 1 },
    ]

    setNodes(sampleNodes)
    setEdges(sampleEdges)
    setStartNode("A")
    setEndNode("G")
    setSteps([])
    setCurrentStep(0)
    setIsPlaying(false)
  }, [])

  // BFS implementation
  const bfsTraversal = (startNodeId: string): PathStep[] => {
    const steps: PathStep[] = []
    const queue: string[] = [startNodeId]
    const visited: string[] = []

    steps.push({
      currentNode: null,
      visitedNodes: [],
      queue: [...queue],
      description: `Starting BFS from node ${startNodeId}`,
      codeHighlight: 1,
    })

    while (queue.length > 0) {
      const currentNodeId = queue.shift()!

      if (!visited.includes(currentNodeId)) {
        visited.push(currentNodeId)

        steps.push({
          currentNode: currentNodeId,
          visitedNodes: [...visited],
          queue: [...queue],
          description: `Visiting node ${currentNodeId}`,
          codeHighlight: 6,
        })

        // Add neighbors to queue
        const neighbors = edges
          .filter((edge) => edge.from === currentNodeId || edge.to === currentNodeId)
          .map((edge) => (edge.from === currentNodeId ? edge.to : edge.from))
          .filter((neighbor) => !visited.includes(neighbor) && !queue.includes(neighbor))

        neighbors.forEach((neighbor) => {
          queue.push(neighbor)
          steps.push({
            currentNode: currentNodeId,
            visitedNodes: [...visited],
            queue: [...queue],
            description: `Adding neighbor ${neighbor} to queue`,
            codeHighlight: 9,
          })
        })
      }
    }

    steps.push({
      currentNode: null,
      visitedNodes: [...visited],
      queue: [],
      description: "BFS traversal completed!",
      codeHighlight: 0,
    })

    return steps
  }

  // DFS implementation
  const dfsTraversal = (startNodeId: string): PathStep[] => {
    const steps: PathStep[] = []
    const stack: string[] = [startNodeId]
    const visited: string[] = []

    steps.push({
      currentNode: null,
      visitedNodes: [],
      stack: [...stack],
      description: `Starting DFS from node ${startNodeId}`,
      codeHighlight: 1,
    })

    while (stack.length > 0) {
      const currentNodeId = stack.pop()!

      if (!visited.includes(currentNodeId)) {
        visited.push(currentNodeId)

        steps.push({
          currentNode: currentNodeId,
          visitedNodes: [...visited],
          stack: [...stack],
          description: `Visiting node ${currentNodeId}`,
          codeHighlight: 6,
        })

        // Add neighbors to stack
        const neighbors = edges
          .filter((edge) => edge.from === currentNodeId || edge.to === currentNodeId)
          .map((edge) => (edge.from === currentNodeId ? edge.to : edge.from))
          .filter((neighbor) => !visited.includes(neighbor))

        neighbors.forEach((neighbor) => {
          if (!stack.includes(neighbor)) {
            stack.push(neighbor)
            steps.push({
              currentNode: currentNodeId,
              visitedNodes: [...visited],
              stack: [...stack],
              description: `Adding neighbor ${neighbor} to stack`,
              codeHighlight: 9,
            })
          }
        })
      }
    }

    steps.push({
      currentNode: null,
      visitedNodes: [...visited],
      stack: [],
      description: "DFS traversal completed!",
      codeHighlight: 0,
    })

    return steps
  }

  // Dijkstra's algorithm implementation
  const dijkstraAlgorithm = (startNodeId: string): PathStep[] => {
    const steps: PathStep[] = []
    const distances: { [key: string]: number } = {}
    const visited: string[] = []
    const unvisited = nodes.map((node) => node.id)

    // Initialize distances
    nodes.forEach((node) => {
      distances[node.id] = node.id === startNodeId ? 0 : Number.POSITIVE_INFINITY
    })

    steps.push({
      currentNode: null,
      visitedNodes: [],
      distances: { ...distances },
      description: `Initializing distances from ${startNodeId}`,
      codeHighlight: 4,
    })

    while (unvisited.length > 0) {
      // Find unvisited node with minimum distance
      const currentNodeId = unvisited.reduce((min, nodeId) => (distances[nodeId] < distances[min] ? nodeId : min))

      if (distances[currentNodeId] === Number.POSITIVE_INFINITY) break

      unvisited.splice(unvisited.indexOf(currentNodeId), 1)
      visited.push(currentNodeId)

      steps.push({
        currentNode: currentNodeId,
        visitedNodes: [...visited],
        distances: { ...distances },
        description: `Visiting node ${currentNodeId} with distance ${distances[currentNodeId]}`,
        codeHighlight: 9,
      })

      // Update distances to neighbors
      const neighborEdges = edges.filter((edge) => edge.from === currentNodeId || edge.to === currentNodeId)

      neighborEdges.forEach((edge) => {
        const neighborId = edge.from === currentNodeId ? edge.to : edge.from
        if (!visited.includes(neighborId)) {
          const newDistance = distances[currentNodeId] + edge.weight

          if (newDistance < distances[neighborId]) {
            distances[neighborId] = newDistance

            steps.push({
              currentNode: currentNodeId,
              visitedNodes: [...visited],
              distances: { ...distances },
              description: `Updated distance to ${neighborId}: ${newDistance}`,
              codeHighlight: 13,
            })
          }
        }
      })
    }

    steps.push({
      currentNode: null,
      visitedNodes: [...visited],
      distances: { ...distances },
      description: "Dijkstra's algorithm completed!",
      codeHighlight: 0,
    })

    return steps
  }

  // Generate algorithm steps
  const generateSteps = useCallback(() => {
    if (nodes.length === 0 || !startNode) return

    let newSteps: PathStep[] = []

    switch (algorithm) {
      case "bfs":
        newSteps = bfsTraversal(startNode)
        break
      case "dfs":
        newSteps = dfsTraversal(startNode)
        break
      case "dijkstra":
        newSteps = dijkstraAlgorithm(startNode)
        break
    }

    setSteps(newSteps)
    setCurrentStep(0)
  }, [nodes, edges, algorithm, startNode])

  // Animation control
  const playAnimation = useCallback(() => {
    if (currentStep >= steps.length - 1) {
      setIsPlaying(false)
      return
    }

    timeoutRef.current = setTimeout(() => {
      setCurrentStep((prev) => {
        const nextStep = prev + 1
        if (nextStep >= steps.length) {
          setIsPlaying(false)
          return prev
        }
        return nextStep
      })
    }, 2000)
  }, [currentStep, steps])

  // Control functions
  const handlePlay = () => {
    if (steps.length === 0) {
      generateSteps()
    }
    setIsPlaying(true)
  }

  const handlePause = () => {
    setIsPlaying(false)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
  }

  const handleReset = () => {
    setIsPlaying(false)
    setCurrentStep(0)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
  }

  const handleStep = () => {
    if (steps.length === 0) {
      generateSteps()
      return
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  // Effects
  useEffect(() => {
    generateSampleGraph()
  }, [generateSampleGraph])

  useEffect(() => {
    if (isPlaying) {
      playAnimation()
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [isPlaying, playAnimation])

  const currentStepData = steps.length > 0 && currentStep < steps.length ? steps[currentStep] : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/">
                <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div
                className={`w-10 h-10 bg-gradient-to-br ${graphAlgorithms[algorithm].color} rounded-xl flex items-center justify-center shadow-lg`}
              >
                <Network className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Graph Algorithms</h1>
                <p className="text-sm text-gray-600">Graph Traversal & Pathfinding Visualization</p>
              </div>
            </div>
            <Badge className={`bg-gradient-to-r ${graphAlgorithms[algorithm].color} text-white px-3 py-1`}>
              {graphAlgorithms[algorithm].name}
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Controls Panel */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="shadow-lg border-0">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center">
                  <Network className="w-5 h-5 mr-2 text-orange-600" />
                  Graph Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Algorithm</label>
                  <Select value={algorithm} onValueChange={(value: GraphAlgorithm) => setAlgorithm(value)}>
                    <SelectTrigger className="border-2 hover:border-blue-300 transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(graphAlgorithms).map(([key, algo]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 bg-gradient-to-r ${algo.color} rounded-full`}></div>
                            <span>{algo.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Start Node</label>
                    <Select value={startNode} onValueChange={setStartNode}>
                      <SelectTrigger className="border-2 hover:border-green-300 transition-colors">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {nodes.map((node) => (
                          <SelectItem key={node.id} value={node.id}>
                            {node.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">End Node</label>
                    <Select value={endNode} onValueChange={setEndNode}>
                      <SelectTrigger className="border-2 hover:border-red-300 transition-colors">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {nodes.map((node) => (
                          <SelectItem key={node.id} value={node.id}>
                            {node.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={generateSampleGraph}
                    variant="outline"
                    size="sm"
                    className="hover:bg-gray-50 bg-transparent"
                  >
                    <Shuffle className="w-4 h-4 mr-2" />
                    New Graph
                  </Button>
                  {!isPlaying ? (
                    <Button
                      onClick={handlePlay}
                      size="sm"
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Play
                    </Button>
                  ) : (
                    <Button
                      onClick={handlePause}
                      size="sm"
                      className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                    >
                      <Pause className="w-4 h-4 mr-2" />
                      Pause
                    </Button>
                  )}
                  <Button onClick={handleStep} variant="outline" size="sm" className="hover:bg-blue-50 bg-transparent">
                    <SkipForward className="w-4 h-4 mr-2" />
                    Step
                  </Button>
                  <Button onClick={handleReset} variant="outline" size="sm" className="hover:bg-gray-50 bg-transparent">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Algorithm Info */}
            <Card className="shadow-lg border-0">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center">
                  <div className={`w-5 h-5 bg-gradient-to-r ${graphAlgorithms[algorithm].color} rounded mr-2`}></div>
                  {graphAlgorithms[algorithm].name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 leading-relaxed">{graphAlgorithms[algorithm].description}</p>

                {/* Queue/Stack/Distances Display */}
                {currentStepData && (
                  <div className="space-y-3">
                    {currentStepData.queue && (
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="text-xs font-medium text-blue-700 mb-2">Queue:</div>
                        <div className="flex flex-wrap gap-1">
                          {currentStepData.queue.map((nodeId, index) => (
                            <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-700">
                              {nodeId}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {currentStepData.stack && (
                      <div className="p-3 bg-green-50 rounded-lg">
                        <div className="text-xs font-medium text-green-700 mb-2">Stack:</div>
                        <div className="flex flex-wrap gap-1">
                          {currentStepData.stack.map((nodeId, index) => (
                            <Badge key={index} variant="secondary" className="bg-green-100 text-green-700">
                              {nodeId}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {currentStepData.distances && (
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <div className="text-xs font-medium text-purple-700 mb-2">Distances:</div>
                        <div className="grid grid-cols-2 gap-1">
                          {Object.entries(currentStepData.distances).map(([nodeId, distance]) => (
                            <div key={nodeId} className="flex justify-between text-xs">
                              <span className="font-medium">{nodeId}:</span>
                              <span
                                className={distance === Number.POSITIVE_INFINITY ? "text-gray-400" : "text-purple-700"}
                              >
                                {distance === Number.POSITIVE_INFINITY ? "∞" : distance}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card className="shadow-lg border-0">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center">
                  <Target className="w-5 h-5 mr-2 text-green-600" />
                  Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Nodes:</span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    {nodes.length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Edges:</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    {edges.length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Visited:</span>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                    {currentStepData ? currentStepData.visitedNodes.length : 0}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Progress:</span>
                  <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                    {currentStep} / {steps.length}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Visualization Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Graph Visualization */}
            <Card className="shadow-lg border-0">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>Graph Visualization</span>
                  <Badge className={`bg-gradient-to-r ${graphAlgorithms[algorithm].color} text-white`}>
                    {nodes.length} nodes, {edges.length} edges
                  </Badge>
                </CardTitle>
                {currentStepData && (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-gray-700">{currentStepData.description}</p>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden">
                  <svg width="100%" height="100%" viewBox="0 0 700 350">
                    {/* Render edges */}
                    {edges.map((edge, index) => {
                      const fromNode = nodes.find((n) => n.id === edge.from)
                      const toNode = nodes.find((n) => n.id === edge.to)
                      if (!fromNode || !toNode) return null

                      return (
                        <g key={index}>
                          <line
                            x1={fromNode.x}
                            y1={fromNode.y}
                            x2={toNode.x}
                            y2={toNode.y}
                            stroke="#6b7280"
                            strokeWidth="2"
                            className="transition-all duration-300"
                          />
                          {/* Edge weight */}
                          <text
                            x={(fromNode.x + toNode.x) / 2}
                            y={(fromNode.y + toNode.y) / 2}
                            textAnchor="middle"
                            dy="-5"
                            fill="#374151"
                            fontSize="12"
                            fontWeight="bold"
                            className="bg-white"
                          >
                            {edge.weight}
                          </text>
                        </g>
                      )
                    })}

                    {/* Render nodes */}
                    {nodes.map((node) => {
                      const isCurrentNode = currentStepData?.currentNode === node.id
                      const isVisited = currentStepData?.visitedNodes.includes(node.id) || false
                      const isStart = node.id === startNode
                      const isEnd = node.id === endNode

                      return (
                        <g key={node.id}>
                          <circle
                            cx={node.x}
                            cy={node.y}
                            r="25"
                            fill={
                              isCurrentNode
                                ? "#f59e0b"
                                : isVisited
                                  ? "#10b981"
                                  : isStart
                                    ? "#3b82f6"
                                    : isEnd
                                      ? "#ef4444"
                                      : "#6b7280"
                            }
                            stroke={isCurrentNode ? "#d97706" : isVisited ? "#059669" : "#374151"}
                            strokeWidth="3"
                            className="transition-all duration-500"
                          />
                          <text
                            x={node.x}
                            y={node.y}
                            textAnchor="middle"
                            dy="0.35em"
                            fill="white"
                            fontSize="14"
                            fontWeight="bold"
                          >
                            {node.label}
                          </text>

                          {/* Distance label for Dijkstra */}
                          {algorithm === "dijkstra" && currentStepData?.distances && (
                            <text
                              x={node.x}
                              y={node.y - 35}
                              textAnchor="middle"
                              fill="#7c3aed"
                              fontSize="12"
                              fontWeight="bold"
                            >
                              {currentStepData.distances[node.id] === Number.POSITIVE_INFINITY
                                ? "∞"
                                : currentStepData.distances[node.id]}
                            </text>
                          )}
                        </g>
                      )
                    })}
                  </svg>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap justify-center gap-4 mt-6 p-4 bg-white rounded-lg border">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <span className="text-xs font-medium text-gray-600">Start Node</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span className="text-xs font-medium text-gray-600">End Node</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                    <span className="text-xs font-medium text-gray-600">Current</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className="text-xs font-medium text-gray-600">Visited</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
                    <span className="text-xs font-medium text-gray-600">Unvisited</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Code Display */}
            <Card className="shadow-lg border-0">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center">
                  <Network className="w-5 h-5 mr-2 text-gray-600" />
                  Algorithm Implementation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 p-6 rounded-xl font-mono text-sm overflow-x-auto shadow-inner">
                  {graphAlgorithms[algorithm].code.map((line, index) => (
                    <div
                      key={index}
                      className={`py-2 px-3 rounded transition-all duration-300 ${
                        currentStepData && currentStepData.codeHighlight === index
                          ? "bg-gradient-to-r from-yellow-600/30 to-orange-600/30 border-l-4 border-yellow-400 transform translate-x-2"
                          : "hover:bg-gray-700/30"
                      }`}
                    >
                      <span className="text-gray-500 mr-4 select-none">{String(index + 1).padStart(2, "0")}</span>
                      <span className="text-gray-100">{line}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
