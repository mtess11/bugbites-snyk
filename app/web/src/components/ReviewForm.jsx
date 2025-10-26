// File: app/web/src/components/ReviewForm.jsx
import { useState } from 'react'

export default function ReviewForm({ snackId, onSubmit }) {
  const [name, setName] = useState('')
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [useEval, setUseEval] = useState(false)
  const [loading, setLoading] = useState(false)

  function submit(e) {
    e.preventDefault()
    setLoading(true)

    let finalComment = comment

    if (useEval) {
      /* VULNERABLE: deliberate use of eval on user-supplied data */
      try {
        // eslint-disable-next-line no-eval
        const result = eval(comment) // DANGEROUS — demonstrates code execution from user input
        finalComment = String(result)
      } catch (e) {
        // fallback to original comment if eval fails
        finalComment = comment
      }
    }

    const payload = {
      id: snackId,
      name: name || 'anonymous',
      rating,
      comment: finalComment,
      date: (new Date()).toLocaleString()
    }

    onSubmit(payload)
    setName('')
    setComment('')
    setRating(5)
    setUseEval(false)
    setLoading(false)
  }

  return (
    <form onSubmit={submit} className="review-form">
      <div style={{display:'flex', gap:8}}>
        <input required placeholder="Your name" value={name} onChange={e=>setName(e.target.value)} />
        <select value={rating} onChange={e=>setRating(Number(e.target.value))}>
          <option value={5}>5</option>
          <option value={4}>4</option>
          <option value={3}>3</option>
          <option value={2}>2</option>
          <option value={1}>1</option>
        </select>
      </div>

      <textarea required placeholder="Share your thoughts (can include HTML!)" value={comment} onChange={e=>setComment(e.target.value)} />

      <label style={{display:'flex', alignItems:'center', gap:8}}>
        <input type="checkbox" checked={useEval} onChange={e=>setUseEval(e.target.checked)} />
        Debug: run eval() on comment before submit (dangerous)
      </label>

      <button className="btn" type="submit" disabled={loading}>{loading ? 'Saving…' : 'Add Review'}</button>
    </form>
  )
}
