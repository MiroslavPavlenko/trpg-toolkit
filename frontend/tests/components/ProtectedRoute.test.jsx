import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from '@/components/ProtectedRoute'

// Mock the useSession hook so we control session state in each test
vi.mock('@/hooks/useSession', () => ({
  useSession: vi.fn(),
}))

import { useSession } from '@/hooks/useSession'

const renderAt = (path) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <div>secret content</div>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<div>login page</div>} />
      </Routes>
    </MemoryRouter>,
  )

describe('<ProtectedRoute />', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders nothing while the session is still loading', () => {
    useSession.mockReturnValue({ session: null, loading: true })
    const { container } = renderAt('/')
    expect(container).toBeEmptyDOMElement()
    expect(screen.queryByText('secret content')).not.toBeInTheDocument()
    expect(screen.queryByText('login page')).not.toBeInTheDocument()
  })

  it('redirects to /login when there is no session', () => {
    useSession.mockReturnValue({ session: null, loading: false })
    renderAt('/')
    expect(screen.getByText('login page')).toBeInTheDocument()
    expect(screen.queryByText('secret content')).not.toBeInTheDocument()
  })

  it('renders the protected children when a session is present', () => {
    useSession.mockReturnValue({
      session: { user: { id: 'abc' } },
      loading: false,
    })
    renderAt('/')
    expect(screen.getByText('secret content')).toBeInTheDocument()
    expect(screen.queryByText('login page')).not.toBeInTheDocument()
  })
})
