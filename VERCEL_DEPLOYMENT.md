# Guide de déploiement sur Vercel pour PeerPass

Ce guide vous explique comment déployer l'application PeerPass sur Vercel.

## Prérequis

1. Un compte Vercel (gratuit ou payant)
2. Une base de données PostgreSQL (Neon, Supabase, etc.) accessible depuis Internet
3. Git installé sur votre machine

## Étapes de déploiement

### 1. Préparation du projet

Avant de déployer sur Vercel, assurez-vous que le fichier `vercel.json` est présent à la racine de votre projet avec le contenu suivant:

```json
{
  "version": 2,
  "builds": [
    { "src": "vite.config.ts", "use": "@vercel/node" },
    { "src": "server/index.ts", "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "server/index.ts" },
    { "src": "/(.*)", "dest": "/index.html" }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### 2. Modification du package.json

Ajoutez le script `vercel-build` à votre fichier `package.json`:

```json
"scripts": {
  "dev": "NODE_ENV=development tsx server/index.ts",
  "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
  "start": "NODE_ENV=production node dist/index.js",
  "check": "tsc",
  "db:push": "drizzle-kit push",
  "vercel-build": "npm run build"
},
```

### 3. Configuration de la base de données

1. Créez une base de données PostgreSQL sur un service comme Neon ou Supabase
2. Notez l'URL de connexion à la base de données

### 4. Déploiement sur Vercel

1. Connectez-vous à votre compte Vercel
2. Importez votre projet depuis GitHub, GitLab ou BitBucket
3. Dans la configuration du projet, ajoutez les variables d'environnement suivantes:
   - `DATABASE_URL`: L'URL de connexion à votre base de données PostgreSQL
   - Toute autre variable d'environnement nécessaire pour votre application

4. Cliquez sur "Deploy" pour lancer le déploiement

### 5. Exécution des migrations de base de données

Après le déploiement initial, vous devez créer le schéma de la base de données:

1. Localement, assurez-vous que la variable d'environnement `DATABASE_URL` pointe vers votre base de données de production
2. Exécutez `npm run db:push` pour appliquer les migrations à la base de données de production

### 6. Vérification du déploiement

Une fois le déploiement terminé, Vercel vous fournira une URL pour accéder à votre application. Vérifiez que tout fonctionne correctement.

## Dépannage

- Si vous rencontrez des problèmes avec le déploiement de la partie serveur, vérifiez les logs dans le dashboard Vercel
- Assurez-vous que votre base de données est accessible depuis les serveurs Vercel
- Vérifiez que toutes les variables d'environnement nécessaires sont correctement configurées
- Si l'application ne fonctionne pas correctement, consultez les logs du navigateur et les logs serveur

## Mise à jour de l'application

Pour mettre à jour votre application déployée:

1. Poussez vos modifications sur votre dépôt Git
2. Vercel détectera automatiquement les modifications et déploiera la nouvelle version
3. Si vous avez modifié le schéma de la base de données, n'oubliez pas d'exécuter `npm run db:push` localement pour mettre à jour la base de données de production