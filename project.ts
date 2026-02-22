import {
  CosmosDatasourceKind,
  CosmosHandlerKind,
  CosmosProject,
} from "@subql/types-cosmos";

// Can expand the Datasource processor types via the generic param
const project: CosmosProject = {
  specVersion: "1.0.0",
  version: "1.0.0",
  name: "cosmos-hub-subquery-indexer",
  description:
    "Production-ready SubQuery indexer for Cosmos Hub - tracks transfers, staking, governance, IBC, and more",
  runner: {
    node: {
      name: "@subql/node-cosmos",
      version: ">=3.0.0",
    },
    query: {
      name: "@subql/query",
      version: "*",
    },
  },
  schema: {
    file: "./schema.graphql",
  },
  network: {
    /* Cosmos Hub (cosmoshub-4) */
    chainId: "cosmoshub-4",
    /**
     * These endpoint(s) should be public non-pruned archive nodes
     * Public nodes may be rate limited
     * You can get your own endpoint from providers like:
     * - https://www.allthatnode.com
     * - https://cosmos-rpc.polkachu.com
     */
    endpoint: [
      "https://cosmos-rpc.polkachu.com",
      "https://rpc-cosmoshub.blockapsis.com",
      "https://cosmos-rpc.quickapi.com",
    ],
  },
  dataSources: [
    {
      kind: CosmosDatasourceKind.Runtime,
      startBlock: 5200791, // Cosmos Hub upgrade height - adjust as needed
      mapping: {
        file: "./dist/index.js",
        handlers: [
          // ============================================
          // Block Handler - Track all blocks
          // ============================================
          {
            handler: "handleBlock",
            kind: CosmosHandlerKind.Block,
          },

          // ============================================
          // Bank Module - Transfers
          // ============================================
          {
            handler: "handleTransferMessage",
            kind: CosmosHandlerKind.Message,
            filter: {
              type: "/cosmos.bank.v1beta1.MsgSend",
            },
          },
          {
            handler: "handleTransferEvent",
            kind: CosmosHandlerKind.Event,
            filter: {
              type: "transfer",
              messageFilter: {
                type: "/cosmos.bank.v1beta1.MsgSend",
              },
            },
          },

          // ============================================
          // Staking Module - Delegations
          // ============================================
          {
            handler: "handleDelegateMessage",
            kind: CosmosHandlerKind.Message,
            filter: {
              type: "/cosmos.staking.v1beta1.MsgDelegate",
            },
          },
          {
            handler: "handleUndelegateMessage",
            kind: CosmosHandlerKind.Message,
            filter: {
              type: "/cosmos.staking.v1beta1.MsgUndelegate",
            },
          },
          {
            handler: "handleRedelegateMessage",
            kind: CosmosHandlerKind.Message,
            filter: {
              type: "/cosmos.staking.v1beta1.MsgBeginRedelegate",
            },
          },
          {
            handler: "handleDelegateEvent",
            kind: CosmosHandlerKind.Event,
            filter: {
              type: "delegate",
            },
          },

          // ============================================
          // Distribution Module - Rewards
          // ============================================
          {
            handler: "handleWithdrawRewardsMessage",
            kind: CosmosHandlerKind.Message,
            filter: {
              type: "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward",
            },
          },
          {
            handler: "handleWithdrawCommissionMessage",
            kind: CosmosHandlerKind.Message,
            filter: {
              type: "/cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission",
            },
          },
          {
            handler: "handleRewardEvent",
            kind: CosmosHandlerKind.Event,
            filter: {
              type: "withdraw_rewards",
            },
          },
          {
            handler: "handleCommissionEvent",
            kind: CosmosHandlerKind.Event,
            filter: {
              type: "withdraw_commission",
            },
          },

          // ============================================
          // Governance Module
          // ============================================
          {
            handler: "handleSubmitProposalMessage",
            kind: CosmosHandlerKind.Message,
            filter: {
              type: "/cosmos.gov.v1beta1.MsgSubmitProposal",
            },
          },
          {
            handler: "handleVoteMessage",
            kind: CosmosHandlerKind.Message,
            filter: {
              type: "/cosmos.gov.v1beta1.MsgVote",
            },
          },
          {
            handler: "handleDepositMessage",
            kind: CosmosHandlerKind.Message,
            filter: {
              type: "/cosmos.gov.v1beta1.MsgDeposit",
            },
          },
          {
            handler: "handleProposalEvent",
            kind: CosmosHandlerKind.Event,
            filter: {
              type: "submit_proposal",
            },
          },

          // ============================================
          // IBC Module - Cross-chain transfers
          // ============================================
          {
            handler: "handleIBCTransferMessage",
            kind: CosmosHandlerKind.Message,
            filter: {
              type: "/ibc.applications.transfer.v1.MsgTransfer",
            },
          },
          {
            handler: "handleIBCTransferEvent",
            kind: CosmosHandlerKind.Event,
            filter: {
              type: "ibc_transfer",
            },
          },
        ],
      },
    },
  ],
};

export default project;
