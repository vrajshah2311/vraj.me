'use client'

export default function PrintButton() {
  return (
    <div className="no-print" style={{ position: 'fixed', top: 20, right: 20, zIndex: 100 }}>
      <button
        onClick={() => window.print()}
        style={{ padding: '8px 16px', background: '#000', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}
      >
        Print / Save PDF
      </button>
    </div>
  )
}
