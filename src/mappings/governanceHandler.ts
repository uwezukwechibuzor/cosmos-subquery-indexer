import { CosmosMessage, CosmosEvent } from "@subql/types-cosmos";
import { Proposal, Vote, Deposit } from "../types";
import {
  getOrCreateAccount,
  getTimestamp,
  isSuccessfulTx,
  generateMsgId,
  getEventAttribute,
  extractProposalId,
  parseCoins,
} from "../utils/helpers";

/**
 * Map vote option number to enum
 */
function mapVoteOption(option: number): string {
  switch (option) {
    case 1:
      return "YES";
    case 2:
      return "ABSTAIN";
    case 3:
      return "NO";
    case 4:
      return "NO_WITH_VETO";
    default:
      return "ABSTAIN";
  }
}

/**
 * Handler for MsgSubmitProposal
 */
export async function handleSubmitProposalMessage(
  msg: CosmosMessage
): Promise<void> {
  if (!msg.msg.decodedMsg) return;

  const success = isSuccessfulTx(msg);
  if (!success) return;

  const blockHeight = BigInt(msg.block.block.header.height);
  const timestamp = getTimestamp(msg.block);

  const proposer = msg.msg.decodedMsg.proposer;
  const initialDeposit = msg.msg.decodedMsg.initialDeposit;
  const content = msg.msg.decodedMsg.content;

  if (!proposer) {
    return;
  }

  // Ensure proposer account exists
  await getOrCreateAccount(proposer, blockHeight, timestamp);

  // The proposal ID is typically in the events
  // We'll capture it in the event handler
  logger.info(`Proposal submitted by ${proposer} at block ${blockHeight}`);
}

/**
 * Handler for submit_proposal event
 */
export async function handleProposalEvent(event: CosmosEvent): Promise<void> {
  if (!event.msg) return;
  
  const blockHeight = BigInt(event.block.block.header.height);
  const timestamp = getTimestamp(event.block);

  const proposalIdStr = getEventAttribute(event, "proposal_id");
  const proposer = getEventAttribute(event, "proposal_proposer") || 
                   getEventAttribute(event, "proposer");

  if (!proposalIdStr || !proposer) {
    return;
  }

  // Ensure proposer account exists
  await getOrCreateAccount(proposer, blockHeight, timestamp);

  // Extract proposal details from message if available
  let title = "Unknown Proposal";
  let description = "";
  let proposalType = "unknown";

  if (event.msg.msg.decodedMsg?.content) {
    const content = event.msg.msg.decodedMsg.content;
    title = content.title || title;
    description = content.description || "";
    proposalType = content.typeUrl || proposalType;
  }

  const proposal = Proposal.create({
    id: proposalIdStr,
    proposalId: proposalIdStr,
    type: proposalType,
    title,
    description,
    status: "DEPOSIT_PERIOD" as any,
    submitTime: timestamp,
    proposer,
    blockHeight,
    txHash: event.tx.hash,
  });

  await proposal.save();
}

/**
 * Handler for MsgVote
 */
export async function handleVoteMessage(msg: CosmosMessage): Promise<void> {
  if (!msg.msg.decodedMsg) return;

  const success = isSuccessfulTx(msg);
  if (!success) return;

  const blockHeight = BigInt(msg.block.block.header.height);
  const timestamp = getTimestamp(msg.block);

  const proposalId = msg.msg.decodedMsg.proposalId?.toString();
  const voter = msg.msg.decodedMsg.voter;
  const option = msg.msg.decodedMsg.option;

  if (!proposalId || !voter || option === undefined) {
    return;
  }

  // Ensure voter account exists
  await getOrCreateAccount(voter, blockHeight, timestamp);

  // Check if proposal exists
  let proposal = await Proposal.get(proposalId);
  if (!proposal) {
    // Create a placeholder proposal if it doesn't exist
    proposal = Proposal.create({
      id: proposalId,
      proposalId: proposalId,
      type: "unknown",
      title: "Unknown",
      description: "",
      status: "VOTING_PERIOD" as any,
      submitTime: timestamp,
      proposer: "unknown",
      blockHeight,
      txHash: msg.tx.hash,
    });
    await proposal.save();
  }

  const voteId = `${proposalId}-${voter}`;
  const voteOption = mapVoteOption(option) as any;

  const vote = Vote.create({
    id: voteId,
    proposalId: proposalId,
    voterId: voter,
    option: voteOption,
    blockHeight,
    timestamp,
    txHash: msg.tx.hash,
  });

  await vote.save();
}

/**
 * Handler for MsgDeposit
 */
export async function handleDepositMessage(msg: CosmosMessage): Promise<void> {
  if (!msg.msg.decodedMsg) return;

  const success = isSuccessfulTx(msg);
  if (!success) return;

  const blockHeight = BigInt(msg.block.block.header.height);
  const timestamp = getTimestamp(msg.block);

  const proposalId = msg.msg.decodedMsg.proposalId?.toString();
  const depositor = msg.msg.decodedMsg.depositor;
  const amount = msg.msg.decodedMsg.amount;

  if (!proposalId || !depositor || !amount || amount.length === 0) {
    return;
  }

  // Process each coin in the deposit
  for (let i = 0; i < amount.length; i++) {
    const coin = amount[i];

    const deposit = Deposit.create({
      id: generateMsgId(msg.tx.hash, msg.idx) + `-${i}`,
      proposalId: proposalId,
      depositor,
      amount: coin.amount,
      denom: coin.denom,
      blockHeight,
      timestamp,
      txHash: msg.tx.hash,
    });

    await deposit.save();
  }
}
