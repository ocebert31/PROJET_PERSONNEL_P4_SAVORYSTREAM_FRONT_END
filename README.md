# SavoryStream — front-end

Application **e-commerce vitrine** (React / Vite) : catalogue de sauces, fiche produit, inscription / connexion, panier géré côté navigateur (**localStorage**). Le catalogue et le détail s’appuient sur des **données statiques** (`src/data`) ; le backend n’est sollicité que pour l’**authentification**.

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

- `src/pages/` — écrans liés aux routes (ex. accueil, détail produit, login).
- `src/components/` — UI par domaine (`home/`, `Sauce/`, `auth/`, `Header/`, `Footer/`).
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
| `VITE_API_URL_AUTH`   | URL de base du namespace **users** côté API Rails, **sans slash final** (ex. `http://localhost:3000/api/v1/users`). L’inscription appelle `POST …/registrations`. |

Copier `.env.example` vers `.env` et adapter l’URL si ton serveur Rails n’écoute pas sur le port 3000.

## Scripts npm

| Commande          | Usage |
|-------------------|--------|
| `npm run dev`     | Serveur de dev Vite (HMR) |
| `npm run build`   | `tsc -b` + build production → `dist/` |
| `npm run preview` | Prévisualiser le build localement |
| `npm run test`    | Suite Vitest |
| `npm run lint`    | ESLint |

## Qualité & intégration continue

Les **pull requests** et les **push** sur `main` déclenchent une **CI** (lint, tests, build), sauf si seuls des fichiers **`.md`** sont modifiés. Comportement exact et politique **Dependabot / auto-merge** : **spec Notion §8**.
