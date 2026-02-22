# 🔍 How to Know if Your Cosmos Hub Indexer is Working

## ✅ Quick Verification Checklist

### 1. **Docker Services Are Running**

Check if all 3 services are up:
```bash
docker compose ps
```

You should see:
- ✅ `postgres` - Running on port 5432
- ✅ `subquery-node` - Indexer service
- ✅ `graphql-engine` - Running on port 3000

### 2. **Check Indexer Logs**

Watch the indexer processing blocks:
```bash
docker compose logs -f subquery-node
```

**Signs it's working:**
```
✅ "Starting indexing from block 5200791"
✅ "Fetched blocks [5200791..5200820]"
✅ "Processing block 5200791"
✅ Block numbers are increasing
✅ No constant errors or crashes
```

**Red flags:**
```
❌ "Connection refused" - RPC endpoint issues
❌ "Database error" - PostgreSQL issues
❌ Stuck on same block number
❌ Constant error messages
```

### 3. **Test the GraphQL API**

#### Option A: Browser (Easiest)
1. Open http://localhost:3000 in your browser
2. You should see the GraphQL Playground
3. Try this test query:

```graphql
query {
  _metadata {
    lastProcessedHeight
    lastProcessedTimestamp
    targetHeight
    chain
    indexerHealthy
  }
}
```

**Good response:**
```json
{
  "data": {
    "_metadata": {
      "lastProcessedHeight": 5201000,
      "lastProcessedTimestamp": "2023-01-15T10:30:00",
      "targetHeight": 5201500,
      "chain": "cosmoshub-4",
      "indexerHealthy": true
    }
  }
}
```

#### Option B: Command Line
```bash
curl -X POST http://localhost:3000 \
  -H "Content-Type: application/json" \
  -d '{"query":"{ _metadata { lastProcessedHeight indexerHealthy } }"}'
```

### 4. **Query Your Indexed Data**

Once blocks are processed, try querying actual data:

#### Check Block Information
```graphql
query {
  blockInfos(first: 5, orderBy: HEIGHT_DESC) {
    nodes {
      height
      hash
      timestamp
      transactionCount
    }
  }
}
```

#### Check Transfers
```graphql
query {
  transfers(first: 10, orderBy: BLOCK_HEIGHT_DESC) {
    nodes {
      blockHeight
      from { id }
      to { id }
      amount
      denom
      success
    }
  }
}
```

#### Check Delegations
```graphql
query {
  delegations(first: 10) {
    nodes {
      delegator { id }
      validator { moniker }
      shares
      amount
    }
  }
}
```

### 5. **Monitor Progress**

#### Check indexing speed:
```bash
# Watch logs and note block height every 10 seconds
docker compose logs -f subquery-node | grep "Processing block"
```

**Good speeds:**
- Testing: 10-50 blocks/second
- Production with good RPC: 50-200 blocks/second
- Public RPC (rate limited): 5-20 blocks/second

#### Check database size:
```bash
docker compose exec postgres psql -U postgres -c "SELECT pg_size_pretty(pg_database_size('postgres'));"
```

### 6. **Common Issues & Solutions**

#### Issue: "Cannot connect to RPC"
```bash
# Check if endpoint is accessible
curl https://cosmos-rpc.polkachu.com/status
```
**Solution:** Update RPC endpoints in `project.ts`

#### Issue: "Port 3000 already in use"
```bash
# Find and kill the process
lsof -ti:3000 | xargs kill -9
```

#### Issue: Indexing is very slow
**Solutions:**
1. Use private RPC endpoint instead of public
2. Increase workers in `docker-compose.yml`:
   ```yaml
   command:
     - --workers=8
     - --batch-size=100
   ```

#### Issue: Database connection errors
```bash
# Restart PostgreSQL
docker compose restart postgres
```

#### Issue: Out of sync or stuck
```bash
# Clear data and restart
docker compose down -v
docker compose up
```

---

## 🎯 Success Indicators

Your indexer is **working correctly** when:

1. ✅ All 3 Docker containers are running
2. ✅ Block height in logs is consistently increasing
3. ✅ GraphQL API responds at http://localhost:3000
4. ✅ `_metadata.indexerHealthy` returns `true`
5. ✅ You can query indexed data (transfers, delegations, etc.)
6. ✅ No repeated errors in logs
7. ✅ Database is growing in size

---

## 📊 Monitoring Dashboard Queries

Create a monitoring dashboard with these queries:

```graphql
# System Health
query SystemHealth {
  _metadata {
    lastProcessedHeight
    targetHeight
    indexerHealthy
    chain
  }
}

# Daily Statistics
query DailyStats {
  dailyStatistics(orderBy: DATE_DESC, first: 7) {
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

# Recent Activity
query RecentActivity {
  transfers(first: 10, orderBy: BLOCK_HEIGHT_DESC) {
    totalCount
    nodes {
      blockHeight
      timestamp
      amount
      denom
    }
  }
  
  delegations(first: 10, orderBy: BLOCK_HEIGHT_DESC) {
    totalCount
  }
  
  proposals(orderBy: SUBMIT_TIME_DESC, first: 5) {
    totalCount
    nodes {
      proposalId
      title
      status
    }
  }
}
```

---

## 🔧 Useful Commands

```bash
# View all logs
docker compose logs -f

# View only indexer logs
docker compose logs -f subquery-node

# View only GraphQL logs
docker compose logs -f graphql-engine

# Check service status
docker compose ps

# Restart all services
docker compose restart

# Stop all services
docker compose down

# Stop and remove all data
docker compose down -v

# Check Docker resource usage
docker stats
```

---

## 🚀 Next Steps After Verification

Once your indexer is working:

1. **Let it sync** - Initial sync can take hours/days depending on start block
2. **Monitor regularly** - Check logs and GraphQL periodically
3. **Optimize** - Adjust workers/batch-size based on performance
4. **Backup** - Set up PostgreSQL backups
5. **Deploy** - Consider SubQuery Managed Service or self-host production
6. **Integrate** - Build your dApp using the GraphQL API

---

## 📞 Need Help?

- Check logs: `docker compose logs -f subquery-node`
- View this guide: `cat VERIFICATION_GUIDE.md`
- SubQuery Discord: https://discord.com/invite/subquery
- Cosmos Hub Discord: https://discord.gg/cosmosnetwork
