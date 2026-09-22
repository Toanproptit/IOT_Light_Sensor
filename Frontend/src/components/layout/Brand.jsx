import { Lightbulb } from 'lucide-react'

export default function Brand() {
  return (
    <div className="brand">
      <div className="brand-mark"><Lightbulb size={20} strokeWidth={2.4} /></div>
      <div>
        <strong>Lumina</strong>
        <span>IoT Workspace</span>
      </div>
    </div>
  )
}
