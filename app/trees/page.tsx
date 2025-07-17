"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Pause, RotateCcw, SkipForward, Plus, ArrowLeft, TreePine, Trash2, Eye, Shuffle } from "lucide-react"
import Link from "next/link"
import type { JSX } from "react/jsx-runtime"

interface TreeNode {
  value: number
  id: string
  left?: TreeNode
  right?: TreeNode
  x?: number
  y?: number
  isVisiting?: boolean
  isVisited?: boolean
  isHighlighted?: boolean
}

interface TraversalStep {
  currentNode: string | null
  visitedNodes: string[]
  description: string
  codeHighlight?: number
}

type TraversalType = "inorder" | "preorder" | "postorder" | "bfs" | "dfs"

const traversalAlgorithms = {
  inorder: {
    name: "In-order Traversal",
    description: "Visit left subtree, root, then right subtree (Left → Root → Right)",
    code: [
      "function inorderTraversal(node) {",
      "  if (node !== null) {",
      "    inorderTraversal(node.left);",
      "    visit(node);",
      "    inorderTraversal(node.right);",
      "  }",
      "}",
    ],
    color: "from-blue-500 to-blue-600",
  },
  preorder: {
    name: "Pre-order Traversal",
    description: "Visit root, left subtree, then right subtree (Root → Left → Right)",
    code: [
      "function preorderTraversal(node) {",
      "  if (node !== null) {",
      "    visit(node);",
      "    preorderTraversal(node.left);",
      "    preorderTraversal(node.right);",
      "  }",
      "}",
    ],
    color: "from-green-500 to-green-600",
  },
  postorder: {
    name: "Post-order Traversal",
    description: "Visit left subtree, right subtree, then root (Left → Right → Root)",
    code: [
      "function postorderTraversal(node) {",
      "  if (node !== null) {",
      "    postorderTraversal(node.left);",
      "    postorderTraversal(node.right);",
      "    visit(node);",
      "  }",
      "}",
    ],
    color: "from-purple-500 to-purple-600",
  },
  bfs: {
    name: "Breadth-First Search",
    description: "Visit nodes level by level using a queue",
    code: [
      "function bfsTraversal(root) {",
      "  const queue = [root];",
      "  while (queue.length > 0) {",
      "    const node = queue.shift();",
      "    visit(node);",
      "    if (node.left) queue.push(node.left);",
      "    if (node.right) queue.push(node.right);",
      "  }",
      "}",
    ],
    color: "from-orange-500 to-orange-600",
  },
  dfs: {
    name: "Depth-First Search",
    description: "Visit nodes using a stack (similar to pre-order)",
    code: [
      "function dfsTraversal(root) {",
      "  const stack = [root];",
      "  while (stack.length > 0) {",
      "    const node = stack.pop();",
      "    visit(node);",
      "    if (node.right) stack.push(node.right);",
      "    if (node.left) stack.push(node.left);",
      "  }",
      "}",
    ],
    color: "from-red-500 to-red-600",
  },
}

export default function TreeVisualizer() {
  const [tree, setTree] = useState<TreeNode | null>(null)
  const [traversalType, setTraversalType] = useState<TraversalType>("inorder")
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState<TraversalStep[]>([])
  const [inputValue, setInputValue] = useState("")
  const [userInput, setUserInput] = useState("")
  const [traversalResult, setTraversalResult] = useState<number[]>([])
  const timeoutRef = useRef<NodeJS.Timeout>()

  // Create a new tree node
  const createNode = (value: number): TreeNode => ({
    value,
    id: `node-${value}-${Date.now()}`,
  })

  // Insert node into BST
  const insertNode = (root: TreeNode | null, value: number): TreeNode => {
    if (root === null) {
      return createNode(value)
    }

    if (value < root.value) {
      root.left = insertNode(root.left, value)
    } else if (value > root.value) {
      root.right = insertNode(root.right, value)
    }

    return root
  }

  // Calculate node positions for visualization
  const calculatePositions = (node: TreeNode | null, x: number, y: number, spacing: number): void => {
    if (node === null) return

    node.x = x
    node.y = y

    if (node.left) {
      calculatePositions(node.left, x - spacing, y + 80, spacing * 0.7)
    }
    if (node.right) {
      calculatePositions(node.right, x + spacing, y + 80, spacing * 0.7)
    }
  }

  // Generate tree from user input
  const generateFromInput = useCallback(() => {
    if (!userInput.trim()) return

    const values = userInput
      .split(/[,\s]+/)
      .map((val) => Number.parseInt(val.trim()))
      .filter((val) => !isNaN(val) && val >= 1 && val <= 999)

    if (values.length === 0) {
      alert("Please enter valid numbers (1-999) separated by commas or spaces")
      return
    }

    if (values.length > 20) {
      alert("Maximum 20 nodes allowed for better visualization")
      return
    }

    let newTree: TreeNode | null = null
    values.forEach((value) => {
      newTree = insertNode(newTree, value)
    })

    if (newTree) {
      calculatePositions(newTree, 400, 50, 120)
    }

    setTree(newTree)
    setSteps([])
    setCurrentStep(0)
    setTraversalResult([])
    setIsPlaying(false)
  }, [userInput])

  // Generate sample tree
  const generateSampleTree = () => {
    const values = [50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 45]
    let newTree: TreeNode | null = null

    values.forEach((value) => {
      newTree = insertNode(newTree, value)
    })

    if (newTree) {
      calculatePositions(newTree, 400, 50, 120)
    }

    setTree(newTree)
    setSteps([])
    setCurrentStep(0)
    setTraversalResult([])
    setIsPlaying(false)
  }

  // Generate random tree
  const generateRandomTree = () => {
    const values: number[] = []
    const size = Math.floor(Math.random() * 10) + 8 // 8-17 nodes

    while (values.length < size) {
      const value = Math.floor(Math.random() * 100) + 1
      if (!values.includes(value)) {
        values.push(value)
      }
    }

    let newTree: TreeNode | null = null
    values.forEach((value) => {
      newTree = insertNode(newTree, value)
    })

    if (newTree) {
      calculatePositions(newTree, 400, 50, 120)
    }

    setTree(newTree)
    setSteps([])
    setCurrentStep(0)
    setTraversalResult([])
    setIsPlaying(false)
  }

  // Add node to tree
  const addNode = () => {
    const value = Number.parseInt(inputValue)
    if (isNaN(value) || value < 1 || value > 999) {
      alert("Please enter a valid number between 1 and 999")
      return
    }

    if (tree === null) {
      const newTree = createNode(value)
      calculatePositions(newTree, 400, 50, 120)
      setTree(newTree)
    } else {
      const newTree = insertNode(tree, value)
      calculatePositions(newTree, 400, 50, 120)
      setTree(newTree)
    }

    setInputValue("")
    setSteps([])
    setCurrentStep(0)
    setTraversalResult([])
    setIsPlaying(false)
  }

  // Clear tree
  const clearTree = () => {
    setTree(null)
    setUserInput("")
    setInputValue("")
    setSteps([])
    setCurrentStep(0)
    setTraversalResult([])
    setIsPlaying(false)
  }

  // In-order traversal
  const inorderTraversal = (node: TreeNode | null, steps: TraversalStep[], visited: string[]): void => {
    if (node === null) return

    // Visit left subtree
    if (node.left) {
      steps.push({
        currentNode: node.id,
        visitedNodes: [...visited],
        description: `Moving to left child of ${node.value}`,
        codeHighlight: 2,
      })
      inorderTraversal(node.left, steps, visited)
    }

    // Visit root
    visited.push(node.id)
    steps.push({
      currentNode: node.id,
      visitedNodes: [...visited],
      description: `Visiting node ${node.value}`,
      codeHighlight: 3,
    })

    // Visit right subtree
    if (node.right) {
      steps.push({
        currentNode: node.id,
        visitedNodes: [...visited],
        description: `Moving to right child of ${node.value}`,
        codeHighlight: 4,
      })
      inorderTraversal(node.right, steps, visited)
    }
  }

  // Pre-order traversal
  const preorderTraversal = (node: TreeNode | null, steps: TraversalStep[], visited: string[]): void => {
    if (node === null) return

    // Visit root first
    visited.push(node.id)
    steps.push({
      currentNode: node.id,
      visitedNodes: [...visited],
      description: `Visiting node ${node.value}`,
      codeHighlight: 2,
    })

    // Visit left subtree
    if (node.left) {
      steps.push({
        currentNode: node.id,
        visitedNodes: [...visited],
        description: `Moving to left child of ${node.value}`,
        codeHighlight: 3,
      })
      preorderTraversal(node.left, steps, visited)
    }

    // Visit right subtree
    if (node.right) {
      steps.push({
        currentNode: node.id,
        visitedNodes: [...visited],
        description: `Moving to right child of ${node.value}`,
        codeHighlight: 4,
      })
      preorderTraversal(node.right, steps, visited)
    }
  }

  // Post-order traversal
  const postorderTraversal = (node: TreeNode | null, steps: TraversalStep[], visited: string[]): void => {
    if (node === null) return

    // Visit left subtree
    if (node.left) {
      steps.push({
        currentNode: node.id,
        visitedNodes: [...visited],
        description: `Moving to left child of ${node.value}`,
        codeHighlight: 2,
      })
      postorderTraversal(node.left, steps, visited)
    }

    // Visit right subtree
    if (node.right) {
      steps.push({
        currentNode: node.id,
        visitedNodes: [...visited],
        description: `Moving to right child of ${node.value}`,
        codeHighlight: 3,
      })
      postorderTraversal(node.right, steps, visited)
    }

    // Visit root last
    visited.push(node.id)
    steps.push({
      currentNode: node.id,
      visitedNodes: [...visited],
      description: `Visiting node ${node.value}`,
      codeHighlight: 4,
    })
  }

  // BFS traversal
  const bfsTraversal = (root: TreeNode): TraversalStep[] => {
    const steps: TraversalStep[] = []
    const queue: TreeNode[] = [root]
    const visited: string[] = []

    steps.push({
      currentNode: null,
      visitedNodes: [],
      description: "Starting BFS traversal - adding root to queue",
      codeHighlight: 1,
    })

    while (queue.length > 0) {
      const node = queue.shift()!
      visited.push(node.id)

      steps.push({
        currentNode: node.id,
        visitedNodes: [...visited],
        description: `Visiting node ${node.value} (dequeued from front)`,
        codeHighlight: 4,
      })

      if (node.left) {
        queue.push(node.left)
        steps.push({
          currentNode: node.id,
          visitedNodes: [...visited],
          description: `Adding left child ${node.left.value} to queue`,
          codeHighlight: 5,
        })
      }

      if (node.right) {
        queue.push(node.right)
        steps.push({
          currentNode: node.id,
          visitedNodes: [...visited],
          description: `Adding right child ${node.right.value} to queue`,
          codeHighlight: 6,
        })
      }
    }

    return steps
  }

  // DFS traversal
  const dfsTraversal = (root: TreeNode): TraversalStep[] => {
    const steps: TraversalStep[] = []
    const stack: TreeNode[] = [root]
    const visited: string[] = []

    steps.push({
      currentNode: null,
      visitedNodes: [],
      description: "Starting DFS traversal - adding root to stack",
      codeHighlight: 1,
    })

    while (stack.length > 0) {
      const node = stack.pop()!
      visited.push(node.id)

      steps.push({
        currentNode: node.id,
        visitedNodes: [...visited],
        description: `Visiting node ${node.value} (popped from stack)`,
        codeHighlight: 4,
      })

      if (node.right) {
        stack.push(node.right)
        steps.push({
          currentNode: node.id,
          visitedNodes: [...visited],
          description: `Adding right child ${node.right.value} to stack`,
          codeHighlight: 5,
        })
      }

      if (node.left) {
        stack.push(node.left)
        steps.push({
          currentNode: node.id,
          visitedNodes: [...visited],
          description: `Adding left child ${node.left.value} to stack`,
          codeHighlight: 6,
        })
      }
    }

    return steps
  }

  // Generate traversal steps
  const generateTraversalSteps = useCallback(() => {
    if (!tree) return

    const steps: TraversalStep[] = []
    const visited: string[] = []

    switch (traversalType) {
      case "inorder":
        inorderTraversal(tree, steps, visited)
        break
      case "preorder":
        preorderTraversal(tree, steps, visited)
        break
      case "postorder":
        postorderTraversal(tree, steps, visited)
        break
      case "bfs":
        return bfsTraversal(tree)
      case "dfs":
        return dfsTraversal(tree)
    }

    return steps
  }, [tree, traversalType])

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
    }, 1500)
  }, [currentStep, steps])

  // Control functions
  const handlePlay = () => {
    if (!tree) {
      alert("Please create a tree first!")
      return
    }
    if (steps.length === 0) {
      const newSteps = generateTraversalSteps()
      if (newSteps) {
        setSteps(newSteps)
        setCurrentStep(0)
      }
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
    if (!tree) {
      alert("Please create a tree first!")
      return
    }
    if (steps.length === 0) {
      const newSteps = generateTraversalSteps()
      if (newSteps) {
        setSteps(newSteps)
        setCurrentStep(0)
        return
      }
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  // Effects
  useEffect(() => {
    generateSampleTree()
  }, [])

  useEffect(() => {
    if (isPlaying) {
      playAnimation()
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [isPlaying, playAnimation])

  useEffect(() => {
    if (steps.length > 0 && currentStep < steps.length) {
      const currentStepData = steps[currentStep]
      const result: number[] = []

      // Get values of visited nodes in order
      currentStepData.visitedNodes.forEach((nodeId) => {
        const findNodeValue = (node: TreeNode | null): number | null => {
          if (!node) return null
          if (node.id === nodeId) return node.value
          return findNodeValue(node.left) || findNodeValue(node.right)
        }
        const value = findNodeValue(tree)
        if (value !== null) result.push(value)
      })

      setTraversalResult(result)
    }
  }, [currentStep, steps, tree])

  // Render tree nodes
  const renderTree = (node: TreeNode | null): JSX.Element | null => {
    if (!node || !node.x || !node.y) return null

    const isCurrentNode = steps.length > 0 && currentStep < steps.length && steps[currentStep].currentNode === node.id
    const isVisited =
      steps.length > 0 && currentStep < steps.length && steps[currentStep].visitedNodes.includes(node.id)

    return (
      <g key={node.id}>
        {/* Render edges to children */}
        {node.left && node.left.x && node.left.y && (
          <line
            x1={node.x}
            y1={node.y}
            x2={node.left.x}
            y2={node.left.y}
            stroke="#6b7280"
            strokeWidth="2"
            className="transition-all duration-300"
          />
        )}
        {node.right && node.right.x && node.right.y && (
          <line
            x1={node.x}
            y1={node.y}
            x2={node.right.x}
            y2={node.right.y}
            stroke="#6b7280"
            strokeWidth="2"
            className="transition-all duration-300"
          />
        )}

        {/* Render node */}
        <circle
          cx={node.x}
          cy={node.y}
          r="25"
          fill={isCurrentNode ? "url(#currentGradient)" : isVisited ? "url(#visitedGradient)" : "url(#defaultGradient)"}
          stroke={isCurrentNode ? "#fbbf24" : isVisited ? "#10b981" : "#6b7280"}
          strokeWidth={isCurrentNode ? "3" : "2"}
          className="transition-all duration-500"
        />
        <text x={node.x} y={node.y} textAnchor="middle" dy="0.35em" fill="white" fontSize="14" fontWeight="bold">
          {node.value}
        </text>

        {/* Render children */}
        {renderTree(node.left)}
        {renderTree(node.right)}
      </g>
    )
  }

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
                className={`w-10 h-10 bg-gradient-to-br ${traversalAlgorithms[traversalType].color} rounded-xl flex items-center justify-center shadow-lg`}
              >
                <TreePine className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Tree Algorithms</h1>
                <p className="text-sm text-gray-600">Binary Tree Traversal Visualization</p>
              </div>
            </div>
            <Badge className={`bg-gradient-to-r ${traversalAlgorithms[traversalType].color} text-white px-3 py-1`}>
              {traversalAlgorithms[traversalType].name}
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Controls Panel */}
          <div className="lg:col-span-1 space-y-4">
            {/* Tree Input Controls */}
            <Card className="shadow-lg border-0">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center">
                  <TreePine className="w-5 h-5 mr-2 text-green-600" />
                  Tree Input
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="user-input" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="user-input">User Input</TabsTrigger>
                    <TabsTrigger value="random">Random</TabsTrigger>
                  </TabsList>

                  <TabsContent value="user-input" className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Enter numbers (comma/space separated)
                        <span className="text-xs text-blue-600 block">Will create a Binary Search Tree</span>
                      </label>
                      <Input
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="e.g., 50, 30, 70, 20, 40, 60, 80"
                        className="border-2 hover:border-blue-300 transition-colors"
                      />
                      <Button onClick={generateFromInput} className="w-full bg-gradient-to-r from-blue-500 to-blue-600">
                        Create Tree
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Add Single Node</label>
                      <div className="flex space-x-2">
                        <Input
                          type="number"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          placeholder="Enter number"
                          min="1"
                          max="999"
                          className="border-2 hover:border-green-300 transition-colors"
                        />
                        <Button onClick={addNode} size="sm" className="bg-green-500 hover:bg-green-600">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        onClick={generateSampleTree}
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Sample
                      </Button>
                      <Button onClick={clearTree} variant="outline" size="sm" className="flex-1 bg-transparent">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Clear
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="random" className="space-y-4">
                    <Button
                      onClick={generateRandomTree}
                      className="w-full bg-gradient-to-r from-purple-500 to-purple-600"
                    >
                      <Shuffle className="w-4 h-4 mr-2" />
                      Generate Random Tree
                    </Button>
                    <Button onClick={generateSampleTree} variant="outline" className="w-full bg-transparent">
                      <Eye className="w-4 h-4 mr-2" />
                      Generate Sample Tree
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Traversal Controls */}
            <Card className="shadow-lg border-0">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Traversal Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Traversal Type</label>
                  <Select value={traversalType} onValueChange={(value: TraversalType) => setTraversalType(value)}>
                    <SelectTrigger className="border-2 hover:border-blue-300 transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(traversalAlgorithms).map(([key, algo]) => (
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
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    size="sm"
                    className="hover:bg-gray-50 bg-transparent col-span-2"
                  >
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
                  <div
                    className={`w-5 h-5 bg-gradient-to-r ${traversalAlgorithms[traversalType].color} rounded mr-2`}
                  ></div>
                  {traversalAlgorithms[traversalType].name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 leading-relaxed">
                  {traversalAlgorithms[traversalType].description}
                </p>
                <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                  <div className="text-xs font-medium text-gray-700 mb-2">Traversal Order:</div>
                  <div className="flex flex-wrap gap-1">
                    {traversalResult.map((value, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {value}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card className="shadow-lg border-0">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Nodes Visited:</span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    {steps.length > 0 && currentStep < steps.length ? steps[currentStep].visitedNodes.length : 0}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Total Nodes:</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    {tree ? countNodes(tree) : 0}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Progress:</span>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                    {currentStep} / {steps.length}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Visualization Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Tree Visualization */}
            <Card className="shadow-lg border-0">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>Binary Tree Visualization</span>
                  <Badge className={`bg-gradient-to-r ${traversalAlgorithms[traversalType].color} text-white`}>
                    {tree ? countNodes(tree) : 0} nodes
                  </Badge>
                </CardTitle>
                {steps.length > 0 && currentStep < steps.length && (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-gray-700">{steps[currentStep].description}</p>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden">
                  {tree ? (
                    <svg width="100%" height="100%" viewBox="0 0 800 400">
                      {/* Gradients for different node states */}
                      <defs>
                        <linearGradient id="defaultGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#1d4ed8" />
                        </linearGradient>
                        <linearGradient id="currentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#f59e0b" />
                          <stop offset="100%" stopColor="#d97706" />
                        </linearGradient>
                        <linearGradient id="visitedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#10b981" />
                          <stop offset="100%" stopColor="#059669" />
                        </linearGradient>
                      </defs>
                      {renderTree(tree)}
                    </svg>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <div className="text-center">
                        <TreePine className="w-16 h-16 mx-auto mb-4 opacity-30" />
                        <p className="text-lg font-medium">No tree to display</p>
                        <p className="text-sm">Create a tree using the input controls</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Legend */}
                {tree && (
                  <div className="flex flex-wrap justify-center gap-4 mt-6 p-4 bg-white rounded-lg border">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
                      <span className="text-xs font-medium text-gray-600">Unvisited</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full"></div>
                      <span className="text-xs font-medium text-gray-600">Current</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-green-600 rounded-full"></div>
                      <span className="text-xs font-medium text-gray-600">Visited</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Code Display */}
            <Card className="shadow-lg border-0">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center">
                  <TreePine className="w-5 h-5 mr-2 text-gray-600" />
                  Algorithm Implementation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 p-6 rounded-xl font-mono text-sm overflow-x-auto shadow-inner">
                  {traversalAlgorithms[traversalType].code.map((line, index) => (
                    <div
                      key={index}
                      className={`py-2 px-3 rounded transition-all duration-300 ${
                        steps.length > 0 && currentStep < steps.length && steps[currentStep].codeHighlight === index
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

// Helper function to count nodes in tree
function countNodes(node: TreeNode | null): number {
  if (!node) return 0
  return 1 + countNodes(node.left) + countNodes(node.right)
}
