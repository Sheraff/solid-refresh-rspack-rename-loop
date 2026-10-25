import Page from './Page.jsx'

// A component module that imports another component module. Both are transformed by
// solid-refresh, so both self-accept.
export function App() {
  return (
    <main>
      <Page />
    </main>
  )
}
