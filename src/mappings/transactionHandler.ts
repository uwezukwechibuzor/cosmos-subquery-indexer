import { CosmosTransaction } from "@subql/types-cosmos";
import { Transaction } from "../types";
import { getTimestamp } from "../utils/helpers";

/**
 * Handler for all transactions
 * Captures transaction fees and metadata
 */
export async function handleTransaction(tx: CosmosTransaction): Promise<void> {
  const blockHeight = BigInt(tx.block.block.header.height);
  const timestamp = getTimestamp(tx.block);
  const success = tx.tx.code === 0;

  // Extract fee information from the raw transaction data
  let fee = "0";
  let feeDenom = "uatom";
  let gasWanted = "0";
  
  try {
    // Access fee from the transaction's decodedTx if available
    const decodedTx = tx.decodedTx || (tx as any).tx?.decodedTx;
    
    if (decodedTx?.authInfo?.fee?.amount && decodedTx.authInfo.fee.amount.length > 0) {
      const feeAmount = decodedTx.authInfo.fee.amount[0];
      fee = feeAmount.amount?.toString() || "0";
      feeDenom = feeAmount.denom || "uatom";
    }
    
    if (decodedTx?.authInfo?.fee?.gasLimit) {
      gasWanted = decodedTx.authInfo.fee.gasLimit.toString();
    }
  } catch (error) {
    logger.warn(`Could not extract fee info from tx ${tx.hash}: ${error}`);
  }

  // Get sender - try multiple approaches
  let sender = "unknown";
  try {
    // Try to get from first signer or transaction data
    if ((tx as any).tx?.signerAddress) {
      sender = (tx as any).tx.signerAddress;
    }
  } catch (error) {
    // Silent fail, sender will remain "unknown"
  }

  const transaction = Transaction.create({
    id: tx.hash,
    blockHeight,
    timestamp,
    txHash: tx.hash,
    sender,
    success,
    gasWanted,
    gasUsed: tx.tx.gasUsed?.toString() || "0",
    fee,
    feeDenom,
    memo: "", // Memo extraction can be complex, leaving empty for now
  });

  await transaction.save();

  // Log fee collection
  if (BigInt(fee) > BigInt(0)) {
    logger.info(
      `Transaction ${tx.hash.substring(0, 8)}... paid ${fee}${feeDenom} in fees`
    );
  }
}
