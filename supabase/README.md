# Setup Supabase

Étapes rapides pour brancher la base. ~5 minutes.

> **Important** : ce projet utilise Supabase **uniquement comme base de données**, pas comme système d'auth. Le dashboard `/tracking` est protégé par un mot de passe simple (cookie). On n'utilise donc **pas** `@supabase/ssr`, juste `@supabase/supabase-js` côté serveur. Si tu vois un wizard Supabase qui te dit d'installer `@supabase/ssr` et de créer des helpers `utils/supabase/*` — **ignore-le**, c'est pour les projets avec auth utilisateur.

## 1. Créer un projet Supabase

1. Va sur [supabase.com](https://supabase.com) et crée un compte (gratuit).
2. Clique **New project**.
3. Nom au choix, choisis une région proche (`Europe West (Paris)` par défaut).
4. Mot de passe DB : Supabase en propose un, copie-le quelque part (utile à garder mais pas requis ici).
5. Patiente 1-2 min que le projet soit provisionné.

## 2. Exécuter le schéma SQL

1. Dans le projet Supabase, ouvre **SQL Editor** (icône ⚡ dans la sidebar).
2. Clique **+ New query**.
3. Copie-colle le contenu de [`schema.sql`](./schema.sql) dans l'éditeur.
4. Clique **Run** en bas à droite.
5. Tu dois voir `Success. No rows returned`. Les tables `events` et `leads` sont créées.

## 3. Récupérer les clés API

Va dans **Project Settings** (icône ⚙️) → **API** (ou **API Keys** dans les nouveaux dashboards). Tu y trouves :

- **Project URL** → c'est `SUPABASE_URL`. Format : `https://xxxxxxxxxxxx.supabase.co`
- **Secret key** ⚠️ (anciennement "service_role") → c'est `SUPABASE_SERVICE_ROLE_KEY`.
  - C'est une clé qui **bypass la RLS** (Row Level Security) — elle a tous les droits sur ta DB.
  - **Ne la commit JAMAIS, ne l'expose JAMAIS côté client.**
  - Si tu vois "publishable key" / "anon key" : ce **n'est pas** celle-là. On utilise uniquement la secret/service_role.

## 4. Configurer `.env.local`

Crée un fichier `.env.local` à la racine du projet (copie depuis `.env.example`) et remplis :

```bash
# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Cal.com
NEXT_PUBLIC_CALCOM_LINK=your-handle/discovery-call
NEXT_PUBLIC_CALENDLY_URL=https://cal.com/your-handle/discovery-call

# Vidéo YouTube post-booking sur /merci
NEXT_PUBLIC_MERCI_YOUTUBE_ID=YOUR_VIDEO_ID

# Supabase
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJ...

# Dashboard
DASHBOARD_PASSWORD=un-mot-de-passe-long-et-unique
```

## 5. Installer + lancer

```bash
npm install
npm run dev
```

## 6. Vérifier que ça marche

1. Ouvre http://localhost:3000.
2. Recharge la page plusieurs fois, scroll, clique sur le CTA, ferme le modal.
3. Va sur http://localhost:3000/tracking → page de login → entre ton `DASHBOARD_PASSWORD`.
4. Tu dois voir les KPIs, le funnel, la liste des events.

Si la table `events` reste vide :

- DevTools → Network → filtre `events`. Tu dois voir des `POST /api/events` qui renvoient 200.
- Vérifie que `SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY` sont bien dans `.env.local` et que tu as **redémarré `npm run dev`** après ajout (Next.js charge `.env.local` au boot).

## 7. Sécurité — checklist avant prod

- [ ] `DASHBOARD_PASSWORD` est un vrai mot de passe (pas `change-me-please`).
- [ ] `SUPABASE_SERVICE_ROLE_KEY` n'est JAMAIS exposé côté client (jamais préfixé par `NEXT_PUBLIC_`).
- [ ] `.env.local` est dans le `.gitignore` (Next.js le fait par défaut, déjà OK).
- [ ] Sur Vercel : ajouter ces vars dans **Project Settings → Environment Variables** avant le premier deploy.

## 8. Resetter les données

Pour vider les tables sans casser le schéma, dans le SQL Editor :

```sql
truncate table public.events;
truncate table public.leads;
```
