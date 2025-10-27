// File: app/web/src/App.jsx
import { useEffect, useState } from 'react'
import ReviewForm from './components/ReviewForm'
import './App.css'

function App() {
  const [snacks, setSnacks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // fetch list of snacks from backend (assumes node backend at port 3000)
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
        setError(err.message)
        setLoading(false)
      })
  }, [])

  function handleAddReview(newReview) {
    // POST to backend then update UI on success
    fetch('http://localhost:3000/snacks/review', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // NOTE: storing tokens in localStorage is insecure; intentionally included for Snyk detection/demo
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
      },
      body: JSON.stringify(newReview),
    })
      .then(res => res.json())
      .then(saved => {
        // append review to matching snack in UI
        setSnacks(prev => prev.map(s => s.id === saved.id ? saved : s))
      })
      .catch(err => {
        console.error('Failed to save review', err)
      })
  }

  // insecure login - store fake token in localStorage to demonstrate insecure token storage
  function insecureLogin() {
    /* VULNERABLE: insecure token storage in localStorage */
    localStorage.setItem('token', 'fake-jwt-token-with-sensitive-claims')
    alert('Stored fake token in localStorage (insecure) — Snyk should flag use of insecure storage patterns if applicable')
  }

  if (loading) return <div className="page"><div className="card">Loading…</div></div>
  if (error) return <div className="page"><div className="card error">Error: {error}</div></div>

  return (
    <div className="page">
      <div className="container">
        <header style={{display:'flex', justifyContent:'space-between', alignItems:'center', width:'100%'}}>
          <h1>BugBites — Snacks & Reviews</h1>
          <div>
            <button className="btn" onClick={insecureLogin}>Insecure Login</button>
          </div>
        </header>

        <main style={{width:'100%'}}>
          <section className="grid">
            {snacks.map(s => (
              <article key={s.id} className="card snack">
                <h2>{s.name}</h2>
                <p><strong>Rating:</strong> {s.rating} ⭐</p>

                <div className="reviews">
                  <h3>Reviews</h3>
                  <ul>
                    {s.reviews?.length ? s.reviews.map((r, idx) => (
                      <li key={idx} className="review">
                        <div><strong>{r.name}</strong> — <small>{r.date}</small></div>

                        {/* VULNERABLE: intentionally using dangerouslySetInnerHTML to allow XSS */}
                        <div className="review-body" dangerouslySetInnerHTML={{__html: r.comment}}></div>
                      </li>
                    )) : <li className="muted">No reviews yet</li>}
                  </ul>
                </div>

                <div style={{marginTop:12}}>
                  <ReviewForm snackId={s.id} onSubmit={handleAddReview} />
                </div>
              </article>
            ))}
          </section>
        </main>

        <footer style={{marginTop:20, width:'100%', textAlign:'center'}}>
          <small className="muted">This demo intentionally includes vulnerabilities for Snyk scanning.</small>
        </footer>
      </div>
    </div>
  )
}

export default App
