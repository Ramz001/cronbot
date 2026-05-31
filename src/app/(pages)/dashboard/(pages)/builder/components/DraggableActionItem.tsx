'use client'

import { useDraggable } from '@dnd-kit/core'
import ActionItem from './ActionItem'

export default function DraggableActionItem({
  a,
  isActive,
  onClick,
}: {
  a: any
  isActive: boolean
  onClick: () => void
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: a.id,
  })

  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      data-action-id={a.id}
      onClick={onClick}
      // Ensure pointer events are enabled for dnd-kit listeners
      style={{ pointerEvents: 'auto' }}
      className={`w-full cursor-grab ${isDragging ? 'opacity-50' : ''}`}
    >
      <ActionItem a={a} isActive={isActive} />
    </button>
  )
}
