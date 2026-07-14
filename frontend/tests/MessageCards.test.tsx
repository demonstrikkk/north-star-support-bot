import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MessageCard } from '../src/components/MessageCards'


describe('MessageCard', () => {
  it('renders exact order details', () => {
    render(
      <MessageCard
        payload={{
          type: 'order_status',
          title: 'Order #111',
          status: 'Shipped',
          detail: 'Arriving tomorrow',
          data: { valid: true, step: 2 },
        }}
      />,
    )
    expect(screen.getByText('Order #111')).toBeInTheDocument()
    expect(screen.getAllByText('Shipped').length).toBeGreaterThan(0)
    expect(screen.getByText('Arriving tomorrow')).toBeInTheDocument()
  })

  it('renders exact shipping times', () => {
    render(
      <MessageCard
        payload={{
          type: 'shipping_card',
          title: 'Shipping information',
          data: { standard: '3–5 business days', expedited: '1–2 business days' },
        }}
      />,
    )
    expect(screen.getByText('3–5 business days')).toBeInTheDocument()
    expect(screen.getByText('1–2 business days')).toBeInTheDocument()
  })
})
