export default function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-bg">
      <div className="container-page py-10 text-xs text-textDim">
        <div>© {new Date().getFullYear()} Dealme3 — MVP preview. In production we’d use a proper backend for reviews and analytics.</div>
      </div>
    </footer>
  )
}
