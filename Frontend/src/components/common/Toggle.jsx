export default function Toggle({ on, onChange, label }) {
  return (
    <button
      className={`toggle ${on ? 'on' : ''}`}
      onClick={onChange}
      aria-label={label}
      aria-pressed={on}
    >
      <span />
    </button>
  )
}
