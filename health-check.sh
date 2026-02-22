#!/bin/bash
# Cosmos Hub Indexer Health Check

echo "🔍 Checking Cosmos Hub Indexer Status..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop."
    exit 1
fi
echo "✅ Docker is running"

# Check if containers are up
echo ""
echo "📦 Container Status:"
docker compose ps

# Check if GraphQL is accessible
echo ""
echo "🌐 Checking GraphQL endpoint..."
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ GraphQL endpoint is accessible at http://localhost:3000"
    
    # Query metadata
    echo ""
    echo "📊 Indexer Metadata:"
    curl -s -X POST http://localhost:3000 \
      -H "Content-Type: application/json" \
      -d '{"query":"{ _metadata { lastProcessedHeight targetHeight indexerHealthy chain } }"}' | \
      python3 -m json.tool 2>/dev/null || echo "Waiting for first blocks to be indexed..."
else
    echo "⏳ GraphQL endpoint not ready yet (containers may still be starting)"
fi

# Check recent logs
echo ""
echo "📝 Recent Indexer Logs (last 10 lines):"
docker compose logs --tail=10 subquery-node

echo ""
echo "💡 For full logs, run: docker compose logs -f subquery-node"
echo "💡 For detailed guide, see: VERIFICATION_GUIDE.md"
