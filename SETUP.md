# Local Setup

## Create the Neon database

1. Go to [neon.tech](https://neon.tech), create an account, and choose **New project**.
2. Name the project `grade-tracker` and choose a nearby region.
3. In the project dashboard, open **Connect** and select the pooled connection option. Put that value in `.env` as `DATABASE_URL`.
4. Select the direct, non-pooler connection option and put that value in `.env` as `DIRECT_URL`.
5. Keep `.env` local. It is ignored by git. Use `.env.example` as the shape of the required variables, never as a place for real credentials.

The pooled URL is appropriate for application traffic. Prisma migrations use the direct URL because schema changes need a direct database connection.

## Install and initialize

```bash
npm install
npm run db:generate
npm run db:migrate -- --name init
npm run db:seed
npm run dev
```

When `db:migrate` asks for a migration name, use `init` if you did not pass it on the command line.

The migration and seed commands read the local `.env` automatically through Prisma 7's `prisma.config.js`.