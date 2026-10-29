import { Link } from 'react-router-dom'
import credits from '@/assets/birds/photo-credits.json'
import { getAnimalPrimaryImage } from '@/assets/wildlife/animalPrimaryImages'
import styles from './PhotoCreditsPage.module.css'

export function PhotoCreditsPage() {
  return <main className={styles.page}><Link to="/parks/kruger/birds">← Kruger birds</Link><header><p>Meet the photographers</p><h1>Photo credits</h1><p>Source photographs and the licences applying to the image files shown in Animavidi.</p></header><div className={styles.grid}>
    {Object.entries(credits).map(([id, credit]) => <article key={id}><img src={getAnimalPrimaryImage(id)} alt={credit.speciesName} loading="lazy" /><div><h2>{credit.speciesName}</h2><p>Photograph by <strong>{credit.author}</strong></p><p><a href={credit.sourceUrl} target="_blank" rel="noreferrer">Original photograph and source</a> · <a href={credit.licenseUrl} target="_blank" rel="noreferrer">{credit.license}</a></p><p>{credit.changes}</p><p>The image derivative retains the licence linked above.</p><small>Source checked {credit.reviewedAt}</small></div></article>)}
  </div></main>
}
