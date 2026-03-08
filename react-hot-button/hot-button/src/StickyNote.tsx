import './StickyNote.css';

type StickyNoteProps = {
  stickyNote: string;
};

export function StickyNote({ stickyNote }: StickyNoteProps) {
  return <div className="sticky-note">{stickyNote}</div>;
}
