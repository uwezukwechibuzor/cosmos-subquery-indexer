import { CosmosMessage, CosmosEvent } from "@subql/types-cosmos";
import { Reward, Commission } from "../types";
import {
  getTimestamp,
  isSuccessfulTx,
  generateEventId,
  getEventAttribute,
  parseCoins,
} from "../utils/helpers";

/**
 * Handler for MsgWithdrawDelegatorReward
 */
export async function handleWithdrawRewardsMessage(
  msg: CosmosMessage
): Promise<void> {
  if (!msg.msg.decodedMsg) return;

  const success = isSuccessfulTx(msg);
  if (!success) return;

  const blockHeight = BigInt(msg.block.block.header.height);
  const timestamp = getTimestamp(msg.block);

  const delegatorAddress = msg.msg.decodedMsg.delegatorAddress;
  const validatorAddress = msg.msg.decodedMsg.validatorAddress;

  if (!delegatorAddress || !validatorAddress) {
    return;
  }

  // Note: The actual reward amount is typically in the event, not the message
  // We'll capture it in the event handler
  logger.info(
    `Reward withdrawal requested: ${delegatorAddress} from ${validatorAddress} at block ${blockHeight}`
  );
}

/**
 * Handler for withdraw_rewards event
 */
export async function handleRewardEvent(event: CosmosEvent): Promise<void> {
  if (!event.msg) return;
  
  const blockHeight = BigInt(event.block.block.header.height);
  const timestamp = getTimestamp(event.block);

  const validator = getEventAttribute(event, "validator");
  const delegator = getEventAttribute(event, "delegator");
  const amountStr = getEventAttribute(event, "amount");

  if (!validator || !delegator || !amountStr) {
    return;
  }

  // Parse all coins in the reward
  const coins = parseCoins(amountStr);

  for (let i = 0; i < coins.length; i++) {
    const coin = coins[i];

    const reward = Reward.create({
      id: generateEventId(event.tx.hash, event.msg.idx, event.idx + i),
      delegator,
      validator,
      amount: coin.amount,
      denom: coin.denom,
      blockHeight,
      timestamp,
      txHash: event.tx.hash,
    });

    await reward.save();
  }
}

/**
 * Handler for MsgWithdrawValidatorCommission
 */
export async function handleWithdrawCommissionMessage(
  msg: CosmosMessage
): Promise<void> {
  if (!msg.msg.decodedMsg) return;

  const success = isSuccessfulTx(msg);
  if (!success) return;

  const blockHeight = BigInt(msg.block.block.header.height);
  const timestamp = getTimestamp(msg.block);

  const validatorAddress = msg.msg.decodedMsg.validatorAddress;

  if (!validatorAddress) {
    return;
  }

  logger.info(
    `Commission withdrawal requested: ${validatorAddress} at block ${blockHeight}`
  );
}

/**
 * Handler for withdraw_commission event
 */
export async function handleCommissionEvent(event: CosmosEvent): Promise<void> {
  if (!event.msg) return;
  
  const blockHeight = BigInt(event.block.block.header.height);
  const timestamp = getTimestamp(event.block);

  const validator = getEventAttribute(event, "validator");
  const amountStr = getEventAttribute(event, "amount");

  if (!validator || !amountStr) {
    return;
  }

  // Parse all coins in the commission
  const coins = parseCoins(amountStr);

  for (let i = 0; i < coins.length; i++) {
    const coin = coins[i];

    const commission = Commission.create({
      id: generateEventId(event.tx.hash, event.msg.idx, event.idx + i),
      validator,
      amount: coin.amount,
      denom: coin.denom,
      blockHeight,
      timestamp,
      txHash: event.tx.hash,
    });

    await commission.save();
  }
}
