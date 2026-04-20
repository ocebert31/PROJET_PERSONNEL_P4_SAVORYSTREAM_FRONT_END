# SavoryStream — front-end

Application **e-commerce vitrine** (React / Vite) : catalogue de sauces, fiche produit, inscription / connexion, panier géré côté navigateur (**localStorage**). Le catalogue et le détail s’appuient sur des **données statiques** (`src/data`). L’**API Rails** sert l’**authentification par cookies** (sessions, profil) et les **parcours admin** protégés (ex. création de sauce, catégories), via `fetchSessionRequest` / `fetchRequest` sur la base configurée dans **`VITE_API_URL_AUTH`**.

## Documentation

La **spec complète** (parcours utilisateur, stack détaillée, architecture des dossiers, stratégie de tests, déploiement, **CI & Dependabot**) est sur Notion :

**[Spec — SavoryStream (front-end)](https://www.notion.so/32bd2d722f2d81d58cfcedd40178e0e4)**

## Stack (résumé)

| Domaine   | Choix principaux                          |
|-----------|-------------------------------------------|
| Langage   | TypeScript                                |
| UI        | React 19, Tailwind CSS 4, Flowbite        |
| Build     | Vite 6                                    |
| Routing   | React Router 7                            |
| Formulaires | react-hook-form, Yup                    |
| Tests     | Vitest, Testing Library                   |

## Structure du dépôt (aperçu)

- `src/pages/` — écrans liés aux routes (accueil, détail produit, login, création admin sauce, etc.).
- `src/components/` — UI par domaine (`home/`, `Sauce/`, `Dashboard/`, `auth/`, `Header/`, `Footer/`).
- `src/context/`, `src/hooks/`, `src/schemas/`, `src/mappers/` — état global (auth), hooks métier, validation Yup, transformation des payloads.
- `src/routes/` — routeur et gardes (ex. accès admin).
- `src/init/` — initialisation côté client (ex. session).
- `src/services/` — appels HTTP vers l’API (auth, sauces, catégories).
- `src/tests/` — tests en miroir de `src/` (même arborescence logique).
- `.github/` — **CI** (`workflows/ci.yml`), **Dependabot** (`dependabot.yml`), **auto-merge** ciblé (`dependabot-auto-merge.yml`).

Le détail des flux et conventions : **spec Notion, §3**.

## Prérequis & installation

- **Node.js** **20** (LTS) ou supérieur · **npm**
- À la racine : `npm install`

## Variables d’environnement

Créer un fichier **`.env`** (non versionné) à la racine :

| Variable              | Rôle |
|-----------------------|------|
| `VITE_API_URL_AUTH`   | URL de base de l’API Rails, **avec slash final**, jusqu’au préfixe version (ex. `http://localhost:3000/api/v1/`). Les chemins d’endpoint sont concaténés tels quels (`users/sessions`, `sauces`, `sauces/categories`, etc.). Voir `.env.example`. |

Copier `.env.example` vers `.env` et adapter l’URL si ton serveur Rails n’écoute pas sur le port 3000.

## Scripts npm

| Commande          | Usage |
|-------------------|--------|
| `npm run dev`     | Serveur de dev Vite (HMR) |
| `npm run build`   | `tsc -b` + build production → `dist/` |
| `npm run preview` | Prévisualiser le build localement |
| `npm run test`    | Suite Vitest (mode watch ; `npm run test -- --run` pour une exécution unique, ex. CI locale) |
| `npm run lint`    | ESLint |

## Design tokens et usage

Le design system repose sur les tokens de `src/index.css`.

- Couleurs d’état : utiliser `success`, `warning`, `info`, `destructive` (et leurs variantes `-foreground`, `-background`, `-border`) au lieu de couleurs hardcodées.
- Typographie : privilégier les classes `text-heading-*`, `text-body*`, `text-caption`, `text-label` pour garder une hiérarchie homogène.
- Fondations visuelles : utiliser les utilitaires DS (`ds-card`, `ds-panel`, `ds-input-radius`, `ds-chip-radius`, `ds-toast-shadow`) plutôt que des combinaisons ad hoc.
- Règles de cohérence :
  - ne pas introduire de couleurs de statut en dur (`rose-*`, `emerald-*`, etc.) dans les composants métier ;
  - ne pas multiplier les ombres personnalisées hors échelle ;
  - ne pas créer de nouvelles tailles typographiques sans variant nommé.

## Qualité & intégration continue

Les **pull requests** et les **push** sur `main` déclenchent une **CI** (lint, tests, build), sauf si seuls des fichiers **`.md`** sont modifiés. Comportement exact et politique **Dependabot / auto-merge** : **spec Notion §8**.
