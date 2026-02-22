import { CosmosMessage, CosmosEvent } from "@subql/types-cosmos";
import { IBCTransfer } from "../types";
import {
  getTimestamp,
  isSuccessfulTx,
  generateMsgId,
  getEventAttribute,
} from "../utils/helpers";

/**
 * Handler for IBC MsgTransfer
 */
export async function handleIBCTransferMessage(
  msg: CosmosMessage
): Promise<void> {
  if (!msg.msg.decodedMsg) return;

  const blockHeight = BigInt(msg.block.block.header.height);
  const timestamp = getTimestamp(msg.block);
  const success = isSuccessfulTx(msg);

  const sourcePort = msg.msg.decodedMsg.sourcePort;
  const sourceChannel = msg.msg.decodedMsg.sourceChannel;
  const token = msg.msg.decodedMsg.token;
  const sender = msg.msg.decodedMsg.sender;
  const receiver = msg.msg.decodedMsg.receiver;
  const timeoutHeight = msg.msg.decodedMsg.timeoutHeight;
  const timeoutTimestamp = msg.msg.decodedMsg.timeoutTimestamp;
  const memo = msg.msg.decodedMsg.memo;

  if (!sourcePort || !sourceChannel || !token || !sender || !receiver) {
    return;
  }

  const ibcTransfer = IBCTransfer.create({
    id: generateMsgId(msg.tx.hash, msg.idx),
    blockHeight,
    timestamp,
    txHash: msg.tx.hash,
    sender,
    receiver,
    amount: token.amount,
    denom: token.denom,
    sourcePort,
    sourceChannel,
    destinationPort: "", // Usually set in ack
    destinationChannel: "", // Usually set in ack
    timeoutHeight: timeoutHeight?.revisionHeight?.toString() || "",
    timeoutTimestamp: timeoutTimestamp?.toString() || "",
    memo: memo || "",
    success,
  });

  await ibcTransfer.save();
}

/**
 * Handler for IBC transfer events
 */
export async function handleIBCTransferEvent(event: CosmosEvent): Promise<void> {
  const blockHeight = BigInt(event.block.block.header.height);
  const timestamp = getTimestamp(event.block);

  const sender = getEventAttribute(event, "sender");
  const receiver = getEventAttribute(event, "receiver");
  const amount = getEventAttribute(event, "amount");
  const denom = getEventAttribute(event, "denom");

  if (!sender || !receiver || !amount || !denom) {
    return;
  }

  logger.info(
    `IBC Transfer event: ${sender} -> ${receiver}, ${amount}${denom} at block ${blockHeight}`
  );
}
