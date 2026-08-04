import {sourceMetadata} from '@/features/information/data/parkInformationData'
export function InformationDisclaimer({compact=false}:{compact?:boolean}){return <p className={compact?'compactDisclaimer':'informationDisclaimer'}><strong>{sourceMetadata.warning}</strong>{compact?null:<span> Source: {sourceMetadata.title} ({sourceMetadata.type}), reviewed {sourceMetadata.reviewed}.</span>}</p>}
