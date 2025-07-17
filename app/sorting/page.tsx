"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Shuffle,
  ArrowLeft,
  BarChart3,
  Code,
  Timer,
  Zap,
  Plus,
  Trash2,
} from "lucide-react"
import Link from "next/link"

type SortingAlgorithm = "bubble" | "quick" | "merge" | "insertion" | "selection"

interface ArrayElement {
  value: number
  id: number
  isComparing?: boolean
  isSwapping?: boolean
  isSorted?: boolean
  isPivot?: boolean
  isSelected?: boolean
}

interface SortingStep {
  array: ArrayElement[]
  comparing?: number[]
  swapping?: number[]
  pivot?: number
  sorted?: number[]
  selected?: number[]
  description: string
  codeHighlight?: number
}

const algorithms = {
  bubble: {
    name: "Bubble Sort",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    description:
      "Repeatedly steps through the list, compares adjacent elements and swaps them if they're in the wrong order.",
    code: [
      "for (i = 0; i < n-1; i++) {",
      "  for (j = 0; j < n-i-1; j++) {",
      "    if (arr[j] > arr[j+1]) {",
      "      swap(arr[j], arr[j+1]);",
      "    }",
      "  }",
      "}",
    ],
    color: "from-blue-500 to-blue-600",
  },
  quick: {
    name: "Quick Sort",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(log n)",
    description:
      "Divides the array into smaller sub-arrays based on a pivot element, then recursively sorts the sub-arrays.",
    code: [
      "function quickSort(arr, low, high) {",
      "  if (low < high) {",
      "    pi = partition(arr, low, high);",
      "    quickSort(arr, low, pi - 1);",
      "    quickSort(arr, pi + 1, high);",
      "  }",
      "}",
    ],
    color: "from-purple-500 to-purple-600",
  },
  merge: {
    name: "Merge Sort",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    description: "Divides the array into halves, recursively sorts them, then merges the sorted halves back together.",
    code: [
      "function mergeSort(arr) {",
      "  if (arr.length <= 1) return arr;",
      "  const mid = Math.floor(arr.length / 2);",
      "  const left = mergeSort(arr.slice(0, mid));",
      "  const right = mergeSort(arr.slice(mid));",
      "  return merge(left, right);",
      "}",
    ],
    color: "from-green-500 to-green-600",
  },
  insertion: {
    name: "Insertion Sort",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    description: "Builds the sorted array one element at a time by inserting each element into its correct position.",
    code: [
      "for (i = 1; i < n; i++) {",
      "  key = arr[i];",
      "  j = i - 1;",
      "  while (j >= 0 && arr[j] > key) {",
      "    arr[j + 1] = arr[j];",
      "    j = j - 1;",
      "  }",
      "  arr[j + 1] = key;",
      "}",
    ],
    color: "from-orange-500 to-orange-600",
  },
  selection: {
    name: "Selection Sort",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    description:
      "Finds the minimum element and places it at the beginning, then repeats for the remaining unsorted portion.",
    code: [
      "for (i = 0; i < n-1; i++) {",
      "  min_idx = i;",
      "  for (j = i+1; j < n; j++) {",
      "    if (arr[j] < arr[min_idx])",
      "      min_idx = j;",
      "  }",
      "  swap(arr[min_idx], arr[i]);",
      "}",
    ],
    color: "from-red-500 to-red-600",
  },
}

export default function SortingVisualizer() {
  const [array, setArray] = useState<ArrayElement[]>([])
  const [algorithm, setAlgorithm] = useState<SortingAlgorithm>("bubble")
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState<SortingStep[]>([])
  const [speed, setSpeed] = useState([300])
  const [arraySize, setArraySize] = useState([20])
  const [comparisons, setComparisons] = useState(0)
  const [swaps, setSwaps] = useState(0)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [inputValue, setInputValue] = useState("")
  const [userInput, setUserInput] = useState("")
  const timeoutRef = useRef<NodeJS.Timeout>()
  const intervalRef = useRef<NodeJS.Timeout>()

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

    const newArray: ArrayElement[] = values.map((value, index) => ({
      value,
      id: index,
    }))

    setArray(newArray)
    setArraySize([values.length])
    setCurrentStep(0)
    setSteps([])
    setComparisons(0)
    setSwaps(0)
    setElapsedTime(0)
    setStartTime(null)
    setIsPlaying(false)
  }, [userInput])

  // Generate random array
  const generateRandomArray = useCallback(() => {
    const newArray: ArrayElement[] = []
    for (let i = 0; i < arraySize[0]; i++) {
      newArray.push({
        value: Math.floor(Math.random() * 300) + 10,
        id: i,
      })
    }
    setArray(newArray)
    setCurrentStep(0)
    setSteps([])
    setComparisons(0)
    setSwaps(0)
    setElapsedTime(0)
    setStartTime(null)
    setIsPlaying(false)
  }, [arraySize])

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

    const newArray = [...array, { value, id: array.length }]
    setArray(newArray)
    setInputValue("")
    setCurrentStep(0)
    setSteps([])
    setComparisons(0)
    setSwaps(0)
    setElapsedTime(0)
    setStartTime(null)
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
    setSwaps(0)
    setElapsedTime(0)
    setStartTime(null)
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
    setSwaps(0)
    setElapsedTime(0)
    setStartTime(null)
    setIsPlaying(false)
  }

  // Bubble Sort Implementation
  const bubbleSort = (arr: ArrayElement[]): SortingStep[] => {
    const steps: SortingStep[] = []
    const workingArray = [...arr]

    for (let i = 0; i < workingArray.length - 1; i++) {
      for (let j = 0; j < workingArray.length - i - 1; j++) {
        steps.push({
          array: workingArray.map((el, idx) => ({
            ...el,
            isComparing: idx === j || idx === j + 1,
            isSorted: idx >= workingArray.length - i,
          })),
          comparing: [j, j + 1],
          description: `Comparing elements ${workingArray[j].value} and ${workingArray[j + 1].value}`,
          codeHighlight: 2,
        })

        if (workingArray[j].value > workingArray[j + 1].value) {
          steps.push({
            array: workingArray.map((el, idx) => ({
              ...el,
              isSwapping: idx === j || idx === j + 1,
              isSorted: idx >= workingArray.length - i,
            })),
            swapping: [j, j + 1],
            description: `Swapping ${workingArray[j].value} and ${workingArray[j + 1].value}`,
            codeHighlight: 3,
          })

          const temp = workingArray[j]
          workingArray[j] = workingArray[j + 1]
          workingArray[j + 1] = temp
        }
      }

      steps.push({
        array: workingArray.map((el, idx) => ({
          ...el,
          isSorted: idx >= workingArray.length - i - 1,
        })),
        sorted: [workingArray.length - i - 1],
        description: `Element ${workingArray[workingArray.length - i - 1].value} is in correct position`,
        codeHighlight: 1,
      })
    }

    steps.push({
      array: workingArray.map((el) => ({ ...el, isSorted: true })),
      description: "Array is completely sorted! 🎉",
      codeHighlight: 0,
    })

    return steps
  }

  // Quick Sort Implementation
  const quickSort = (arr: ArrayElement[]): SortingStep[] => {
    const steps: SortingStep[] = []
    const workingArray = [...arr]

    const partition = (arr: ArrayElement[], low: number, high: number): number => {
      const pivot = arr[high].value
      let i = low - 1

      steps.push({
        array: arr.map((el, idx) => ({
          ...el,
          isPivot: idx === high,
        })),
        pivot: high,
        description: `Choosing pivot element: ${pivot}`,
        codeHighlight: 2,
      })

      for (let j = low; j < high; j++) {
        steps.push({
          array: arr.map((el, idx) => ({
            ...el,
            isComparing: idx === j,
            isPivot: idx === high,
          })),
          comparing: [j],
          description: `Comparing ${arr[j].value} with pivot ${pivot}`,
          codeHighlight: 2,
        })

        if (arr[j].value < pivot) {
          i++
          if (i !== j) {
            steps.push({
              array: arr.map((el, idx) => ({
                ...el,
                isSwapping: idx === i || idx === j,
                isPivot: idx === high,
              })),
              swapping: [i, j],
              description: `Swapping ${arr[i].value} and ${arr[j].value}`,
              codeHighlight: 3,
            })

            const temp = arr[i]
            arr[i] = arr[j]
            arr[j] = temp
          }
        }
      }

      steps.push({
        array: arr.map((el, idx) => ({
          ...el,
          isSwapping: idx === i + 1 || idx === high,
        })),
        swapping: [i + 1, high],
        description: `Placing pivot ${pivot} in correct position`,
        codeHighlight: 4,
      })

      const temp = arr[i + 1]
      arr[i + 1] = arr[high]
      arr[high] = temp

      return i + 1
    }

    const quickSortHelper = (arr: ArrayElement[], low: number, high: number) => {
      if (low < high) {
        const pi = partition(arr, low, high)
        quickSortHelper(arr, low, pi - 1)
        quickSortHelper(arr, pi + 1, high)
      }
    }

    quickSortHelper(workingArray, 0, workingArray.length - 1)

    steps.push({
      array: workingArray.map((el) => ({ ...el, isSorted: true })),
      description: "Array is completely sorted! 🎉",
    })

    return steps
  }

  // Merge Sort Implementation
  const mergeSort = (arr: ArrayElement[]): SortingStep[] => {
    const steps: SortingStep[] = []
    const workingArray = [...arr]

    const merge = (arr: ArrayElement[], left: number, mid: number, right: number) => {
      const leftArr = arr.slice(left, mid + 1)
      const rightArr = arr.slice(mid + 1, right + 1)
      let i = 0,
        j = 0,
        k = left

      while (i < leftArr.length && j < rightArr.length) {
        steps.push({
          array: arr.map((el, idx) => ({
            ...el,
            isComparing: idx === left + i || idx === mid + 1 + j,
          })),
          comparing: [left + i, mid + 1 + j],
          description: `Merging: comparing ${leftArr[i].value} and ${rightArr[j].value}`,
          codeHighlight: 3,
        })

        if (leftArr[i].value <= rightArr[j].value) {
          arr[k] = leftArr[i]
          i++
        } else {
          arr[k] = rightArr[j]
          j++
        }
        k++
      }

      while (i < leftArr.length) {
        arr[k] = leftArr[i]
        i++
        k++
      }

      while (j < rightArr.length) {
        arr[k] = rightArr[j]
        j++
        k++
      }

      steps.push({
        array: [...arr],
        description: `Merged subarray from ${left} to ${right}`,
        codeHighlight: 6,
      })
    }

    const mergeSortHelper = (arr: ArrayElement[], left: number, right: number) => {
      if (left < right) {
        const mid = Math.floor((left + right) / 2)

        steps.push({
          array: arr.map((el, idx) => ({
            ...el,
            isSelected: idx >= left && idx <= right,
          })),
          selected: Array.from({ length: right - left + 1 }, (_, i) => left + i),
          description: `Dividing array from ${left} to ${right}`,
          codeHighlight: 2,
        })

        mergeSortHelper(arr, left, mid)
        mergeSortHelper(arr, mid + 1, right)
        merge(arr, left, mid, right)
      }
    }

    mergeSortHelper(workingArray, 0, workingArray.length - 1)

    steps.push({
      array: workingArray.map((el) => ({ ...el, isSorted: true })),
      description: "Array is completely sorted! 🎉",
    })

    return steps
  }

  // Insertion Sort Implementation
  const insertionSort = (arr: ArrayElement[]): SortingStep[] => {
    const steps: SortingStep[] = []
    const workingArray = [...arr]

    for (let i = 1; i < workingArray.length; i++) {
      const key = workingArray[i]
      let j = i - 1

      steps.push({
        array: workingArray.map((el, idx) => ({
          ...el,
          isSelected: idx === i,
          isSorted: idx < i,
        })),
        selected: [i],
        description: `Selecting element ${key.value} to insert`,
        codeHighlight: 1,
      })

      while (j >= 0 && workingArray[j].value > key.value) {
        steps.push({
          array: workingArray.map((el, idx) => ({
            ...el,
            isComparing: idx === j,
            isSelected: idx === i,
            isSorted: idx < i,
          })),
          comparing: [j],
          description: `Comparing ${workingArray[j].value} with ${key.value}`,
          codeHighlight: 3,
        })

        workingArray[j + 1] = workingArray[j]
        j = j - 1
      }

      workingArray[j + 1] = key

      steps.push({
        array: workingArray.map((el, idx) => ({
          ...el,
          isSorted: idx <= i,
        })),
        description: `Inserted ${key.value} at position ${j + 1}`,
        codeHighlight: 7,
      })
    }

    steps.push({
      array: workingArray.map((el) => ({ ...el, isSorted: true })),
      description: "Array is completely sorted! 🎉",
    })

    return steps
  }

  // Selection Sort Implementation
  const selectionSort = (arr: ArrayElement[]): SortingStep[] => {
    const steps: SortingStep[] = []
    const workingArray = [...arr]

    for (let i = 0; i < workingArray.length - 1; i++) {
      let min_idx = i

      steps.push({
        array: workingArray.map((el, idx) => ({
          ...el,
          isSelected: idx === i,
          isSorted: idx < i,
        })),
        selected: [i],
        description: `Finding minimum element from position ${i}`,
        codeHighlight: 1,
      })

      for (let j = i + 1; j < workingArray.length; j++) {
        steps.push({
          array: workingArray.map((el, idx) => ({
            ...el,
            isComparing: idx === j || idx === min_idx,
            isSelected: idx === i,
            isSorted: idx < i,
          })),
          comparing: [j, min_idx],
          description: `Comparing ${workingArray[j].value} with current minimum ${workingArray[min_idx].value}`,
          codeHighlight: 3,
        })

        if (workingArray[j].value < workingArray[min_idx].value) {
          min_idx = j
        }
      }

      if (min_idx !== i) {
        steps.push({
          array: workingArray.map((el, idx) => ({
            ...el,
            isSwapping: idx === i || idx === min_idx,
            isSorted: idx < i,
          })),
          swapping: [i, min_idx],
          description: `Swapping ${workingArray[i].value} with minimum ${workingArray[min_idx].value}`,
          codeHighlight: 6,
        })

        const temp = workingArray[i]
        workingArray[i] = workingArray[min_idx]
        workingArray[min_idx] = temp
      }

      steps.push({
        array: workingArray.map((el, idx) => ({
          ...el,
          isSorted: idx <= i,
        })),
        description: `Element ${workingArray[i].value} is in correct position`,
        codeHighlight: 0,
      })
    }

    steps.push({
      array: workingArray.map((el) => ({ ...el, isSorted: true })),
      description: "Array is completely sorted! 🎉",
    })

    return steps
  }

  // Generate sorting steps based on selected algorithm
  const generateSteps = useCallback(() => {
    if (array.length === 0) return

    let newSteps: SortingStep[] = []

    switch (algorithm) {
      case "bubble":
        newSteps = bubbleSort(array)
        break
      case "quick":
        newSteps = quickSort(array)
        break
      case "merge":
        newSteps = mergeSort(array)
        break
      case "insertion":
        newSteps = insertionSort(array)
        break
      case "selection":
        newSteps = selectionSort(array)
        break
    }

    setSteps(newSteps)
    setCurrentStep(0)
    setComparisons(0)
    setSwaps(0)
    setElapsedTime(0)
    setStartTime(null)
  }, [array, algorithm])

  // Animation control
  const playAnimation = useCallback(() => {
    if (currentStep >= steps.length - 1) {
      setIsPlaying(false)
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }

    timeoutRef.current = setTimeout(() => {
      setCurrentStep((prev) => {
        const nextStep = prev + 1
        if (nextStep >= steps.length) {
          setIsPlaying(false)
          if (intervalRef.current) clearInterval(intervalRef.current)
          return prev
        }

        const step = steps[nextStep]
        if (step.comparing) setComparisons((prev) => prev + 1)
        if (step.swapping) setSwaps((prev) => prev + 1)

        return nextStep
      })
    }, 1100 - speed[0])
  }, [currentStep, steps, speed])

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
    if (!startTime) {
      setStartTime(Date.now())
      intervalRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 100)
      }, 100)
    }
  }

  const handlePause = () => {
    setIsPlaying(false)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (intervalRef.current) clearInterval(intervalRef.current)
  }

  const handleReset = () => {
    setIsPlaying(false)
    setCurrentStep(0)
    setComparisons(0)
    setSwaps(0)
    setElapsedTime(0)
    setStartTime(null)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (intervalRef.current) clearInterval(intervalRef.current)
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
      if (step.comparing) setComparisons((prev) => prev + 1)
      if (step.swapping) setSwaps((prev) => prev + 1)
    }
  }

  // Effects
  useEffect(() => {
    generateRandomArray()
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
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const currentArray = steps.length > 0 && currentStep < steps.length ? steps[currentStep].array : array
  const maxValue = Math.max(...(currentArray.length > 0 ? currentArray.map((el) => el.value) : [100]))

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
                className={`w-10 h-10 bg-gradient-to-br ${algorithms[algorithm].color} rounded-xl flex items-center justify-center shadow-lg`}
              >
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Sorting Algorithms</h1>
                <p className="text-sm text-gray-600">Interactive Sorting Visualization</p>
              </div>
            </div>
            <Badge className={`bg-gradient-to-r ${algorithms[algorithm].color} text-white px-3 py-1`}>
              {algorithms[algorithm].name}
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Controls Panel */}
          <div className="lg:col-span-1 space-y-4">
            {/* Array Input Controls */}
            <Card className="shadow-lg border-0">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-blue-600" />
                  Array Input
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
                      <label className="text-sm font-medium text-gray-700">Enter numbers (comma/space separated)</label>
                      <Input
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="e.g., 64, 34, 25, 12, 22, 11, 90"
                        className="border-2 hover:border-blue-300 transition-colors"
                      />
                      <Button onClick={generateFromInput} className="w-full bg-gradient-to-r from-blue-500 to-blue-600">
                        Create Array
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Add Single Element</label>
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
                        <Button onClick={addElement} size="sm" className="bg-green-500 hover:bg-green-600">
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
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Array Size: {arraySize[0]}</label>
                      <Slider
                        value={arraySize}
                        onValueChange={setArraySize}
                        max={50}
                        min={5}
                        step={1}
                        className="w-full"
                      />
                    </div>
                    <Button
                      onClick={generateRandomArray}
                      className="w-full bg-gradient-to-r from-purple-500 to-purple-600"
                    >
                      <Shuffle className="w-4 h-4 mr-2" />
                      Generate Random Array
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Algorithm Controls */}
            <Card className="shadow-lg border-0">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Algorithm Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Algorithm</label>
                  <Select value={algorithm} onValueChange={(value: SortingAlgorithm) => setAlgorithm(value)}>
                    <SelectTrigger className="border-2 hover:border-blue-300 transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(algorithms).map(([key, algo]) => (
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

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Speed: {1100 - speed[0]}ms</label>
                  <Slider value={speed} onValueChange={setSpeed} max={1000} min={50} step={50} className="w-full" />
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
                  <div className={`w-5 h-5 bg-gradient-to-r ${algorithms[algorithm].color} rounded mr-2`}></div>
                  {algorithms[algorithm].name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 leading-relaxed">{algorithms[algorithm].description}</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-xs text-blue-600 font-medium">Time Complexity</div>
                    <Badge variant="outline" className="mt-1 border-blue-200 text-blue-700">
                      {algorithms[algorithm].timeComplexity}
                    </Badge>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-xs text-purple-600 font-medium">Space Complexity</div>
                    <Badge variant="outline" className="mt-1 border-purple-200 text-purple-700">
                      {algorithms[algorithm].spaceComplexity}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card className="shadow-lg border-0">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center">
                  <Timer className="w-5 h-5 mr-2 text-green-600" />
                  Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Elements:</span>
                  <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">
                    {array.length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Comparisons:</span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    {comparisons}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Swaps:</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    {swaps}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Time:</span>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                    {(elapsedTime / 1000).toFixed(1)}s
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
            {/* Array Visualization */}
            <Card className="shadow-lg border-0">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>Array Visualization</span>
                  <Badge className={`bg-gradient-to-r ${algorithms[algorithm].color} text-white`}>
                    {array.length} elements
                  </Badge>
                </CardTitle>
                {steps.length > 0 && currentStep < steps.length && (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-gray-700">{steps[currentStep].description}</p>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="h-96 flex items-end justify-center space-x-1 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-x-auto">
                  {currentArray.length === 0 ? (
                    <div className="flex items-center justify-center h-full w-full text-gray-500">
                      <div className="text-center">
                        <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-30" />
                        <p className="text-lg font-medium">No array to visualize</p>
                        <p className="text-sm">Create an array using the input controls</p>
                      </div>
                    </div>
                  ) : (
                    currentArray.map((element, index) => (
                      <div
                        key={element.id}
                        className={`flex flex-col items-center transition-all duration-500 ${
                          element.isComparing ? "transform -translate-y-3 scale-105" : ""
                        } ${element.isSwapping ? "transform translate-y-2 scale-110" : ""}`}
                      >
                        <div
                          className={`w-8 rounded-t-lg transition-all duration-500 shadow-lg ${
                            element.isSorted
                              ? "bg-gradient-to-t from-green-500 to-green-400 shadow-green-200"
                              : element.isSwapping
                                ? "bg-gradient-to-t from-red-500 to-red-400 shadow-red-200"
                                : element.isComparing
                                  ? "bg-gradient-to-t from-yellow-500 to-yellow-400 shadow-yellow-200"
                                  : element.isPivot
                                    ? "bg-gradient-to-t from-purple-500 to-purple-400 shadow-purple-200"
                                    : element.isSelected
                                      ? "bg-gradient-to-t from-orange-500 to-orange-400 shadow-orange-200"
                                      : `bg-gradient-to-t ${algorithms[algorithm].color} shadow-blue-200`
                          }`}
                          style={{
                            height: `${(element.value / maxValue) * 280}px`,
                            minHeight: "30px",
                          }}
                        />
                        <span className="text-xs mt-2 font-mono font-bold text-gray-700 bg-white px-2 py-1 rounded shadow-sm">
                          {element.value}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                {/* Legend */}
                {currentArray.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-4 mt-6 p-4 bg-white rounded-lg border">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded"></div>
                      <span className="text-xs font-medium text-gray-600">Unsorted</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-gradient-to-r from-yellow-500 to-yellow-400 rounded"></div>
                      <span className="text-xs font-medium text-gray-600">Comparing</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-red-400 rounded"></div>
                      <span className="text-xs font-medium text-gray-600">Swapping</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-purple-400 rounded"></div>
                      <span className="text-xs font-medium text-gray-600">Pivot</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-green-400 rounded"></div>
                      <span className="text-xs font-medium text-gray-600">Sorted</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Code Display */}
            <Card className="shadow-lg border-0">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center">
                  <Code className="w-5 h-5 mr-2 text-gray-600" />
                  Algorithm Implementation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 p-6 rounded-xl font-mono text-sm overflow-x-auto shadow-inner">
                  {algorithms[algorithm].code.map((line, index) => (
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
