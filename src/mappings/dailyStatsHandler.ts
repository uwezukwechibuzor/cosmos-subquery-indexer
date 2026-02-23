import { CosmosBlock } from "@subql/types-cosmos";
import { DailyStatistic } from "../types";
import { getTimestamp } from "../utils/helpers";

/**
 * Aggregate daily statistics including total fees
 * Should be called after transactions are processed
 */
export async function aggregateDailyStats(block: CosmosBlock): Promise<void> {
  const timestamp = getTimestamp(block);
  const dateStr = timestamp.toISOString().split("T")[0]; // YYYY-MM-DD

  let stats = await DailyStatistic.get(dateStr);

  if (!stats) {
    stats = DailyStatistic.create({
      id: dateStr,
      date: timestamp,
      totalTransactions: 0,
      totalTransfers: 0,
      totalDelegations: 0,
      totalUndelegations: 0,
      uniqueActiveAccounts: 0,
      totalIBCTransfers: 0,
      totalVolume: "0",
      totalFees: "0",
      totalFeesByDenom: "{}",
    });
  }

  // Count transactions in this block
  const txCount = block.block.txs?.length || 0;
  stats.totalTransactions += txCount;

  // Parse existing fees (convert string values back to BigInt)
  const feesByDenom: Record<string, bigint> = {};
  try {
    const parsed = JSON.parse(stats.totalFeesByDenom || "{}");
    for (const [denom, amount] of Object.entries(parsed)) {
      feesByDenom[denom] = BigInt(amount as string);
    }
  } catch (error) {
    logger.warn(`Failed to parse totalFeesByDenom: ${error}`);
  }

  // Add fees from this block's transactions
  if (block.transactions) {
    for (const tx of block.transactions) {
      try {
        const decodedTx = tx.decodedTx || (tx as any).tx?.decodedTx;
        if (decodedTx?.authInfo?.fee?.amount) {
          for (const feeAmount of decodedTx.authInfo.fee.amount) {
            const denom = feeAmount.denom || "uatom";
            const amount = BigInt(feeAmount.amount?.toString() || "0");

            if (!feesByDenom[denom]) {
              feesByDenom[denom] = BigInt(0);
            }
            feesByDenom[denom] = feesByDenom[denom] + amount;
          }
        }
      } catch (error) {
        // Skip fee calculation for this tx if it fails
      }
    }
  }

  // Calculate total fees (sum of all denoms)
  let totalFees = BigInt(0);
  for (const denom in feesByDenom) {
    totalFees = totalFees + feesByDenom[denom];
  }

  stats.totalFees = totalFees.toString();
  stats.totalFeesByDenom = JSON.stringify(
    Object.fromEntries(
      Object.entries(feesByDenom).map(([k, v]) => [k, v.toString()])
    )
  );

  await stats.save();

  // Log daily totals at end of day (approximately)
  const hour = timestamp.getUTCHours();
  if (hour === 23 && txCount > 0) {
    logger.info(
      `Daily stats for ${dateStr}: ${stats.totalTransactions} txs, ${stats.totalFees} total fees`
    );
  }
}
