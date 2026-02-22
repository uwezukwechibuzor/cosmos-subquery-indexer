import { CosmosBlock } from "@subql/types-cosmos";
import { BlockInfo } from "../types";
import { getTimestamp } from "../utils/helpers";

/**
 * Handler for every block
 * Tracks basic block information and statistics
 */
export async function handleBlock(block: CosmosBlock): Promise<void> {
  const blockHeight = BigInt(block.block.header.height);
  const timestamp = getTimestamp(block);

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
  });

  await blockInfo.save();

  // Log every 1000 blocks
  if (Number(blockHeight) % 1000 === 0) {
    logger.info(`Processed block ${blockHeight}`);
  }
}
