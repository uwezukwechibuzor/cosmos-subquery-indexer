import { CosmosBlock } from "@subql/types-cosmos";
import { BlockInfo } from "../types";
import { getTimestamp } from "../utils/helpers";

/**
 * Handler for every block
 * Tracks basic block information, statistics, and total fees
 */
export async function handleBlock(block: CosmosBlock): Promise<void> {
  const blockHeight = BigInt(block.block.header.height);
  const timestamp = getTimestamp(block);

  // Calculate total fees for this block
  let totalFees = BigInt(0);

  // Get all transactions in this block
  if (block.transactions) {
    for (const tx of block.transactions) {
      try {
        const decodedTx = tx.decodedTx || (tx as any).tx?.decodedTx;
        if (decodedTx?.authInfo?.fee?.amount) {
          for (const feeAmount of decodedTx.authInfo.fee.amount) {
            const amount = BigInt(feeAmount.amount?.toString() || "0");
            totalFees += amount;
          }
        }
      } catch (error) {
        // Skip fee calculation for this tx if it fails
      }
    }
  }

  // Create block info record
  const proposerAddress = block.block.header.proposerAddress;
  const proposer = proposerAddress 
    ? (typeof proposerAddress === 'string' ? proposerAddress : Buffer.from(proposerAddress).toString('hex'))
    : "";
  
  const blockInfo = BlockInfo.create({
    id: blockHeight.toString(),
    height: blockHeight,
    hash: typeof block.block.id === 'string' ? block.block.id : Buffer.from(block.block.id).toString('hex'),
    timestamp,
    transactionCount: block.block.txs?.length || 0,
    proposer,
    totalFees: totalFees.toString(),
  });

  await blockInfo.save();

  // Log every 1000 blocks
  if (Number(blockHeight) % 1000 === 0) {
    logger.info(`Processed block ${blockHeight} with ${totalFees.toString()} total fees`);
  }
}
