# Andrea personal site — React + Vite + Three.js + GitHub Pages

Questo progetto è pensato per essere:

- facile da leggere
- facile da modificare
- pubblicato con GitHub Actions su GitHub Pages

## Struttura del progetto

- `src/App.jsx` → il layout e i contenuti della pagina
- `src/components/Scene3D.jsx` → la scena 3D animata della hero (react-three-fiber)
- `src/components/TiltCard.jsx` → card con effetto tilt 3D al passaggio del mouse
- `src/components/Reveal.jsx` → animazioni di comparsa allo scroll (IntersectionObserver)
- `src/styles.css` → tutto lo stile della pagina (tema dark)
- `vite.config.js` → configurazione di Vite
- `.github/workflows/deploy.yaml` → workflow che builda e pubblica il sito

## La scena 3D

La hero usa [three.js](https://threejs.org) tramite
[@react-three/fiber](https://docs.pmnd.rs/react-three-fiber): una rete di
nodi collegati (un "cluster") che ruota lentamente, con un icosaedro
wireframe al centro e la camera che segue il mouse in parallasse.

Dettagli utili:

- il componente è caricato in **lazy loading**, così la pagina appare subito
  e three.js (~240 KB gzip) arriva dopo
- con `prefers-reduced-motion` le animazioni si fermano
- la disposizione dei nodi usa un PRNG con seed fisso: è identica a ogni visita

## Perché questa stack

### 1. React
Ti permette di ragionare a componenti e gestire la UI in modo moderno.

### 2. Vite
Serve come tool di sviluppo e build:
- in locale ti dà un dev server veloce
- in deploy genera i file statici finali nella cartella `dist`

### 3. GitHub Actions
Fa il lavoro automatico:
- scarica il codice del repository
- installa le dipendenze
- esegue la build
- pubblica il risultato su GitHub Pages

## Avvio locale

```bash
npm install
npm run dev
```

Poi apri l'URL che Vite mostra nel terminale.

## Build locale

```bash
npm run build
npm run preview
```

## Deploy su GitHub

Per il tuo profilo personale, il repository deve chiamarsi:

`andreadipaolaa.github.io`

## Cosa fare su GitHub

1. crea il repository `andreadipaolaa.github.io`
2. carica questi file
3. vai in `Settings > Pages`
4. sotto `Build and deployment`, in `Source`, scegli `GitHub Actions`
5. fai push su `main`

Da quel momento ogni push su `main` lancerà il workflow e aggiornerà il sito.

## Cosa studiare in questo starter

### `vite.config.js`
Qui c'è:

```js
base: '/'
```

Perché il tuo sito verrà pubblicato sulla root del dominio Pages personale:
`https://andreadipaolaa.github.io/`

Se invece fosse un repository progetto tipo `https://andreadipaolaa.github.io/mio-repo/`, allora la base andrebbe cambiata.

### workflow deploy
Il file `.github/workflows/deploy.yml` fa 7 cose:

1. si attiva su push in `main`
2. fa checkout del repository
3. installa Node
4. installa le dipendenze npm
5. esegue `npm run build`
6. carica la cartella `dist`
7. la pubblica su GitHub Pages

## Idee per i prossimi miglioramenti

- separare il sito in componenti (`Hero`, `Stack`, `Contact`)
- aggiungere una sezione `Projects`
- aggiungere animazioni leggere
- aggiungere favicon personalizzata
- usare una font Apple-like più raffinata
- aggiungere dark mode
