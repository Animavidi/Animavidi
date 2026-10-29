import type { BirdDraft } from '../model/communityBird'
export function BirdDraftFields({ draft,onChange,disabled }: { draft: BirdDraft; onChange: (draft: BirdDraft) => void; disabled: boolean }) {
  return <>
    <label>Bird name<input required maxLength={120} minLength={2} value={draft.commonName} disabled={disabled} onChange={(event) => onChange({ ...draft,commonName: event.target.value })} /></label>
    <label>Scientific name (optional)<input maxLength={160} value={draft.scientificName} disabled={disabled} onChange={(event) => onChange({ ...draft,scientificName: event.target.value })} /></label>
    <label>Description<textarea required minLength={20} maxLength={4000} rows={5} value={draft.description} disabled={disabled} onChange={(event) => onChange({ ...draft,description: event.target.value })} /></label>
    <label>Source link (optional, HTTPS)<input type="url" maxLength={2000} value={draft.sourceUrl} disabled={disabled} onChange={(event) => onChange({ ...draft,sourceUrl: event.target.value })} /></label>
  </>
}
