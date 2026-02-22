import { CosmosMessage, CosmosEvent } from "@subql/types-cosmos";
import { Transfer, Account } from "../types";
import {
  getOrCreateAccount,
  getEventAttribute,
  getTimestamp,
  isSuccessfulTx,
  generateEventId,
  parseAmount,
} from "../utils/helpers";

/**
 * Handler for MsgSend messages
 */
export async function handleTransferMessage(
  msg: CosmosMessage
): Promise<void> {
  if (!msg.msg.decodedMsg) {
    logger.warn(`Message not decoded at block ${msg.block.block.header.height}`);
    return;
  }

  const blockHeight = BigInt(msg.block.block.header.height);
  const timestamp = getTimestamp(msg.block);
  const success = isSuccessfulTx(msg);

  const fromAddress = msg.msg.decodedMsg.fromAddress;
  const toAddress = msg.msg.decodedMsg.toAddress;
  const amount = msg.msg.decodedMsg.amount;

  if (!fromAddress || !toAddress || !amount || amount.length === 0) {
    logger.warn(`Invalid transfer data at block ${blockHeight}`);
    return;
  }

  // Get or create accounts
  const fromAccount = await getOrCreateAccount(fromAddress, blockHeight, timestamp);
  const toAccount = await getOrCreateAccount(toAddress, blockHeight, timestamp);

  // Update transaction counts
  fromAccount.totalTransactionsSent += 1;
  toAccount.totalTransactionsReceived += 1;

  await fromAccount.save();
  await toAccount.save();

  // Process each coin in the transfer
  for (let i = 0; i < amount.length; i++) {
    const coin = amount[i];

    const transfer = Transfer.create({
      id: `${msg.tx.hash}-${msg.idx}-${i}`,
      blockHeight,
      timestamp,
      txHash: msg.tx.hash,
      fromId: fromAddress,
      toId: toAddress,
      amount: coin.amount,
      denom: coin.denom,
      success,
    });

    await transfer.save();
  }
}

/**
 * Handler for transfer events
 * Captures transfers that happen as part of other operations
 */
export async function handleTransferEvent(event: CosmosEvent): Promise<void> {
  if (!event.msg) return;
  
  const blockHeight = BigInt(event.block.block.header.height);
  const timestamp = getTimestamp(event.block);

  const recipient = getEventAttribute(event, "recipient");
  const sender = getEventAttribute(event, "sender");
  const amountStr = getEventAttribute(event, "amount");

  if (!recipient || !sender || !amountStr) {
    return;
  }

  // Get or create accounts
  await getOrCreateAccount(sender, blockHeight, timestamp);
  await getOrCreateAccount(recipient, blockHeight, timestamp);

  const parsed = parseAmount(amountStr);
  if (!parsed) {
    logger.warn(`Could not parse amount: ${amountStr}`);
    return;
  }

  const transfer = Transfer.create({
    id: generateEventId(event.tx.hash, event.msg.idx, event.idx),
    blockHeight,
    timestamp,
    txHash: event.tx.hash,
    fromId: sender,
    toId: recipient,
    amount: parsed.amount,
    denom: parsed.denom,
    success: true,
  });

  await transfer.save();
}
