import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
              Vite + React
            </div>
            <h1 className="block mt-1 text-lg leading-tight font-medium text-black">
              Hello World! 🚀
            </h1>
            <p className="mt-2 text-gray-500">
              This is a simple Vite + React website deployed on Vercel.
            </p>
            <div className="mt-6">
              <button
                onClick={() => setCount((count) => count + 1)}
                className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
              >
                Count is {count}
              </button>
            </div>
            <div className="mt-4 text-sm text-gray-400">
              Built with Vite + React and deployed on Vercel
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App