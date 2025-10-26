import { useEffect, useState } from 'react'

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

  if (loading) return <p style={{ padding: 20 }}>Loading snacks...</p>
  if (error) return <p style={{ color: 'red', padding: 20 }}>Error: {error}</p>

  return (
    <div style={{
      fontFamily: 'system-ui, sans-serif',
      padding: 20,
      maxWidth: 600,
      margin: '0 auto'
    }}>
      <h1 style={{ textAlign: 'center' }}>🥨 BugBites Snack Ratings</h1>
      <ul style={{
        listStyle: 'none',
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }}>
        {snacks.map((s, i) => (
          <li key={i} style={{
            background: '#f9f9f9',
            padding: '12px 16px',
            borderRadius: 8,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <strong>{s.name}</strong> — <span>⭐ {s.rating}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
