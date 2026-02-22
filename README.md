# Cosmos Hub SubQuery Indexer - Production Ready

A comprehensive, production-ready SubQuery indexer for Cosmos Hub that tracks transfers, staking operations, governance, rewards, and IBC transfers.

## Features

This indexer captures and indexes:

### 🏦 Bank Module
- **Transfers**: All token transfers including MsgSend
- **Account tracking**: First seen block, transaction counts

### 🥩 Staking Module
- **Delegations**: Track all delegations to validators
- **Undelegations**: Track unbonding operations with completion times
- **Redelegations**: Track validator switches
- **Validators**: Basic validator information

### 🏛️ Governance Module
- **Proposals**: All governance proposals with details
- **Votes**: Track all votes on proposals
- **Deposits**: Track proposal deposits

### 💰 Distribution Module
- **Rewards**: Delegator reward withdrawals
- **Commission**: Validator commission withdrawals

### 🌉 IBC Module
- **IBC Transfers**: Cross-chain transfers via IBC protocol

### 📊 Analytics
- **Block information**: Track all blocks with proposers
- **Daily statistics**: Aggregated daily metrics

## Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose
- [Node.js](https://nodejs.org/) v18 or higher
- [SubQuery CLI](https://www.npmjs.com/package/@subql/cli)

## Quick Start

### 1. Install Dependencies

```bash
npm install
# or
yarn install
```

### 2. Generate Types

Generate TypeScript types from the GraphQL schema:

```bash
npm run codegen
# or
yarn codegen
```

### 3. Build the Project

```bash
npm run build
# or
yarn build
```

### 4. Run with Docker

Start the indexer with PostgreSQL and GraphQL:

```bash
npm run start:docker
# or
yarn start:docker
```

This will:
- Start a PostgreSQL database
- Start the SubQuery node (indexer)
- Start the GraphQL query service

### 5. Access the GraphQL Playground

Once running, open your browser to:
```
http://localhost:3000
```

### 6. Verify It's Working

Run the health check script:
```bash
./health-check.sh
```

Or manually check:
```bash
# Check container status
docker compose ps

# Watch indexer logs
docker compose logs -f subquery-node

# Test GraphQL API
curl -X POST http://localhost:3000 \
  -H "Content-Type: application/json" \
  -d '{"query":"{ _metadata { lastProcessedHeight indexerHealthy } }"}'
```

**✅ Signs it's working:**
- All 3 containers show "Up" status
- Logs show "Processing block..." with increasing numbers
- GraphQL playground loads at http://localhost:3000
- Metadata query returns `indexerHealthy: true`

**For detailed verification steps, see [VERIFICATION_GUIDE.md](./VERIFICATION_GUIDE.md)**

## Example Queries

### Get Recent Transfers

```graphql
query {
  transfers(first: 10, orderBy: BLOCK_HEIGHT_DESC) {
    nodes {
      id
      blockHeight
      timestamp
      from {
        id
      }
      to {
        id
      }
      amount
      denom
      success
    }
  }
}
```

### Get Delegations for an Account

```graphql
query {
  delegations(
    filter: {
      delegatorId: { equalTo: "cosmos1..." }
    }
  ) {
    nodes {
      validator {
        moniker
        address
      }
      shares
      amount
      timestamp
    }
  }
}
```

### Get Active Governance Proposals

```graphql
query {
  proposals(
    filter: {
      status: { equalTo: VOTING_PERIOD }
    }
    orderBy: SUBMIT_TIME_DESC
  ) {
    nodes {
      proposalId
      title
      description
      status
      submitTime
      votingEndTime
      votes {
        totalCount
      }
    }
  }
}
```

### Get Validator Information

```graphql
query {
  validators(
    filter: {
      status: { equalTo: BONDED }
    }
    orderBy: TOKENS_DESC
  ) {
    nodes {
      address
      moniker
      commissionRate
      tokens
      delegatorShares
      jailed
      delegations {
        totalCount
      }
    }
  }
}
```

### Get IBC Transfers

```graphql
query {
  iBCTransfers(
    first: 10
    orderBy: BLOCK_HEIGHT_DESC
    filter: {
      success: { equalTo: true }
    }
  ) {
    nodes {
      sender
      receiver
      amount
      denom
      sourceChannel
      timestamp
      success
    }
  }
}
```

### Get Daily Statistics

```graphql
query {
  dailyStatistics(
    orderBy: DATE_DESC
    first: 30
  ) {
    nodes {
      date
      totalTransactions
      totalTransfers
      totalDelegations
      uniqueActiveAccounts
      totalVolume
    }
  }
}
```

## Configuration

### Network Configuration

The indexer is configured for Cosmos Hub mainnet (`cosmoshub-4`). You can modify the network settings in `project.ts`:

```typescript
network: {
  chainId: "cosmoshub-4",
  endpoint: [
    "https://cosmos-rpc.polkachu.com",
    // Add your own RPC endpoints here
  ],
}
```

### Start Block

By default, indexing starts from block `5200791`. You can change this in `project.ts`:

```typescript
dataSources: [
  {
    kind: CosmosDatasourceKind.Runtime,
    startBlock: 5200791, // Change this
    // ...
  }
]
```

### Performance Tuning

Adjust indexing performance in `docker-compose.yml`:

```yaml
command:
  - --workers=4        # Number of worker threads
  - --batch-size=30    # Number of blocks to fetch at once
```

For faster indexing with your own RPC:
- Increase `workers` to 8-16
- Increase `batch-size` to 100-200

For public RPC endpoints (rate-limited):
- Reduce `workers` to 2-4
- Reduce `batch-size` to 10-30

## Project Structure

```
├── schema.graphql              # GraphQL schema definitions
├── project.ts                  # Project configuration & manifest
├── src/
│   ├── index.ts               # Export all handlers
│   ├── utils/
│   │   └── helpers.ts         # Utility functions
│   └── mappings/
│       ├── blockHandler.ts    # Block information handler
│       ├── transferHandler.ts # Transfer handlers
│       ├── stakingHandler.ts  # Staking handlers
│       ├── distributionHandler.ts # Reward handlers
│       ├── governanceHandler.ts   # Governance handlers
│       └── ibcHandler.ts          # IBC handlers
├── docker-compose.yml         # Docker configuration
└── package.json              # Dependencies
```

## Production Deployment

### Using SubQuery Managed Service

1. Create an account at [SubQuery Managed Service](https://managedservice.subquery.network/)
2. Deploy your project:

```bash
subql publish
```

### Self-Hosting

For production self-hosting:

1. Use a dedicated PostgreSQL database (not Docker)
2. Configure proper monitoring (Prometheus, Grafana)
3. Use a load balancer for the GraphQL endpoint
4. Set up proper backups for PostgreSQL
5. Use multiple RPC endpoints for redundancy
6. Consider using [SubQuery Node](https://www.npmjs.com/package/@subql/node-cosmos) directly

### Environment Variables

Create a `.env` file for production:

```env
DB_HOST=your-postgres-host
DB_PORT=5432
DB_USER=postgres
DB_PASS=your-secure-password
DB_DATABASE=subquery
```

## Development

### Watch Mode

For development with auto-reload:

```bash
# In one terminal
yarn build --watch

# In another terminal
yarn start:docker
```

### Testing

```bash
npm test
# or
yarn test
```

## Monitoring & Maintenance

### Check Indexing Progress

```graphql
query {
  _metadata {
    lastProcessedHeight
    lastProcessedTimestamp
    targetHeight
    chain
    indexerHealthy
    indexerNodeVersion
  }
}
```

### Database Size

Monitor your PostgreSQL database size:

```sql
SELECT pg_size_pretty(pg_database_size('postgres'));
```

### Logs

View indexer logs:

```bash
docker-compose logs -f subquery-node
```

## Common Issues

### Slow Indexing

- Use private RPC endpoints instead of public ones
- Increase `workers` and `batch-size` in docker-compose.yml
- Ensure your PostgreSQL has enough resources

### Out of Memory

- Reduce `batch-size`
- Reduce `workers`
- Increase Docker memory allocation

### RPC Rate Limiting

- Use multiple RPC endpoints
- Reduce `batch-size` and `workers`
- Consider getting a dedicated RPC endpoint

## Resources

- [SubQuery Documentation](https://academy.subquery.network/)
- [Cosmos SDK Documentation](https://docs.cosmos.network/)
- [Cosmos Hub Documentation](https://hub.cosmos.network/)
- [GraphQL Documentation](https://graphql.org/learn/)

## License

MIT

## Support

For issues and questions:
- [SubQuery Discord](https://discord.com/invite/subquery)
- [SubQuery GitHub](https://github.com/subquery/subql)
- [Cosmos Hub Discord](https://discord.gg/cosmosnetwork)
