import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [snacks, setSnacks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // 👉 if your API runs locally: use port 3000
    // 👉 if running via Docker: use port 4000
    fetch('http://localhost:3000/snacks')
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok')
        return res.json()
      })
      .then(data => {
        setSnacks(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Fetch error:', err)
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) return <p className="loading">Loading snacks...</p>
  if (error) return <p className="error">Error: {error}</p>

  return (
    <div className="app-container">
      <h1 className="app-title">🥨 BugBites Snack Ratings</h1>
      <ul className="snack-list">
        {snacks.map((s, i) => (
          <li key={i} className="snack-item">
            <strong>{s.name}</strong> — <span>⭐ {s.rating}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App