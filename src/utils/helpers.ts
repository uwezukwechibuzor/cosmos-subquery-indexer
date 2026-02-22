import { CosmosEvent, CosmosMessage, CosmosBlock } from "@subql/types-cosmos";
import { Account, DailyStatistic } from "../types";

/**
 * Get or create an Account entity
 */
export async function getOrCreateAccount(
  address: string,
  blockHeight: bigint,
  timestamp: Date
): Promise<Account> {
  let account = await Account.get(address);

  if (!account) {
    account = Account.create({
      id: address,
      firstSeenBlock: blockHeight,
      firstSeenTime: timestamp,
      totalTransactionsSent: 0,
      totalTransactionsReceived: 0,
    });
    await account.save();
  }

  return account;
}

/**
 * Extract attribute value from event
 */
export function getEventAttribute(
  event: CosmosEvent,
  key: string
): string | undefined {
  const attr = event.event.attributes.find((attr) => {
    const attrKey = typeof attr.key === 'string' ? attr.key : Buffer.from(attr.key).toString();
    return attrKey === key;
  });
  if (!attr) return undefined;
  return typeof attr.value === 'string' ? attr.value : Buffer.from(attr.value).toString();
}

/**
 * Extract multiple attributes from event
 */
export function getEventAttributes(
  event: CosmosEvent,
  keys: string[]
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const attr of event.event.attributes) {
    const attrKey = typeof attr.key === 'string' ? attr.key : Buffer.from(attr.key).toString();
    const attrValue = typeof attr.value === 'string' ? attr.value : Buffer.from(attr.value).toString();
    if (keys.includes(attrKey)) {
      result[attrKey] = attrValue;
    }
  }
  return result;
}

/**
 * Parse amount string (e.g., "1000uatom" -> {amount: "1000", denom: "uatom"})
 */
export function parseAmount(
  amountStr: string
): { amount: string; denom: string } | null {
  if (!amountStr) return null;

  const match = amountStr.match(/^(\d+)([a-z][a-z0-9/]+)$/i);
  if (!match) return null;

  return {
    amount: match[1],
    denom: match[2],
  };
}

/**
 * Parse multiple coin amounts
 */
export function parseCoins(
  coinsStr: string
): Array<{ amount: string; denom: string }> {
  if (!coinsStr) return [];

  const coins: Array<{ amount: string; denom: string }> = [];
  const coinRegex = /(\d+)([a-z][a-z0-9/]+)/gi;
  let match;

  while ((match = coinRegex.exec(coinsStr)) !== null) {
    coins.push({
      amount: match[1],
      denom: match[2],
    });
  }

  return coins;
}

/**
 * Get or create daily statistics
 */
export async function getOrCreateDailyStats(date: Date): Promise<DailyStatistic> {
  const dateStr = date.toISOString().split("T")[0]; // YYYY-MM-DD
  let stats = await DailyStatistic.get(dateStr);

  if (!stats) {
    stats = DailyStatistic.create({
      id: dateStr,
      date: date,
      totalTransactions: 0,
      totalTransfers: 0,
      totalDelegations: 0,
      totalUndelegations: 0,
      uniqueActiveAccounts: 0,
      totalIBCTransfers: 0,
      totalVolume: "0",
    });
    await stats.save();
  }

  return stats;
}

/**
 * Safely get timestamp from block
 */
export function getTimestamp(block: CosmosBlock): Date {
  const time = block.header?.time || block.block?.header?.time;
  if (time instanceof Date) {
    return time;
  }
  // Handle protobuf timestamp with seconds field
  const seconds = (time as any)?.seconds || 0;
  return new Date(Number(seconds) * 1000);
}

/**
 * Check if transaction was successful
 */
export function isSuccessfulTx(msg: CosmosMessage): boolean {
  return msg.tx.tx.code === 0;
}

/**
 * Generate unique ID for events
 */
export function generateEventId(
  txHash: string,
  msgIdx: number,
  eventIdx: number
): string {
  return `${txHash}-${msgIdx}-${eventIdx}`;
}

/**
 * Generate unique ID for messages
 */
export function generateMsgId(txHash: string, msgIdx: number): string {
  return `${txHash}-${msgIdx}`;
}

/**
 * Validate address format
 */
export function isValidCosmosAddress(address: string): boolean {
  return /^cosmos[a-z0-9]{39}$/.test(address);
}

/**
 * Validate validator operator address
 */
export function isValidValidatorAddress(address: string): boolean {
  return /^cosmosvaloper[a-z0-9]{39}$/.test(address);
}

/**
 * Extract proposal ID from string
 */
export function extractProposalId(str: string): string | null {
  const match = str.match(/\d+/);
  return match ? match[0] : null;
}

/**
 * Format large numbers for readability
 */
export function formatAmount(amount: string): string {
  try {
    return BigInt(amount).toString();
  } catch {
    return amount;
  }
}
