// @ts-nocheck
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import "./index.css"

// Import the generated route tree
import { routeTree } from './routeTree.gen'
import { Provider } from './provider'

// Create a new router instance
const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const tg = window.Telegram.WebApp
tg.ready()
tg.expand()
//tg.requestFullscreen()
tg.enableClosingConfirmation()



// Render the app
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  const isLoading = true

  root.render(
    //<StrictMode>
      <Provider>
        <RouterProvider router={router} />
      </Provider>
    //</StrictMode>,
  )
}
