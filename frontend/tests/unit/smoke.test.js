import { describe, it, expect } from 'vitest'

describe('smoke', () => {
  it('runs the test suite', () => {
    expect(1 + 1).toBe(2)
  })

  it('has access to jsdom', () => {
    const el = document.createElement('div')
    el.textContent = 'hello'
    expect(el.textContent).toBe('hello')
  })
})
