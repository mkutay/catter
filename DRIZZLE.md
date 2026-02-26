## Setting Drizzle up

```bash
docker pull postgres
```

Start an instance:

```bash
docker run --name drizzle-postgres -e POSTGRES_PASSWORD=mypassword -d -p 5432:5432 postgres
```

Add to `.env.local`:

```bash
POSTGRES_URL="postgres://postgres:mypassword@localhost:5432/postgres"
```