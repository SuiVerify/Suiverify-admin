// SuiVerify Admin - Contract Configuration
// Payment contract configuration for protocol registration and vault management

// =============================================================================
// PACKAGE ID - Payment Contract
// =============================================================================

export const PAYMENT_PACKAGE_ID =
  process.env.NEXT_PUBLIC_PAYMENT_PACKAGE_ID ||
  '0xac8705fa3257db9641ba4ff340060984f42124cc2dfab9903d7505323c0080a3';

// =============================================================================
// SHARED OBJECTS - Payment Registry and System Objects
// =============================================================================

export const SHARED_OBJECTS = {
  // Payment Registry - Shared object for protocol registration
  PAYMENT_REGISTRY:
    process.env.NEXT_PUBLIC_PAYMENT_REGISTRY ||
    '0xf9f37bcd05810d2929e2446d498c63a218b3d18c73227e7964ffae936000830d',

  // SUI Clock object - System clock for timestamp operations
  CLOCK:
    process.env.NEXT_PUBLIC_CLOCK ||
    '0x0000000000000000000000000000000000000000000000000000000000000006',
} as const;

// =============================================================================
// ADMIN CAPABILITIES
// =============================================================================

export const ADMIN_OBJECTS = {
  // PaymentCap - Admin capability for payment operations
  PAYMENT_CAP:
    process.env.NEXT_PUBLIC_PAYMENT_CAP ||
    '0x4a7cee5cddeef2bc33679880e1ef779f4c8077e1b20e1e3beee9e8644ecf9f8a',
} as const;

// =============================================================================
// NETWORK CONFIGURATION
// =============================================================================

export const NETWORK_CONFIG = {
  // Current active network
  NETWORK: process.env.NEXT_PUBLIC_NETWORK || 'testnet',

  // RPC endpoint
  RPC_URL: process.env.NEXT_PUBLIC_RPC_URL || 'https://fullnode.testnet.sui.io:443',

  // Explorer URL
  EXPLORER_URL: 'https://suiscan.xyz/testnet',
} as const;

// =============================================================================
// CONTRACT FUNCTION TARGETS
// =============================================================================

export const CONTRACT_FUNCTIONS = {
  // Register a new protocol with initial vault funding
  REGISTER_PROTOCOL: `${PAYMENT_PACKAGE_ID}::payment::register_protocol`,

  // Add funds to an existing protocol vault
  FUND_VAULT: `${PAYMENT_PACKAGE_ID}::payment::fund_vault`,

  // Get vault balance
  GET_VAULT_BALANCE: `${PAYMENT_PACKAGE_ID}::payment::get_vault_balance`,

  // Get registry stats
  GET_REGISTRY_STATS: `${PAYMENT_PACKAGE_ID}::payment::get_registry_stats`,
} as const;

// =============================================================================
// PAYMENT CONSTANTS
// =============================================================================

export const PAYMENT_CONSTANTS = {
  // Minimum vault amount: 0.003 SUI (3,000,000 MIST)
  MIN_VAULT_AMOUNT: parseInt(process.env.NEXT_PUBLIC_MIN_VAULT_AMOUNT_MIST || '3000000'),
  MIN_VAULT_AMOUNT_SUI: parseFloat(process.env.NEXT_PUBLIC_MIN_VAULT_AMOUNT_SUI || '0.003'),

  // Settlement fee per NFT: 10 SUI (10,000,000,000 MIST)
  SETTLEMENT_FEE: parseInt(process.env.NEXT_PUBLIC_SETTLEMENT_FEE_MIST || '10000000000'),
  SETTLEMENT_FEE_SUI: parseFloat(process.env.NEXT_PUBLIC_SETTLEMENT_FEE_SUI || '10'),

  // 1 SUI = 1,000,000,000 MIST
  MIST_PER_SUI: 1_000_000_000,
} as const;

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Convert SUI to MIST
 */
export const suiToMist = (sui: number): bigint => {
  return BigInt(Math.floor(sui * PAYMENT_CONSTANTS.MIST_PER_SUI));
};

/**
 * Convert MIST to SUI
 */
export const mistToSui = (mist: bigint | number): number => {
  return Number(mist) / PAYMENT_CONSTANTS.MIST_PER_SUI;
};

/**
 * Build explorer URL for a specific object/transaction/account
 */
export const buildExplorerUrl = (
  objectId: string,
  type: 'object' | 'tx' | 'account' = 'object'
): string => {
  return `${NETWORK_CONFIG.EXPLORER_URL}/${type}/${objectId}`;
};

// =============================================================================
// EXPORT DEFAULT CONFIG
// =============================================================================

export const CONTRACT_CONFIG = {
  PACKAGE_ID: PAYMENT_PACKAGE_ID,
  SHARED_OBJECTS,
  ADMIN_OBJECTS,
  NETWORK: NETWORK_CONFIG,
  FUNCTIONS: CONTRACT_FUNCTIONS,
  CONSTANTS: PAYMENT_CONSTANTS,
} as const;

export default CONTRACT_CONFIG;
