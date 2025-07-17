"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Pause, RotateCcw, SkipForward, Shuffle, ArrowLeft, Search, Target, Plus, Trash2 } from "lucide-react"
import Link from "next/link"

type SearchAlgorithm = "linear" | "binary"

interface SearchElement {
  value: number
  id: number
  isChecking?: boolean
  isFound?: boolean
  isInRange?: boolean
}

interface SearchStep {
  array: SearchElement[]
  checking?: number
  found?: number
  left?: number
  right?: number
  mid?: number
  description: string
  codeHighlight?: number
}

const algorithms = {
  linear: {
    name: "Linear Search",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    description: "Searches through each element sequentially until the target is found or the end is reached.",
    code: ["for (i = 0; i < n; i++) {", "  if (arr[i] == target) {", "    return i;", "  }", "}", "return -1;"],
  },
  binary: {
    name: "Binary Search",
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
    description: "Efficiently searches a sorted array by repeatedly dividing the search interval in half.",
    code: [
      "left = 0, right = n - 1;",
      "while (left <= right) {",
      "  mid = left + (right - left) / 2;",
      "  if (arr[mid] == target) return mid;",
      "  if (arr[mid] < target) left = mid + 1;",
      "  else right = mid - 1;",
      "}",
      "return -1;",
    ],
  },
}

export default function SearchingVisualizer() {
  const [array, setArray] = useState<SearchElement[]>([])
  const [algorithm, setAlgorithm] = useState<SearchAlgorithm>("linear")
  const [target, setTarget] = useState<number>(50)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState<SearchStep[]>([])
  const [comparisons, setComparisons] = useState(0)
  const [found, setFound] = useState<boolean | null>(null)
  const [userInput, setUserInput] = useState("")
  const [inputValue, setInputValue] = useState("")
  const timeoutRef = useRef<NodeJS.Timeout>()

  // Generate array from user input
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

    if (values.length > 50) {
      alert("Maximum 50 elements allowed")
      return
    }

    // Sort array if binary search is selected
    const sortedValues = algorithm === "binary" ? [...values].sort((a, b) => a - b) : values

    const newArray: SearchElement[] = sortedValues.map((value, index) => ({
      value,
      id: index,
    }))

    setArray(newArray)
    setCurrentStep(0)
    setSteps([])
    setComparisons(0)
    setFound(null)
    setIsPlaying(false)

    // Set target to first element if not already set
    if (!target || target === 50) {
      setTarget(sortedValues[0] || 50)
    }
  }, [userInput, algorithm, target])

  // Generate random array
  const generateRandomArray = useCallback(() => {
    const newArray: SearchElement[] = []
    const size = 20

    if (algorithm === "binary") {
      // Generate sorted array for binary search
      for (let i = 0; i < size; i++) {
        newArray.push({
          value: (i + 1) * 5,
          id: i,
        })
      }
    } else {
      // Generate random array for linear search
      for (let i = 0; i < size; i++) {
        newArray.push({
          value: Math.floor(Math.random() * 100) + 1,
          id: i,
        })
      }
    }

    setArray(newArray)
    setCurrentStep(0)
    setSteps([])
    setComparisons(0)
    setFound(null)
    setIsPlaying(false)

    // Set a random target from the array
    if (newArray.length > 0) {
      const randomIndex = Math.floor(Math.random() * newArray.length)
      setTarget(newArray[randomIndex].value)
    }
  }, [algorithm])

  // Add single element
  const addElement = () => {
    const value = Number.parseInt(inputValue)
    if (isNaN(value) || value < 1 || value > 999) {
      alert("Please enter a valid number between 1 and 999")
      return
    }

    if (array.length >= 50) {
      alert("Maximum 50 elements allowed")
      return
    }

    let newArray = [...array, { value, id: array.length }]

    // Sort if binary search
    if (algorithm === "binary") {
      newArray.sort((a, b) => a.value - b.value)
      // Reassign IDs after sorting
      newArray = newArray.map((el, index) => ({ ...el, id: index }))
    }

    setArray(newArray)
    setInputValue("")
    setCurrentStep(0)
    setSteps([])
    setComparisons(0)
    setFound(null)
    setIsPlaying(false)
  }

  // Remove last element
  const removeElement = () => {
    if (array.length === 0) return

    const newArray = array.slice(0, -1)
    setArray(newArray)
    setCurrentStep(0)
    setSteps([])
    setComparisons(0)
    setFound(null)
    setIsPlaying(false)
  }

  // Clear array
  const clearArray = () => {
    setArray([])
    setUserInput("")
    setInputValue("")
    setCurrentStep(0)
    setSteps([])
    setComparisons(0)
    setFound(null)
    setIsPlaying(false)
  }

  // Linear Search Implementation
  const linearSearch = (arr: SearchElement[], target: number): SearchStep[] => {
    const steps: SearchStep[] = []
    const workingArray = [...arr]

    for (let i = 0; i < workingArray.length; i++) {
      // Checking step
      steps.push({
        array: workingArray.map((el, idx) => ({
          ...el,
          isChecking: idx === i,
        })),
        checking: i,
        description: `Checking element at index ${i}: ${workingArray[i].value}`,
        codeHighlight: 1,
      })

      if (workingArray[i].value === target) {
        // Found step
        steps.push({
          array: workingArray.map((el, idx) => ({
            ...el,
            isFound: idx === i,
          })),
          found: i,
          description: `Target ${target} found at index ${i}! 🎉`,
          codeHighlight: 2,
        })
        return steps
      }
    }

    // Not found
    steps.push({
      array: workingArray,
      description: `Target ${target} not found in the array`,
      codeHighlight: 5,
    })

    return steps
  }

  // Binary Search Implementation
  const binarySearch = (arr: SearchElement[], target: number): SearchStep[] => {
    const steps: SearchStep[] = []
    const workingArray = [...arr]
    let left = 0
    let right = workingArray.length - 1

    while (left <= right) {
      const mid = Math.floor(left + (right - left) / 2)

      // Show current range
      steps.push({
        array: workingArray.map((el, idx) => ({
          ...el,
          isInRange: idx >= left && idx <= right,
          isChecking: idx === mid,
        })),
        left,
        right,
        mid,
        description: `Searching in range [${left}, ${right}], checking middle element at index ${mid}: ${workingArray[mid].value}`,
        codeHighlight: 2,
      })

      if (workingArray[mid].value === target) {
        // Found step
        steps.push({
          array: workingArray.map((el, idx) => ({
            ...el,
            isFound: idx === mid,
          })),
          found: mid,
          description: `Target ${target} found at index ${mid}! 🎉`,
          codeHighlight: 4,
        })
        return steps
      }

      if (workingArray[mid].value < target) {
        left = mid + 1
        steps.push({
          array: workingArray.map((el, idx) => ({
            ...el,
            isInRange: idx >= left && idx <= right,
          })),
          left,
          right,
          description: `${workingArray[mid].value} < ${target}, searching right half`,
          codeHighlight: 5,
        })
      } else {
        right = mid - 1
        steps.push({
          array: workingArray.map((el, idx) => ({
            ...el,
            isInRange: idx >= left && idx <= right,
          })),
          left,
          right,
          description: `${workingArray[mid].value} > ${target}, searching left half`,
          codeHighlight: 6,
        })
      }
    }

    // Not found
    steps.push({
      array: workingArray,
      description: `Target ${target} not found in the array`,
      codeHighlight: 8,
    })

    return steps
  }

  // Generate search steps
  const generateSteps = useCallback(() => {
    if (array.length === 0) return

    let newSteps: SearchStep[] = []

    switch (algorithm) {
      case "linear":
        newSteps = linearSearch(array, target)
        break
      case "binary":
        newSteps = binarySearch(array, target)
        break
    }

    setSteps(newSteps)
    setCurrentStep(0)
    setComparisons(0)
    setFound(null)
  }, [array, algorithm, target])

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

        // Update statistics
        const step = steps[nextStep]
        if (step.checking !== undefined) setComparisons((prev) => prev + 1)
        if (step.found !== undefined) setFound(true)

        return nextStep
      })
    }, 1000)
  }, [currentStep, steps])

  // Control functions
  const handlePlay = () => {
    if (array.length === 0) {
      alert("Please create an array first!")
      return
    }
    if (steps.length === 0) {
      generateSteps()
    }
    setIsPlaying(true)
  }

  const handlePause = () => {
    setIsPlaying(false)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  const handleReset = () => {
    setIsPlaying(false)
    setCurrentStep(0)
    setComparisons(0)
    setFound(null)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  const handleStep = () => {
    if (array.length === 0) {
      alert("Please create an array first!")
      return
    }
    if (steps.length === 0) {
      generateSteps()
      return
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1)
      const step = steps[currentStep + 1]
      if (step.checking !== undefined) setComparisons((prev) => prev + 1)
      if (step.found !== undefined) setFound(true)
    }
  }

  // Effects
  useEffect(() => {
    generateRandomArray()
  }, [algorithm])

  useEffect(() => {
    if (isPlaying) {
      playAnimation()
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [isPlaying, playAnimation])

  const currentArray = steps.length > 0 && currentStep < steps.length ? steps[currentStep].array : array

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
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <Search className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Search Algorithms</h1>
                <p className="text-sm text-gray-600">Interactive Search Visualization</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Controls Panel */}
          <div className="lg:col-span-1 space-y-4">
            {/* Array Input Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Array Input</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="user-input" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="user-input">User Input</TabsTrigger>
                    <TabsTrigger value="random">Random</TabsTrigger>
                  </TabsList>

                  <TabsContent value="user-input" className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Enter numbers (comma/space separated)
                        {algorithm === "binary" && (
                          <span className="text-xs text-blue-600 block">Will be automatically sorted</span>
                        )}
                      </label>
                      <Input
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="e.g., 64, 34, 25, 12, 22, 11, 90"
                      />
                      <Button onClick={generateFromInput} className="w-full">
                        Create Array
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Add Single Element</label>
                      <div className="flex space-x-2">
                        <Input
                          type="number"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          placeholder="Enter number"
                          min="1"
                          max="999"
                        />
                        <Button onClick={addElement} size="sm">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button onClick={removeElement} variant="outline" size="sm" className="flex-1 bg-transparent">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove Last
                      </Button>
                      <Button onClick={clearArray} variant="outline" size="sm" className="flex-1 bg-transparent">
                        Clear All
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="random" className="space-y-4">
                    <Button onClick={generateRandomArray} className="w-full">
                      <Shuffle className="w-4 h-4 mr-2" />
                      Generate Random Array
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Search Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Search Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Algorithm</label>
                  <Select value={algorithm} onValueChange={(value: SearchAlgorithm) => setAlgorithm(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(algorithms).map(([key, algo]) => (
                        <SelectItem key={key} value={key}>
                          {algo.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Target Value</label>
                  <Input
                    type="number"
                    value={target}
                    onChange={(e) => setTarget(Number(e.target.value))}
                    min="1"
                    max="999"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {!isPlaying ? (
                    <Button onClick={handlePlay} size="sm">
                      <Play className="w-4 h-4 mr-2" />
                      Search
                    </Button>
                  ) : (
                    <Button onClick={handlePause} size="sm">
                      <Pause className="w-4 h-4 mr-2" />
                      Pause
                    </Button>
                  )}
                  <Button onClick={handleStep} variant="outline" size="sm">
                    <SkipForward className="w-4 h-4 mr-2" />
                    Step
                  </Button>
                  <Button onClick={handleReset} variant="outline" size="sm" className="col-span-2 bg-transparent">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Algorithm Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{algorithms[algorithm].name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600">{algorithms[algorithm].description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Time:</span>
                    <Badge variant="outline">{algorithms[algorithm].timeComplexity}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Space:</span>
                    <Badge variant="outline">{algorithms[algorithm].spaceComplexity}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Elements:</span>
                  <Badge variant="secondary">{array.length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Target:</span>
                  <Badge variant="secondary" className="flex items-center">
                    <Target className="w-3 h-3 mr-1" />
                    {target}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Comparisons:</span>
                  <Badge variant="secondary">{comparisons}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Status:</span>
                  <Badge variant={found === true ? "default" : found === false ? "destructive" : "secondary"}>
                    {found === true ? "Found" : found === false ? "Not Found" : "Searching"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Step:</span>
                  <Badge variant="secondary">
                    {currentStep} / {steps.length}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Visualization Area */}
          <div className="lg:col-span-3 space-y-4">
            {/* Array Visualization */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Array Visualization</CardTitle>
                {steps.length > 0 && currentStep < steps.length && (
                  <p className="text-sm text-gray-600">{steps[currentStep].description}</p>
                )}
              </CardHeader>
              <CardContent>
                {currentArray.length === 0 ? (
                  <div className="flex items-center justify-center h-64 text-gray-500">
                    <div className="text-center">
                      <Search className="w-16 h-16 mx-auto mb-4 opacity-30" />
                      <p className="text-lg font-medium">No array to search</p>
                      <p className="text-sm">Create an array using the input controls</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2 p-4 bg-gray-50 rounded-lg overflow-x-auto">
                    {currentArray.map((element, index) => (
                      <div
                        key={element.id}
                        className={`flex flex-col items-center transition-all duration-500 ${
                          element.isChecking ? "transform -translate-y-2" : ""
                        }`}
                      >
                        <div
                          className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold transition-all duration-300 ${
                            element.isFound
                              ? "bg-green-500 ring-4 ring-green-300"
                              : element.isChecking
                                ? "bg-yellow-500 ring-2 ring-yellow-300"
                                : element.isInRange
                                  ? "bg-blue-400"
                                  : "bg-gray-400"
                          }`}
                        >
                          {element.value}
                        </div>
                        <span className="text-xs mt-1 text-gray-500">{index}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Range indicators for binary search */}
                {algorithm === "binary" &&
                  steps.length > 0 &&
                  currentStep < steps.length &&
                  currentArray.length > 0 && (
                    <div className="mt-4 flex justify-center space-x-4 text-sm">
                      {steps[currentStep].left !== undefined && (
                        <div className="flex items-center space-x-1">
                          <div className="w-3 h-3 bg-blue-500 rounded"></div>
                          <span>Search Range</span>
                        </div>
                      )}
                      {steps[currentStep].checking !== undefined && (
                        <div className="flex items-center space-x-1">
                          <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                          <span>Checking</span>
                        </div>
                      )}
                      {steps[currentStep].found !== undefined && (
                        <div className="flex items-center space-x-1">
                          <div className="w-3 h-3 bg-green-500 rounded"></div>
                          <span>Found</span>
                        </div>
                      )}
                    </div>
                  )}
              </CardContent>
            </Card>

            {/* Code Display */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Search className="w-5 h-5 mr-2" />
                  Algorithm Code
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  {algorithms[algorithm].code.map((line, index) => (
                    <div
                      key={index}
                      className={`py-1 px-2 rounded ${
                        steps.length > 0 && currentStep < steps.length && steps[currentStep].codeHighlight === index
                          ? "bg-yellow-600 bg-opacity-30"
                          : ""
                      }`}
                    >
                      <span className="text-gray-500 mr-4">{index + 1}</span>
                      {line}
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
