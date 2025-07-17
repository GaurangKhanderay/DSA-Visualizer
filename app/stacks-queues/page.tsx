"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  Minus,
  RotateCcw,
  ArrowLeft,
  SquareStackIcon as Stack,
  ArrowRight,
  ArrowDown,
  ArrowUp,
  Eye,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"

interface StackElement {
  value: string
  id: number
  isAnimating?: boolean
  animationType?: "push" | "pop"
}

interface QueueElement {
  value: string
  id: number
  isAnimating?: boolean
  animationType?: "enqueue" | "dequeue"
}

interface Operation {
  type: "push" | "pop" | "enqueue" | "dequeue" | "peek" | "isEmpty"
  value?: string
  result?: string
  timestamp: number
}

export default function StacksQueuesVisualizer() {
  // Stack state
  const [stack, setStack] = useState<StackElement[]>([])
  const [stackInput, setStackInput] = useState("")
  const [stackOperations, setStackOperations] = useState<Operation[]>([])
  const [stackPeekValue, setStackPeekValue] = useState<string | null>(null)

  // Queue state
  const [queue, setQueue] = useState<QueueElement[]>([])
  const [queueInput, setQueueInput] = useState("")
  const [queueOperations, setQueueOperations] = useState<Operation[]>([])
  const [queueFrontValue, setQueueFrontValue] = useState<string | null>(null)

  // Animation refs
  const stackAnimationRef = useRef<NodeJS.Timeout>()
  const queueAnimationRef = useRef<NodeJS.Timeout>()

  // Stack Operations
  const pushToStack = useCallback(() => {
    if (!stackInput.trim()) return

    const newElement: StackElement = {
      value: stackInput.trim(),
      id: Date.now(),
      isAnimating: true,
      animationType: "push",
    }

    setStack((prev) => [...prev, newElement])

    const operation: Operation = {
      type: "push",
      value: stackInput.trim(),
      timestamp: Date.now(),
    }
    setStackOperations((prev) => [operation, ...prev.slice(0, 9)])

    // Remove animation after delay
    stackAnimationRef.current = setTimeout(() => {
      setStack((prev) =>
        prev.map((el) => (el.id === newElement.id ? { ...el, isAnimating: false, animationType: undefined } : el)),
      )
    }, 500)

    setStackInput("")
  }, [stackInput])

  const popFromStack = useCallback(() => {
    if (stack.length === 0) {
      const operation: Operation = {
        type: "pop",
        result: "Stack is empty",
        timestamp: Date.now(),
      }
      setStackOperations((prev) => [operation, ...prev.slice(0, 9)])
      return
    }

    const topElement = stack[stack.length - 1]

    // Add pop animation
    setStack((prev) =>
      prev.map((el, index) => (index === prev.length - 1 ? { ...el, isAnimating: true, animationType: "pop" } : el)),
    )

    const operation: Operation = {
      type: "pop",
      result: topElement.value,
      timestamp: Date.now(),
    }
    setStackOperations((prev) => [operation, ...prev.slice(0, 9)])

    // Remove element after animation
    stackAnimationRef.current = setTimeout(() => {
      setStack((prev) => prev.slice(0, -1))
    }, 500)
  }, [stack])

  const peekStack = useCallback(() => {
    if (stack.length === 0) {
      setStackPeekValue("Stack is empty")
      const operation: Operation = {
        type: "peek",
        result: "Stack is empty",
        timestamp: Date.now(),
      }
      setStackOperations((prev) => [operation, ...prev.slice(0, 9)])
    } else {
      const topValue = stack[stack.length - 1].value
      setStackPeekValue(topValue)
      const operation: Operation = {
        type: "peek",
        result: topValue,
        timestamp: Date.now(),
      }
      setStackOperations((prev) => [operation, ...prev.slice(0, 9)])
    }

    // Clear peek value after 2 seconds
    setTimeout(() => setStackPeekValue(null), 2000)
  }, [stack])

  const checkStackEmpty = useCallback(() => {
    const isEmpty = stack.length === 0
    const operation: Operation = {
      type: "isEmpty",
      result: isEmpty.toString(),
      timestamp: Date.now(),
    }
    setStackOperations((prev) => [operation, ...prev.slice(0, 9)])
  }, [stack])

  const clearStack = useCallback(() => {
    setStack([])
    setStackOperations([])
    setStackPeekValue(null)
    setStackInput("")
  }, [])

  // Queue Operations
  const enqueue = useCallback(() => {
    if (!queueInput.trim()) return

    const newElement: QueueElement = {
      value: queueInput.trim(),
      id: Date.now(),
      isAnimating: true,
      animationType: "enqueue",
    }

    setQueue((prev) => [...prev, newElement])

    const operation: Operation = {
      type: "enqueue",
      value: queueInput.trim(),
      timestamp: Date.now(),
    }
    setQueueOperations((prev) => [operation, ...prev.slice(0, 9)])

    // Remove animation after delay
    queueAnimationRef.current = setTimeout(() => {
      setQueue((prev) =>
        prev.map((el) => (el.id === newElement.id ? { ...el, isAnimating: false, animationType: undefined } : el)),
      )
    }, 500)

    setQueueInput("")
  }, [queueInput])

  const dequeue = useCallback(() => {
    if (queue.length === 0) {
      const operation: Operation = {
        type: "dequeue",
        result: "Queue is empty",
        timestamp: Date.now(),
      }
      setQueueOperations((prev) => [operation, ...prev.slice(0, 9)])
      return
    }

    const frontElement = queue[0]

    // Add dequeue animation
    setQueue((prev) =>
      prev.map((el, index) => (index === 0 ? { ...el, isAnimating: true, animationType: "dequeue" } : el)),
    )

    const operation: Operation = {
      type: "dequeue",
      result: frontElement.value,
      timestamp: Date.now(),
    }
    setQueueOperations((prev) => [operation, ...prev.slice(0, 9)])

    // Remove element and shift others after animation
    queueAnimationRef.current = setTimeout(() => {
      setQueue((prev) => prev.slice(1))
    }, 500)
  }, [queue])

  const peekQueue = useCallback(() => {
    if (queue.length === 0) {
      setQueueFrontValue("Queue is empty")
      const operation: Operation = {
        type: "peek",
        result: "Queue is empty",
        timestamp: Date.now(),
      }
      setQueueOperations((prev) => [operation, ...prev.slice(0, 9)])
    } else {
      const frontValue = queue[0].value
      setQueueFrontValue(frontValue)
      const operation: Operation = {
        type: "peek",
        result: frontValue,
        timestamp: Date.now(),
      }
      setQueueOperations((prev) => [operation, ...prev.slice(0, 9)])
    }

    // Clear peek value after 2 seconds
    setTimeout(() => setQueueFrontValue(null), 2000)
  }, [queue])

  const checkQueueEmpty = useCallback(() => {
    const isEmpty = queue.length === 0
    const operation: Operation = {
      type: "isEmpty",
      result: isEmpty.toString(),
      timestamp: Date.now(),
    }
    setQueueOperations((prev) => [operation, ...prev.slice(0, 9)])
  }, [queue])

  const clearQueue = useCallback(() => {
    setQueue([])
    setQueueOperations([])
    setQueueFrontValue(null)
    setQueueInput("")
  }, [])

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (stackAnimationRef.current) clearTimeout(stackAnimationRef.current)
      if (queueAnimationRef.current) clearTimeout(queueAnimationRef.current)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                <Stack className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Stacks & Queues</h1>
                <p className="text-sm text-gray-600">LIFO and FIFO Data Structure Visualization</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="stack" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="stack" className="flex items-center space-x-2">
              <Stack className="w-4 h-4" />
              <span>Stack (LIFO)</span>
            </TabsTrigger>
            <TabsTrigger value="queue" className="flex items-center space-x-2">
              <ArrowRight className="w-4 h-4" />
              <span>Queue (FIFO)</span>
            </TabsTrigger>
          </TabsList>

          {/* Stack Tab */}
          <TabsContent value="stack">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Stack Controls */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Stack className="w-5 h-5 mr-2" />
                      Stack Operations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Push Value</label>
                      <div className="flex space-x-2">
                        <Input
                          value={stackInput}
                          onChange={(e) => setStackInput(e.target.value)}
                          placeholder="Enter value"
                          onKeyPress={(e) => e.key === "Enter" && pushToStack()}
                        />
                        <Button onClick={pushToStack} size="sm">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Button onClick={popFromStack} variant="outline" size="sm">
                        <Minus className="w-4 h-4 mr-2" />
                        Pop
                      </Button>
                      <Button onClick={peekStack} variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        Peek
                      </Button>
                      <Button onClick={checkStackEmpty} variant="outline" size="sm">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        isEmpty
                      </Button>
                      <Button onClick={clearStack} variant="outline" size="sm">
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Clear
                      </Button>
                    </div>

                    {stackPeekValue && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm font-medium text-blue-800">Peek Result: {stackPeekValue}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Stack Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Stack (LIFO)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-gray-600">
                      Last In, First Out - Elements are added and removed from the same end (top).
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Size:</span>
                        <Badge variant="secondary">{stack.length}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Top:</span>
                        <Badge variant="outline">{stack.length > 0 ? stack[stack.length - 1].value : "Empty"}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Stack Operations History */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Operations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {stackOperations.length === 0 ? (
                        <p className="text-sm text-gray-500">No operations yet</p>
                      ) : (
                        stackOperations.map((op, index) => (
                          <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm">
                            <span className="font-medium capitalize">{op.type}</span>
                            <span className="text-gray-600">
                              {op.value && `"${op.value}"`}
                              {op.result && `→ ${op.result}`}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Stack Visualization */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Stack Visualization</CardTitle>
                    <p className="text-sm text-gray-600">Elements are pushed to and popped from the top</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center space-y-2 min-h-96 justify-end p-4 bg-gray-50 rounded-lg relative">
                      {/* Stack base */}
                      <div className="w-32 h-4 bg-gray-800 rounded-b-lg"></div>

                      {/* Stack elements */}
                      {stack.length === 0 ? (
                        <div className="flex items-center justify-center h-32 text-gray-500">
                          <div className="text-center">
                            <Stack className="w-12 h-12 mx-auto mb-2 opacity-30" />
                            <p className="text-sm">Stack is empty</p>
                          </div>
                        </div>
                      ) : (
                        stack.map((element, index) => (
                          <div
                            key={element.id}
                            className={`w-32 h-12 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg flex items-center justify-center font-bold shadow-md transition-all duration-500 ${
                              element.isAnimating && element.animationType === "push"
                                ? "transform scale-110 -translate-y-4"
                                : element.isAnimating && element.animationType === "pop"
                                  ? "transform scale-90 translate-x-8 opacity-50"
                                  : ""
                            }`}
                            style={{
                              zIndex: stack.length - index,
                            }}
                          >
                            {element.value}
                          </div>
                        ))
                      )}

                      {/* Top indicator */}
                      {stack.length > 0 && (
                        <div className="absolute -right-8 top-4 flex items-center space-x-2">
                          <ArrowLeft className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-600">TOP</span>
                        </div>
                      )}

                      {/* Push/Pop arrows */}
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center space-y-1">
                        <ArrowDown className="w-5 h-5 text-green-600" />
                        <span className="text-xs text-green-600 font-medium">PUSH</span>
                      </div>
                      <div className="absolute -top-8 right-8 flex flex-col items-center space-y-1">
                        <ArrowUp className="w-5 h-5 text-red-600" />
                        <span className="text-xs text-red-600 font-medium">POP</span>
                      </div>
                    </div>

                    {/* Stack Operations Code */}
                    <div className="mt-6 bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
                      <div className="space-y-1">
                        <div className="text-green-400">// Stack Operations (LIFO)</div>
                        <div>
                          <span className="text-blue-400">push</span>(value) → Add to top
                        </div>
                        <div>
                          <span className="text-red-400">pop</span>() → Remove from top
                        </div>
                        <div>
                          <span className="text-yellow-400">peek</span>() → View top element
                        </div>
                        <div>
                          <span className="text-purple-400">isEmpty</span>() → Check if empty
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Queue Tab */}
          <TabsContent value="queue">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Queue Controls */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <ArrowRight className="w-5 h-5 mr-2" />
                      Queue Operations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Enqueue Value</label>
                      <div className="flex space-x-2">
                        <Input
                          value={queueInput}
                          onChange={(e) => setQueueInput(e.target.value)}
                          placeholder="Enter value"
                          onKeyPress={(e) => e.key === "Enter" && enqueue()}
                        />
                        <Button onClick={enqueue} size="sm">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Button onClick={dequeue} variant="outline" size="sm">
                        <Minus className="w-4 h-4 mr-2" />
                        Dequeue
                      </Button>
                      <Button onClick={peekQueue} variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        Peek
                      </Button>
                      <Button onClick={checkQueueEmpty} variant="outline" size="sm">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        isEmpty
                      </Button>
                      <Button onClick={clearQueue} variant="outline" size="sm">
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Clear
                      </Button>
                    </div>

                    {queueFrontValue && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm font-medium text-green-800">Front Result: {queueFrontValue}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Queue Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Queue (FIFO)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-gray-600">
                      First In, First Out - Elements are added at the rear and removed from the front.
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Size:</span>
                        <Badge variant="secondary">{queue.length}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Front:</span>
                        <Badge variant="outline">{queue.length > 0 ? queue[0].value : "Empty"}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Rear:</span>
                        <Badge variant="outline">{queue.length > 0 ? queue[queue.length - 1].value : "Empty"}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Queue Operations History */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Operations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {queueOperations.length === 0 ? (
                        <p className="text-sm text-gray-500">No operations yet</p>
                      ) : (
                        queueOperations.map((op, index) => (
                          <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm">
                            <span className="font-medium capitalize">{op.type}</span>
                            <span className="text-gray-600">
                              {op.value && `"${op.value}"`}
                              {op.result && `→ ${op.result}`}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Queue Visualization */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Queue Visualization</CardTitle>
                    <p className="text-sm text-gray-600">
                      Elements are enqueued at the rear and dequeued from the front
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center space-y-6 min-h-96 justify-center p-4 bg-gray-50 rounded-lg relative">
                      {/* Queue visualization */}
                      <div className="flex items-center space-x-2 overflow-x-auto pb-4">
                        {queue.length === 0 ? (
                          <div className="flex items-center justify-center h-32 w-full text-gray-500">
                            <div className="text-center">
                              <ArrowRight className="w-12 h-12 mx-auto mb-2 opacity-30" />
                              <p className="text-sm">Queue is empty</p>
                            </div>
                          </div>
                        ) : (
                          <>
                            {/* Front indicator */}
                            <div className="flex flex-col items-center space-y-2 mr-4">
                              <span className="text-sm font-medium text-green-600">FRONT</span>
                              <ArrowDown className="w-4 h-4 text-green-600" />
                            </div>

                            {/* Queue elements */}
                            {queue.map((element, index) => (
                              <div
                                key={element.id}
                                className={`w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg flex items-center justify-center font-bold shadow-md transition-all duration-500 ${
                                  element.isAnimating && element.animationType === "enqueue"
                                    ? "transform scale-110 translate-y-4"
                                    : element.isAnimating && element.animationType === "dequeue"
                                      ? "transform scale-90 -translate-y-4 opacity-50"
                                      : ""
                                }`}
                              >
                                {element.value}
                              </div>
                            ))}

                            {/* Rear indicator */}
                            <div className="flex flex-col items-center space-y-2 ml-4">
                              <span className="text-sm font-medium text-blue-600">REAR</span>
                              <ArrowDown className="w-4 h-4 text-blue-600" />
                            </div>
                          </>
                        )}
                      </div>

                      {/* Operation arrows */}
                      {queue.length > 0 && (
                        <>
                          <div className="absolute top-4 left-8 flex items-center space-x-2">
                            <ArrowLeft className="w-5 h-5 text-red-600" />
                            <span className="text-sm text-red-600 font-medium">DEQUEUE</span>
                          </div>
                          <div className="absolute top-4 right-8 flex items-center space-x-2">
                            <span className="text-sm text-blue-600 font-medium">ENQUEUE</span>
                            <ArrowRight className="w-5 h-5 text-blue-600" />
                          </div>
                        </>
                      )}

                      {/* Flow direction indicator */}
                      <div className="flex items-center space-x-4 mt-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-gray-600">Front (Dequeue)</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-sm text-gray-600">Rear (Enqueue)</span>
                        </div>
                      </div>
                    </div>

                    {/* Queue Operations Code */}
                    <div className="mt-6 bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
                      <div className="space-y-1">
                        <div className="text-green-400">// Queue Operations (FIFO)</div>
                        <div>
                          <span className="text-blue-400">enqueue</span>(value) → Add to rear
                        </div>
                        <div>
                          <span className="text-red-400">dequeue</span>() → Remove from front
                        </div>
                        <div>
                          <span className="text-yellow-400">peek</span>() → View front element
                        </div>
                        <div>
                          <span className="text-purple-400">isEmpty</span>() → Check if empty
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
