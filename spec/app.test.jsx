import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, cleanup, waitFor } from '@testing-library/react'
import { ClientProvider } from '../src/app/contexts/ClientProvider'
import App from '../src/app/App'

const mockClient = {
  on: vi.fn((event, callback) => {
    if (event === 'app.registered') {
      setTimeout(callback, 0)
    }
  }),
  get: vi.fn().mockResolvedValue({ currentUser: { locale: 'en' } }),
  metadata: vi.fn().mockResolvedValue({ settings: { debug: true, gridXApiToken: 'mock token', gridXSerialNumberFieldId:'42' } }),
  context: vi.fn().mockResolvedValue({ location: 'ticket_sidebar' }),
  request: vi.fn().mockResolvedValue({  }),
  invoke: vi.fn()
}

describe('App Components', () => {
  beforeEach(() => {
    cleanup()
    vi.clearAllMocks()  
    document.body.innerHTML = '<div id="root"></div>'
    vi.stubGlobal('ZAFClient', {
      init: vi.fn().mockReturnValue(mockClient)
    })
  })

  it('renders App', async () => {
    render(
      <ClientProvider>
        <App />
      </ClientProvider>
    )

    expect(mockClient.on).toHaveBeenCalledWith('app.registered', expect.any(Function))

    await waitFor(() => expect(screen.getByText('Run Checks')).toBeDefined())
  })

})
