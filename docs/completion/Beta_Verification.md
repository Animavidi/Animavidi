# Animavidi - betaoplevering, 29 oktober 2026

Preview: https://animavidi-beta.solitary-mountain-8958.workers.dev
Beheer: https://animavidi-beta.solitary-mountain-8958.workers.dev/admin
Repository: https://github.com/Animavidi/Animavidi
Branch: `feat/complete-kruger-content`
Pull request: https://github.com/Animavidi/Animavidi/pull/1 (draft, niet gemerged)

## Afgerond

- 148 bestaande zoogdieren en alle 546 checklistvogels behouden, inclusief stabiele IDs. De startercollectie bevat 100 vogels; alle vogels blijven doorzoekbaar en bruikbaar met een neutrale placeholder. De selectie gebruikt historische waarnemingsfrequenties en is geen actuele top-100-ranglijst.
- Zoeken op Engelse en wetenschappelijke namen en aanwezige aliases. Drie eerder gecontroleerde alternatieven zijn toegevoegd: Cape Starling, Hadada Ibis en Striated Heron.
- Vogelwaarnemingen aanmaken, terugvinden en wijzigen; verwerking in Passport en een afzonderlijke unieke-vogelteller. De oude, onjuiste noemer van alleen 148 zoogdieren is hersteld.
- Bijdragen voor ontbrekende vogels, foto's, naamcorrecties en aanvullende informatie. Guido kan bekijken, bewerken, goedkeuren of afwijzen. Alleen goedgekeurde bijdragen zijn openbaar. Correcties en aanvullingen blijven herkenbare community-inhoud bij het bestaande soort-ID.
- Oorspronkelijk auteurschap blijft behouden bij beheerwijzigingen. Foto's vereisen een verklaring van eigendom en toestemming onder CC BY 4.0; ze worden opnieuw gecodeerd zonder locatie-metadata. Inzendingen blijven privé tot goedkeuring. Guido beoordeelt de afgebeelde soort vóór publicatie.
- My Animavidi: lokale profielnaam, My Camps-bezoeklijst en persoonlijke export/import inclusief oorspronkelijke fotobestanden. Import voegt ontbrekende IDs toe, overschrijft bestaande waarnemingen niet en bewaart bestaande instellingen.
- Beheerlogin en -sessies, soortprofielen, foto toevoegen/vervangen/verwijderen, routebeheer, revisiegeschiedenis en CSV-rapportage werken. Limieten op inlogpogingen, bijdragen en uploadgrootte; controle op origin, sessie en gelijktijdige wijzigingen.
- De eigen Animavidi-kaart behouden. Tien routegidsen zijn eerder tegen de aangeleverde 36-pagina-brochure gecontroleerd, met gecontroleerde stopvolgorde en aansluitingen. De brochure is niet als kaartafbeelding overgenomen.
- Afzonderlijke Cloudflare-preview met eigen D1-database en R2-bucket. Bestaande productiegegevens, domeinen en productiedeployment zijn niet gewijzigd.

## Getest

| Controle | Resultaat |
| --- | --- |
| TypeScript, ESLint, build en bestaande functionele validators | Geslaagd; volledigheidsaudits voor alle foto's/profielen zijn geen betablokkade volgens de nieuwste opdracht |
| Lokale browserflows | Checklist, details, waarneming aanmaken/wijzigen/verwijderen, Passport, beheer, revisies, routes, rapportdownload en goedkeuring geslaagd |
| Echte Cloudflare API / D1 / R2 | Login, verkeerde login, geweigerde origin, private inzending, adminfotopreview, goedkeuring, openbare fotobestanden en nieuwe vogelpublicatie geslaagd |
| Echte primaire foto-opslag | Uploaden en ophalen vanuit R2, override verwijderen en fallback herstellen geslaagd |
| Echte inhoudsopslag | Profiel opslaan/herladen, routeconcept opslaan/wijzigen, verouderde revisie weigeren en geschiedenis ophalen geslaagd |
| Persoonlijke data | Bewaard na refresh, browser heropenen, tweede deployment en beheer uit-/inloggen; fotobytes blijven behouden |
| Privacy | Een tweede browsercontext ziet de persoonlijke waarnemingen en adminsessie niet; privéwaarnemingen worden niet als community-inhoud opgeslagen |
| Back-up | Foto-export en import in een lege browser zonder byteverlies; herhaalde import maakt geen dubbele waarnemingen |
| Beloningen | Big Five-overgang, rare- en legendary-dialogen en opname in Passport in een geïsoleerde browser getest |
| Schermformaten | Twaalf schermen op 390, 820 en 1440 pixels gecontroleerd; geen horizontale pagina-overloop; visuele Passport-overlap hersteld |
| Foutpaden | Verkeerde origin/sessie, dubbele soortnamen, grote/ongeldige invoer, rate limits, ontbrekende fototoestemming, opslagfout, gelijktijdige beheerwijzigingen en tijdelijke catalogusstoring getest |

De functionele cloudtests gebruikten uitsluitend geïsoleerde testrecords. De twee testvoorstellen, fictieve vogel, conceptinhoud en testfoto zijn daarna met exacte IDs verwijderd. De databasecontrole gaf nul resterende voorstellen, communityvogels en inhoudsrecords; de verwijderde R2-sleutel geeft 'does not exist'. De verpakte checklist, routegidsen en profielen blijven beschikbaar zonder database-inhoud.

## Betabeperkingen en nog ontbrekende inhoud

- Geen gebruikersaccounts, automatische cloudback-up of apparaatsynchronisatie. Waarnemingen blijven per browser en appadres opgeslagen. Een ander apparaat, browser of domein vraagt handmatige export/import. Wis browsergegevens niet zonder back-up. Gebruik een eigen browserprofiel op gedeelde apparaten.
- My Camps is een bezoeklijst met kampinformatie, geen reserverings- of beschikbaarheidssysteem. Gebruikersbeheer voor toekomstige accounts blijft expliciet buiten deze lokale bèta.
- 51 verpakte soortfoto's tegenover 694 checklistsoorten: 36 zoogdieren en 15 vogels. Van de startervogels hebben 10/100 een foto en 2/100 een volledig gecontroleerd profiel. Ontbrekende inhoud blokkeert registreren niet.
- 29 toegevoegde foto's hebben gecontroleerde bron-, fotograaf- en licentiegegevens. De 22 oorspronkelijke fotobestanden en legacyprofielen zijn behouden; hun volledige bron-/rechtencontrole blijft een punt voor de definitieve release. Er zijn daarnaast vier bronvermelde zoogdiersamenvattingen met nog openstaande taxonomie-/conservatiecontrole.
- De kaart en routegidsen zijn planningshulpmiddelen, zonder gecertificeerde GPS-routering, afstand/ETA-garantie of live wegafsluitingen. De tien gecontroleerde routes vormen niet het volledige wegennet.
- Back-upimport accepteert maximaal 100 MB en 10.000 waarnemingen per bestand. Grotere bestanden worden met een foutmelding geweigerd; bestaande gegevens blijven behouden.
- Geen volledige offline-installatiegarantie. Bij tijdelijke catalogusuitval blijft de laatst opgeslagen communitycatalogus beschikbaar; een volledig nieuwe offline browsersessie is niet gegarandeerd.
- Originele illustratie-/kaartrechten en volledige inhoudelijke eindredactie blijven onderdeel van de definitieve productierelease. Er is geen onafhankelijke beveiligingsaudit uitgevoerd; in de geteste kernflows is geen kritieke fout aangetroffen.

## Opslag, voortgang en vervolgstap

Bevestigde tussencommits: `ad1c6b4` (Passport/zoeken/auteurschap), `c601f81` (gemodereerde bijdragen en uploads), `6af201e` (persoonlijke back-ups, profiel en camps). De afsluitende previewcommit bevat de reproduceerbare previewbuild, cloudtests en dit rapport. Iedere push wordt met de remote branch vergeleken.

Preview bouwen: `pnpm build:preview`. Previewconfig: `worker/wrangler.preview.jsonc`. Dit is nadrukkelijk een andere Worker, database en bucket dan productie. De bestaande productieconfig en Vercel-redirects zijn behouden. Previewpagina's krijgen `noindex`.

Nodig van Guido: open de preview en gebruik de afzonderlijk lokaal geleverde beheerlogin. Deel het loginbestand niet met testers. Bewaar een persoonlijke back-up vóór een overstap naar een ander appadres. Er is geen aanvullende toegang nodig om deze bèta te gebruiken.

Definitieve productiepublicatie is niet uitgevoerd en vereist afzonderlijke toestemming.

Laatste gecontroleerde Cloudflare-versie: `0e2cadf9-f44f-4a26-b3a5-a80758f6beee`. De afsluitende live smoke-test bevestigt 546 checklistvogels, drie gecontroleerde aliases, een correct Passport-totaal van 694, weigering van een ongeldige back-up, geen openbare testinhoud en behoud van de privéwaarneming.
