import React, { Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'

const Dashboard = React.lazy(() => import('./pages/Dashboard'))
const Tasks = React.lazy(() => import('./pages/Tasks'))
const Timer = React.lazy(() => import('./pages/Timer'))
const DopamineMenu = React.lazy(() => import('./pages/DopamineMenu'))
const Progress = React.lazy(() => import('./pages/Progress'))

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  state: { error: Error | null } = { error: null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 40, color: 'white', fontFamily: 'Inter, sans-serif' }}>
          <h2 style={{ color: '#f87171', fontSize: 20 }}>Something went wrong</h2>
          <pre style={{ color: '#94a3b8', whiteSpace: 'pre-wrap', fontSize: 13, marginTop: 12 }}>
            {this.state.error.message}
          </pre>
          <pre style={{ color: '#64748b', fontSize: 11, marginTop: 8 }}>
            {this.state.error.stack}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}

const LoadingScreen = () => (
  <div className="flex items-center justify-center min-h-[80vh]">
    <div className="flex flex-col items-center gap-3">
      <div className="w-9 h-9 border-3 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
      <span className="text-sm text-primary-300 font-medium">Loading...</span>
    </div>
  </div>
)

export default function AppWrapper() {
  return (
    <BrowserRouter>
      <div className="min-h-screen text-white max-w-lg mx-auto relative">
        <ErrorBoundary>
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/timer" element={<Timer />} />
              <Route path="/dopamine" element={<DopamineMenu />} />
              <Route path="/progress" element={<Progress />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
        <Navbar />
      </div>
    </BrowserRouter>
  )
}
