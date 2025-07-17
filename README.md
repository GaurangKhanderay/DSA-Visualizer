# DSA Visualizer Pro

A comprehensive, interactive Data Structures and Algorithms visualization platform built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Features

### Complete Algorithm Coverage
- **Sorting Algorithms**: Bubble Sort, Quick Sort, Merge Sort, Insertion Sort, Selection Sort
- **Search Algorithms**: Linear Search, Binary Search, Jump Search
- **Tree Algorithms**: Binary Tree Traversals (In-order, Pre-order, Post-order, BFS, DFS)
- **Graph Algorithms**: BFS, DFS, Dijkstra's Algorithm
- **Data Structures**: Stacks (LIFO), Queues (FIFO), Priority Queues, Deques

### Interactive Features
- ⏯️ **Real-time Controls**: Play, pause, step-through, and speed control
- 🎨 **Beautiful Visualizations**: Smooth animations with 60fps performance
- 📊 **Live Statistics**: Track comparisons, swaps, time complexity, and progress
- 💻 **Code Highlighting**: Synchronized code execution with visual steps
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile

### Educational Content
- 📚 **Algorithm Explanations**: Detailed descriptions and complexity analysis
- 🎯 **Step-by-step Learning**: Clear descriptions for each algorithm step
- 🏆 **Progress Tracking**: Monitor learning progress across all modules
- 🎨 **Visual Legends**: Color-coded elements for easy understanding

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Animations**: CSS transitions and transforms
- **State Management**: React hooks and context

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/your-username/dsa-visualizer-pro.git
   cd dsa-visualizer-pro
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. **Run the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

\`\`\`
dsa-visualizer-pro/
├── app/                    # Next.js 14 App Router
│   ├── globals.css        # Global styles and animations
│   ├── layout.tsx         # Root layout component
│   ├── page.tsx          # Homepage with algorithm categories
│   ├── sorting/          # Sorting algorithms module
│   ├── searching/        # Search algorithms module
│   ├── trees/           # Tree algorithms module
│   ├── graphs/          # Graph algorithms module
│   └── stacks-queues/   # Stack & Queue data structures
├── components/
│   └── ui/              # Reusable UI components
├── lib/                 # Utility functions
├── public/             # Static assets
└── README.md
\`\`\`

## 🎯 Algorithm Modules

### 1. Sorting Algorithms (`/sorting`)
- **Bubble Sort**: O(n²) - Simple comparison-based sorting
- **Quick Sort**: O(n log n) - Efficient divide-and-conquer sorting
- **Merge Sort**: O(n log n) - Stable divide-and-conquer sorting
- **Insertion Sort**: O(n²) - Efficient for small datasets
- **Selection Sort**: O(n²) - Simple selection-based sorting

### 2. Search Algorithms (`/searching`)
- **Linear Search**: O(n) - Sequential search through elements
- **Binary Search**: O(log n) - Efficient search in sorted arrays

### 3. Tree Algorithms (`/trees`)
- **In-order Traversal**: Left → Root → Right
- **Pre-order Traversal**: Root → Left → Right  
- **Post-order Traversal**: Left → Right → Root
- **Breadth-First Search**: Level-by-level traversal
- **Depth-First Search**: Deep traversal using stack

### 4. Graph Algorithms (`/graphs`)
- **BFS**: Breadth-first graph traversal
- **DFS**: Depth-first graph traversal
- **Dijkstra's Algorithm**: Shortest path finding

### 5. Data Structures (`/stacks-queues`)
- **Stack**: LIFO (Last In, First Out) operations
- **Queue**: FIFO (First In, First Out) operations
- **Interactive Operations**: Push, Pop, Enqueue, Dequeue, Peek

## 🎨 Design Features

### Visual Elements
- **Gradient Backgrounds**: Beautiful color transitions
- **Smooth Animations**: 60fps performance with CSS transforms
- **Interactive Hover Effects**: Enhanced user experience
- **Responsive Grid Layouts**: Perfect on all screen sizes
- **Color-coded States**: Easy identification of algorithm states

### Accessibility
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Support**: ARIA labels and semantic HTML
- **High Contrast Mode**: Support for accessibility preferences
- **Reduced Motion**: Respects user motion preferences

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with zero configuration

### Other Platforms
\`\`\`bash
# Build for production
npm run build

# Start production server
npm start
\`\`\`

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   \`\`\`bash
   git checkout -b feature/amazing-feature
   \`\`\`
3. **Commit your changes**
   \`\`\`bash
   git commit -m 'Add amazing feature'
   \`\`\`
4. **Push to the branch**
   \`\`\`bash
   git push origin feature/amazing-feature
   \`\`\`
5. **Open a Pull Request**

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Radix UI** for accessible component primitives
- **Tailwind CSS** for utility-first styling
- **Lucide React** for beautiful icons
- **Next.js** for the amazing React framework
- **Vercel** for seamless deployment

## 📞 Support

- 📧 **Email**: support@dsavisualizer.pro
- 🐛 **Issues**: [GitHub Issues](https://github.com/your-username/dsa-visualizer-pro/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/your-username/dsa-visualizer-pro/discussions)

---

**Made with ❤️ for the programming community**

*Transform your understanding of algorithms through interactive visualization!*
