import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from '../src/App'

const welcome = {
  session_id: 'test-session',
  intent: 'main_menu',
  state: 'main_menu',
  messages: [
    {
      type: 'welcome',
      title: 'Hi there! I’m North Star Support Bot.',
      text: 'I can help track orders, explain returns, recommend outdoor gear categories, answer shipping questions, or connect you with a simulated live agent.',
      subtitle: 'How can I help today?',
      status: null,
      detail: null,
      data: {},
    },
  ],
  actions: [
    { label: 'Track my order', value: 'intent_order_tracking', icon: 'package', variant: 'primary' },
  ],
}

describe('App', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify(welcome), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })))
    vi.stubGlobal('crypto', { randomUUID: () => 'test-session' })
    window.history.pushState({}, '', '/')
    window.sessionStorage.clear()
  })

  it('renders the support workspace and welcome flow', async () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'North Star Support Bot' })).toBeInTheDocument()
    expect(await screen.findByText('Hi there! I’m North Star Support Bot.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Track my order' })).toBeInTheDocument()
  })
})
