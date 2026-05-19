const BackgroundPattern = () => {
  return (
    <span
      className="fixed inset-0 -z-10"
      style={{
        backgroundImage: `
          linear-gradient(var(--muted) 1px, transparent 1px),
          linear-gradient(90deg, var(--muted) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
      }}
    />
  )
}

export default BackgroundPattern
