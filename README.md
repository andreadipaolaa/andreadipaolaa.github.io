# Andrea personal site — React + Vite + GitHub Pages

Questo progetto è pensato per essere:

- facile da leggere
- facile da modificare
- pubblicato con GitHub Actions su GitHub Pages

## Struttura del progetto

- `src/App.jsx` → il layout e i contenuti della pagina
- `src/styles.css` → tutto lo stile della pagina
- `vite.config.js` → configurazione di Vite
- `.github/workflows/deploy.yml` → workflow che builda e pubblica il sito

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
