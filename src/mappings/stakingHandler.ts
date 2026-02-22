import { CosmosMessage, CosmosEvent } from "@subql/types-cosmos";
import {
  Validator,
  Delegation,
  Undelegation,
  Redelegation,
  Account,
} from "../types";
import {
  getOrCreateAccount,
  getTimestamp,
  isSuccessfulTx,
  generateMsgId,
  getEventAttribute,
  isValidValidatorAddress,
} from "../utils/helpers";

/**
 * Get or create a validator entity
 */
async function getOrCreateValidator(
  operatorAddress: string,
  blockHeight: bigint,
  timestamp: Date
): Promise<Validator> {
  let validator = await Validator.get(operatorAddress);

  if (!validator) {
    validator = Validator.create({
      id: operatorAddress,
      address: operatorAddress,
      moniker: "Unknown",
      status: "BONDED" as any,
      jailed: false,
      firstSeenBlock: blockHeight,
      firstSeenTime: timestamp,
    });
    await validator.save();
  }

  return validator;
}

/**
 * Handler for MsgDelegate
 */
export async function handleDelegateMessage(msg: CosmosMessage): Promise<void> {
  if (!msg.msg.decodedMsg) return;

  const blockHeight = BigInt(msg.block.block.header.height);
  const timestamp = getTimestamp(msg.block);
  const success = isSuccessfulTx(msg);

  if (!success) return;

  const delegatorAddress = msg.msg.decodedMsg.delegatorAddress;
  const validatorAddress = msg.msg.decodedMsg.validatorAddress;
  const amount = msg.msg.decodedMsg.amount;

  if (!delegatorAddress || !validatorAddress || !amount) {
    return;
  }

  // Ensure account and validator exist
  await getOrCreateAccount(delegatorAddress, blockHeight, timestamp);
  await getOrCreateValidator(validatorAddress, blockHeight, timestamp);

  // Create or update delegation
  const delegationId = `${delegatorAddress}-${validatorAddress}`;
  let delegation = await Delegation.get(delegationId);

  if (!delegation) {
    delegation = Delegation.create({
      id: delegationId,
      delegatorId: delegatorAddress,
      validatorId: validatorAddress,
      shares: amount.amount,
      amount: amount.amount,
      blockHeight,
      timestamp,
    });
  } else {
    // Update existing delegation
    const currentShares = BigInt(delegation.shares);
    const newShares = BigInt(amount.amount);
    delegation.shares = (currentShares + newShares).toString();
    delegation.amount = delegation.shares;
    delegation.blockHeight = blockHeight;
    delegation.timestamp = timestamp;
  }

  await delegation.save();
}

/**
 * Handler for delegate events
 */
export async function handleDelegateEvent(event: CosmosEvent): Promise<void> {
  const blockHeight = BigInt(event.block.block.header.height);
  const timestamp = getTimestamp(event.block);

  const validator = getEventAttribute(event, "validator");
  const delegator = getEventAttribute(event, "delegator");
  const amountStr = getEventAttribute(event, "amount");

  if (!validator || !delegator || !amountStr) {
    return;
  }

  // Ensure entities exist
  await getOrCreateAccount(delegator, blockHeight, timestamp);
  await getOrCreateValidator(validator, blockHeight, timestamp);
}

/**
 * Handler for MsgUndelegate
 */
export async function handleUndelegateMessage(
  msg: CosmosMessage
): Promise<void> {
  if (!msg.msg.decodedMsg) return;

  const blockHeight = BigInt(msg.block.block.header.height);
  const timestamp = getTimestamp(msg.block);
  const success = isSuccessfulTx(msg);

  if (!success) return;

  const delegatorAddress = msg.msg.decodedMsg.delegatorAddress;
  const validatorAddress = msg.msg.decodedMsg.validatorAddress;
  const amount = msg.msg.decodedMsg.amount;

  if (!delegatorAddress || !validatorAddress || !amount) {
    return;
  }

  // Calculate completion time (usually 21 days for Cosmos Hub)
  const completionTime = new Date(timestamp.getTime() + 21 * 24 * 60 * 60 * 1000);

  const undelegation = Undelegation.create({
    id: generateMsgId(msg.tx.hash, msg.idx),
    delegator: delegatorAddress,
    validator: validatorAddress,
    amount: amount.amount,
    denom: amount.denom,
    completionTime,
    blockHeight,
    timestamp,
    txHash: msg.tx.hash,
  });

  await undelegation.save();

  // Update delegation
  const delegationId = `${delegatorAddress}-${validatorAddress}`;
  const delegation = await Delegation.get(delegationId);

  if (delegation) {
    const currentShares = BigInt(delegation.shares);
    const removeShares = BigInt(amount.amount);
    const newShares = currentShares - removeShares;

    if (newShares > BigInt(0)) {
      delegation.shares = newShares.toString();
      delegation.amount = delegation.shares;
      await delegation.save();
    } else {
      // Remove delegation if fully undelegated
      await Delegation.remove(delegationId);
    }
  }
}

/**
 * Handler for MsgBeginRedelegate
 */
export async function handleRedelegateMessage(
  msg: CosmosMessage
): Promise<void> {
  if (!msg.msg.decodedMsg) return;

  const blockHeight = BigInt(msg.block.block.header.height);
  const timestamp = getTimestamp(msg.block);
  const success = isSuccessfulTx(msg);

  if (!success) return;

  const delegatorAddress = msg.msg.decodedMsg.delegatorAddress;
  const validatorSrcAddress = msg.msg.decodedMsg.validatorSrcAddress;
  const validatorDstAddress = msg.msg.decodedMsg.validatorDstAddress;
  const amount = msg.msg.decodedMsg.amount;

  if (
    !delegatorAddress ||
    !validatorSrcAddress ||
    !validatorDstAddress ||
    !amount
  ) {
    return;
  }

  const completionTime = new Date(timestamp.getTime() + 21 * 24 * 60 * 60 * 1000);

  const redelegation = Redelegation.create({
    id: generateMsgId(msg.tx.hash, msg.idx),
    delegator: delegatorAddress,
    validatorSrc: validatorSrcAddress,
    validatorDst: validatorDstAddress,
    amount: amount.amount,
    denom: amount.denom,
    completionTime,
    blockHeight,
    timestamp,
    txHash: msg.tx.hash,
  });

  await redelegation.save();

  // Update source delegation
  const srcDelegationId = `${delegatorAddress}-${validatorSrcAddress}`;
  const srcDelegation = await Delegation.get(srcDelegationId);

  if (srcDelegation) {
    const currentShares = BigInt(srcDelegation.shares);
    const moveShares = BigInt(amount.amount);
    const newShares = currentShares - moveShares;

    if (newShares > BigInt(0)) {
      srcDelegation.shares = newShares.toString();
      srcDelegation.amount = srcDelegation.shares;
      await srcDelegation.save();
    } else {
      await Delegation.remove(srcDelegationId);
    }
  }

  // Ensure destination validator exists
  await getOrCreateValidator(validatorDstAddress, blockHeight, timestamp);

  // Create or update destination delegation
  const dstDelegationId = `${delegatorAddress}-${validatorDstAddress}`;
  let dstDelegation = await Delegation.get(dstDelegationId);

  if (!dstDelegation) {
    dstDelegation = Delegation.create({
      id: dstDelegationId,
      delegatorId: delegatorAddress,
      validatorId: validatorDstAddress,
      shares: amount.amount,
      amount: amount.amount,
      blockHeight,
      timestamp,
    });
  } else {
    const currentShares = BigInt(dstDelegation.shares);
    const addShares = BigInt(amount.amount);
    dstDelegation.shares = (currentShares + addShares).toString();
    dstDelegation.amount = dstDelegation.shares;
    dstDelegation.blockHeight = blockHeight;
    dstDelegation.timestamp = timestamp;
  }

  await dstDelegation.save();
}
