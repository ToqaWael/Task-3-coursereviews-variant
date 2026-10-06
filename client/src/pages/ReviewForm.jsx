import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api'

// TODO: build the Write Review page — see README.md "Your task".
// This page is already routed at /reviews/new (write) and /reviews/:id (edit),
// and both routes are wrapped in <ProtectedRoute>.

const defaults = { courseCode: '', rating: 5, comment: '' }

export default function ReviewForm() {
  const nav = useNavigate()
  const { id } = useParams()
  const [form, setForm] = useState(defaults)
  const [error, setError] = useState('')

  // TODO (edit mode): when there is an `id`, load the review and fill the form.
 useEffect(() => {
  if (!id) return
  api.get(`/reviews/${id}`)
    .then(({ data }) => {
      data = data.review || data
      console.log('review:', data)
      setForm({
        courseCode: data.courseCode ?? '',
        rating: data.rating ?? 5,
        comment: data.comment ?? ''
      })
    })
    .catch(err => setError(err.response?.data?.message || 'Failed to load review'))
}, [id])

  // TODO: update `form` when an input changes (rating should be a number).
 function onChange(e) {
    const { name, value } = e.target
    setForm((f) => ({
      ...f,
      [name]: name === 'rating' ? Number(value) : value,
    }))
  }

  // TODO: POST a new review, or PATCH the existing one when editing,
  // then go back to /reviews. Show the server's error message on failure.
 async function onSubmit(e) {
    e.preventDefault()
    setError('')
    // Note: no `reviewedBy` — the server takes the reviewer from the token.
    const payload = {
      courseCode: form.courseCode,
      rating: form.rating,
      comment: form.comment,
    }
    try {
      if (id) {
        await api.patch(`/reviews/${id}`, payload)
      } else {
        await api.post('/reviews', payload)
      }
      nav('/reviews')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    }
  }
 
  return (
    <div className="max-w-lg mx-auto card">
      <h1 className="text-xl font-semibold mb-4">{id ? 'Edit' : 'Write'} Review</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        {/* TODO 1: course code input, rating select (1-5) and comment textarea */}
        <div>
          <label htmlFor="courseCode" className="block text-sm font-medium mb-1">
            Course code
          </label>
          <input
            id="courseCode"
            name="courseCode"
            type="text"
            className="w-full border rounded px-3 py-2"
            placeholder="CS101"
            value={form.courseCode}
            onChange={onChange}
            required
          />
        </div>
 
        <div>
          <label htmlFor="rating" className="block text-sm font-medium mb-1">
            Rating
          </label>
          <select
            id="rating"
            name="rating"
            className="w-full border rounded px-3 py-2"
            value={form.rating}
            onChange={onChange}
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
 
        <div>
          <label htmlFor="comment" className="block text-sm font-medium mb-1">
            Comment (optional)
          </label>
          <textarea
            id="comment"
            name="comment"
            rows={4}
            className="w-full border rounded px-3 py-2"
            value={form.comment}
            onChange={onChange}
          />
        </div>
 
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button className="btn" type="submit">Save</button>
      </form>
    </div>
  )
}
 
