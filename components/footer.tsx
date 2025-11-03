export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/5">
      <div className="container-page py-10 text-xs text-white/60">
        <div>© {new Date().getFullYear()} Where To Take — MVP preview. In production we’d use a proper backend for reviews and analytics.</div>
      </div>
    </footer>
  )
}

