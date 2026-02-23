# Transaction Fee Tracking - Query Examples

## 📊 Daily Transaction Fees

### Get Daily Fee Totals (Last 7 Days)

```graphql
query DailyFees {
  dailyStatistics(
    first: 7
    orderBy: DATE_DESC
  ) {
    nodes {
      id
      date
      totalTransactions
      totalFees
      totalFeesByDenom
    }
  }
}
```

### Get Daily Fees with Human-Readable Format

```bash
curl -s http://localhost:3000 -H "Content-Type: application/json" \
  -d '{"query":"{ dailyStatistics(first: 7, orderBy: DATE_DESC) { nodes { date totalTransactions totalFees } } }"}' | python3 -m json.tool
```

### Get Daily Fees Broken Down by Denom

```graphql
query DailyFeesByDenom {
  dailyStatistics(first: 30, orderBy: DATE_DESC) {
    nodes {
      date
      totalFees
      totalFeesByDenom  # JSON string: {"uatom": "123456789"}
      totalTransactions
    }
  }
}
```

## 💰 Individual Transaction Fees

### Get Recent Transactions with Fees

```graphql
query RecentTransactionsWithFees {
  transactions(
    first: 20
    orderBy: BLOCK_HEIGHT_DESC
  ) {
    nodes {
      txHash
      blockHeight
      timestamp
      sender
      fee
      feeDenom
      gasWanted
      gasUsed
      success
    }
  }
}
```

### Get Highest Fee Transactions

```graphql
query HighestFeeTxs {
  transactions(
    first: 10
    orderBy: FEE_DESC
    filter: {
      success: { equalTo: true }
    }
  ) {
    nodes {
      txHash
      blockHeight
      timestamp
      fee
      feeDenom
      gasWanted
      gasUsed
    }
  }
}
```

### Get Transactions by Specific Sender

```bash
curl -s http://localhost:3000 -H "Content-Type: application/json" \
  -d '{"query":"{ transactions(filter: { sender: { equalTo: \"cosmos1...\" } }, first: 10) { nodes { txHash fee feeDenom timestamp } } }"}' | python3 -m json.tool
```

## 📦 Block Fee Statistics

### Get Blocks with Total Fees

```graphql
query BlocksWithFees {
  blockInfos(
    first: 20
    orderBy: HEIGHT_DESC
  ) {
    nodes {
      height
      timestamp
      transactionCount
      totalFees
      proposer
    }
  }
}
```

### Get Blocks with Highest Fees

```graphql
query HighestFeeBlocks {
  blockInfos(
    first: 10
    orderBy: TOTAL_FEES_DESC
  ) {
    nodes {
      height
      timestamp
      transactionCount
      totalFees
      proposer
    }
  }
}
```

## 📈 Analytics Queries

### Calculate Average Fee Per Transaction (Last 24 Hours)

```graphql
query AvgFeePerTx {
  dailyStatistics(first: 1, orderBy: DATE_DESC) {
    nodes {
      date
      totalTransactions
      totalFees
    }
  }
}
```

Then calculate: `totalFees / totalTransactions`

### Get Fee Trends Over Time

```graphql
query FeeTrends {
  dailyStatistics(first: 30, orderBy: DATE_DESC) {
    nodes {
      date
      totalFees
      totalTransactions
    }
  }
}
```

### Total Fees for a Specific Date

```bash
curl -s http://localhost:3000 -H "Content-Type: application/json" \
  -d '{"query":"{ dailyStatistics(filter: { date: { equalTo: \"2026-02-22\" } }) { nodes { date totalFees totalFeesByDenom totalTransactions } } }"}' | python3 -m json.tool
```

## 🔍 Combined Queries

### Full Daily Report

```graphql
query DailyReport {
  dailyStatistics(first: 1, orderBy: DATE_DESC) {
    nodes {
      date
      totalTransactions
      totalTransfers
      totalDelegations
      totalFees
      totalFeesByDenom
      totalVolume
      uniqueActiveAccounts
    }
  }
  
  transactions(
    first: 5
    orderBy: FEE_DESC
    filter: {
      timestamp: { greaterThan: "2026-02-22T00:00:00Z" }
    }
  ) {
    nodes {
      txHash
      fee
      feeDenom
      gasUsed
    }
  }
}
```

## 💡 Fee Conversion Helper

Since fees are stored in `uatom` (micro ATOM), to convert to ATOM:

```javascript
// JavaScript/TypeScript
const feeInUatom = "1000000"; // 1 million uatom
const feeInAtom = parseFloat(feeInUatom) / 1_000_000; // 1 ATOM

// Python
fee_in_uatom = 1000000
fee_in_atom = fee_in_uatom / 1_000_000  # 1.0 ATOM
```

## 🎯 Example Response

### Daily Fees Query Response

```json
{
  "data": {
    "dailyStatistics": {
      "nodes": [
        {
          "date": "2026-02-22",
          "totalTransactions": 15234,
          "totalFees": "9876543210",
          "totalFeesByDenom": "{\"uatom\":\"9876543210\"}"
        },
        {
          "date": "2026-02-21",
          "totalTransactions": 14987,
          "totalFees": "9123456789",
          "totalFeesByDenom": "{\"uatom\":\"9123456789\"}"
        }
      ]
    }
  }
}
```

This means:
- **Feb 22**: 15,234 txs paid 9,876.543210 ATOM in fees
- **Feb 21**: 14,987 txs paid 9,123.456789 ATOM in fees

## 📊 Dashboard Query

Perfect for building a monitoring dashboard:

```graphql
query Dashboard {
  # Today's stats
  todayStats: dailyStatistics(first: 1, orderBy: DATE_DESC) {
    nodes {
      date
      totalTransactions
      totalFees
      totalFeesByDenom
    }
  }
  
  # Last 7 days trend
  weeklyTrend: dailyStatistics(first: 7, orderBy: DATE_DESC) {
    nodes {
      date
      totalFees
    }
  }
  
  # Recent high-fee transactions
  highFeeTxs: transactions(first: 5, orderBy: FEE_DESC) {
    nodes {
      txHash
      fee
      feeDenom
      timestamp
    }
  }
  
  # Latest blocks
  recentBlocks: blockInfos(first: 10, orderBy: HEIGHT_DESC) {
    nodes {
      height
      totalFees
      transactionCount
    }
  }
}
```

## 🚀 Quick Test

Test your fee tracking right now:

```bash
# Get today's fees
curl -s http://localhost:3000 -H "Content-Type: application/json" \
  -d '{"query":"{ dailyStatistics(first: 1, orderBy: DATE_DESC) { nodes { date totalTransactions totalFees } } }"}' | python3 -m json.tool

# Get latest transaction fees
curl -s http://localhost:3000 -H "Content-Type: application/json" \
  -d '{"query":"{ transactions(first: 5, orderBy: BLOCK_HEIGHT_DESC) { nodes { txHash fee feeDenom success } } }"}' | python3 -m json.tool
```

---

**Note:** The indexer is now tracking all transaction fees! Give it a few minutes to process blocks and accumulate data.
