# movieSearch

A background file ingestion and semantic search service. Upload a CSV of movies (title, plot, genres), process it asynchronously with Redis + BullMQ, embed text with `@xenova/transformers`, index into Elasticsearch, and expose an HTTP API for searching by keyword + vector similarity.

---

## ✨ Features
- **Async ingestion**: Upload CSV/JSON → queued with **BullMQ** → processed by workers.
- **Embeddings**: On‑the‑fly sentence embeddings via **`@xenova/transformers`** (e.g. `Xenova/all-MiniLM-L6-v2`).
- **Semantic search**: k‑NN over `dense_vector` fields (`plot_vector`).
- **Dockerized stack**: Node.js API, Redis, Elasticsearch, and Kibana with healthchecks.
- **Queues**: `fileQueue` (parses file) → `movieQueue` (embeds & indexes). Progress logging included.

---

## 🧱 Architecture
```
Client  ──►  Express API  ──►  fileQueue  ──►  movieQueue  ──►  Elasticsearch
              │   ▲             │  (add jobs)      │  (index)
              │   │             ▼                   │
              │   └──── Redis (BullMQ) ◄────────────┘
              │
              └─► Kibana (Monitoring & Dev Tools)
```

---

## 🧰 Tech Stack
- **Runtime**: Node.js + TypeScript, Express
- **Queues**: Redis 7/8 + BullMQ
- **Search**: Elasticsearch 8.x (single‑node dev)
- **Viz/Dev**: Kibana 8.x
- **Embeddings**: `@xenova/transformers`
- **Containerization**: Docker Compose

---

## 🚀 Quick Start (Docker Compose)
1. **Copy env**
   ```bash
   cp .env.example .env
   # then edit values
   ```

2. **Bring the stack up**
   ```bash
   make build
   ```

3. **Open Kibana**: http://localhost:5601

> Data persists via Docker volumes. To wipe data: `docker compose down -v`.

---

## 🔐 Environment Variables (`.env`)
| Variable | Example | Notes |
|---|---|---|
| `REDIS_HOST` | `semantic_redis` | Service name from Compose for internal DNS |
| `REDIS_PORT` | `6379` | |
| `REDIS_PASS` | `s3cret` | If auth enabled in `redis.conf` |
| `ELASTIC_HOST` | `http://semantic_elastic:9200` | Use service name for internal connections |
| `ELASTIC_SECURITY` | `true` | Enables ES security (recommended) |
| `ELASTIC_PASSWORD` | `changeme` | Password for `elastic` superuser (Kibana must not use this) |
| `ELASTIC_KEY` | `AAEAA...` | **Kibana service account token** |

> Kibana **must** authenticate with a *service account token*, not the `elastic` superuser.

---

### Generate the Kibana service account token
```bash
# inside the elastic container
bin/elasticsearch-service-tokens create kibana kibana kibana-token
# copy the printed token (starts with AAEAA...), set as ELASTIC_KEY in .env
```

---

## 🧵 Queues
### `movieQueue`
- Inputs a `Movie` `{ title, plot, genres[] }`
- Generates `title_vector`, `plot_vector`
- Indexes the document
- Logs: `Movie i/N processed: "<title>"`

### `fileQueue`
- Accepts a file path
- Streams + parses CSV
- Enqueues `movieQueue` jobs with `(index, total)`

---

## 📥 Upload CSV
CSV headers: `title,plot,genres`
- `genres` is a comma-separated list, e.g. `Animation,Comedy,Family`

**Example**
```csv
The Lion King,"A young lion prince flees his kingdom.",Animation,Family
Toy Story,"Toys come to life when humans aren't around.",Animation,Comedy,Family
```

**API**
```bash
# Upload
curl -F file=@movies.csv http://localhost:3000/upload
```

---

## 🧪 Local Development
- **Install**: `npm i` (inside `app/`)
- **Run**: `npm run dev`
- **Lint**: `npm run lint`
- **Env**: Copy `.env.example` → `.env`

**TypeScript path aliases with tsx**
```jsonc
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": "src",
    "paths": {
      "@routes/*": ["routes/*"],
      "@helper/*": ["helper/*"],
      "@config/*": ["config/*"],
      "@models/*": ["models/*"],
      "@queue/*": ["queue/*"]
    },
    "module": "ESNext",
    "moduleResolution": "NodeNext"
  }
}
```
Run with:
```bash
NODE_OPTIONS="-r tsconfig-paths/register" npx tsx src/index.ts
```

---

## 🔧 Postman
- **Basic auth (elastic user)**: `Authorization: Basic base64(elastic:ELASTIC_PASSWORD)`
- **Service token**: `Authorization: Bearer <ELASTIC_KEY>`

---

## 🩺 Healthchecks
- **API**: `GET /status` → used by Compose healthcheck
- **Redis**: `redis-cli -a $REDIS_PASS ping`
- **Elasticsearch**: `curl -u elastic:$ELASTIC_PASSWORD http://localhost:9200/`
 ---
