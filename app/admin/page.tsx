'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSignAndExecuteTransaction, useCurrentAccount, ConnectButton } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { CONTRACT_CONFIG, buildExplorerUrl } from '@/config/contracts';
import { Button } from '@/components/ui/button';

export default function AdminPage() {
  const router = useRouter();
  const account = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Register Protocol State
  const [protocolName, setProtocolName] = useState('');
  const [initialFunding, setInitialFunding] = useState('0.003');
  const [isRegistering, setIsRegistering] = useState(false);

  // Fund Vault State
  const [vaultId, setVaultId] = useState('');
  const [fundAmount, setFundAmount] = useState('0.003');
  const [isFunding, setIsFunding] = useState(false);

  // Check authentication
  useEffect(() => {
    const checkAuth = () => {
      const authData = localStorage.getItem('suiverify_admin_auth');
      if (!authData) {
        router.push('/auth');
      } else {
        setIsAuthenticated(true);
      }
      setIsCheckingAuth(false);
    };
    checkAuth();
  }, [router]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('suiverify_admin_auth');
    router.push('/auth');
  };

  // Register Protocol Function
  const handleRegisterProtocol = async () => {
    if (!account) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!protocolName.trim()) {
      toast.error('Please enter a protocol name');
      return;
    }

    const fundingAmount = parseFloat(initialFunding);
    if (isNaN(fundingAmount) || fundingAmount < CONTRACT_CONFIG.CONSTANTS.MIN_VAULT_AMOUNT_SUI) {
      toast.error(`Minimum funding amount is ${CONTRACT_CONFIG.CONSTANTS.MIN_VAULT_AMOUNT_SUI} SUI`);
      return;
    }

    setIsRegistering(true);

    try {
      const tx = new Transaction();
      const fundingAmountMist = Math.floor(fundingAmount * CONTRACT_CONFIG.CONSTANTS.MIST_PER_SUI);

      // Split coins for the initial funding
      const [coin] = tx.splitCoins(tx.gas, [fundingAmountMist]);

      // Call register_protocol - MUST match deployed contract signature
      tx.moveCall({
        target: `${CONTRACT_CONFIG.PACKAGE_ID}::payment::register_protocol`,
        arguments: [
          tx.object(CONTRACT_CONFIG.SHARED_OBJECTS.PAYMENT_REGISTRY),
          tx.object(CONTRACT_CONFIG.ADMIN_OBJECTS.PAYMENT_CAP),
          tx.pure.string(protocolName),
          tx.pure.address(account.address),
          coin,
          tx.object(CONTRACT_CONFIG.SHARED_OBJECTS.CLOCK),
        ],
      });

      signAndExecuteTransaction(
        { transaction: tx },
        {
          onSuccess: (result) => {
            console.log('Transaction successful:', result);
            toast.success(
              <div>
                <div>Protocol registered successfully! 🎉</div>
                <div className="text-xs mt-1">Check the explorer for your new Vault ID</div>
                <a
                  href={buildExplorerUrl(result.digest, 'tx')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline text-sm font-semibold"
                >
                  View on Explorer →
                </a>
              </div>,
              { autoClose: 8000 }
            );

            setProtocolName('');
            setInitialFunding('0.003');
          },
          onError: (error) => {
            console.error('Transaction failed:', error);
            toast.error(`Transaction failed: ${error.message}`);
          },
        }
      );
    } catch (error: any) {
      console.error('Error building transaction:', error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsRegistering(false);
    }
  };

  // Fund Vault Function
  const handleFundVault = async () => {
    if (!account) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!vaultId.trim()) {
      toast.error('Please enter a vault ID');
      return;
    }

    const fundingAmount = parseFloat(fundAmount);
    if (isNaN(fundingAmount) || fundingAmount <= 0) {
      toast.error('Please enter a valid funding amount');
      return;
    }

    setIsFunding(true);

    try {
      const tx = new Transaction();
      const fundingAmountMist = Math.floor(fundingAmount * CONTRACT_CONFIG.CONSTANTS.MIST_PER_SUI);

      // Split coins for funding
      const [coin] = tx.splitCoins(tx.gas, [fundingAmountMist]);

      // Call fund_vault - MUST match deployed contract signature
      tx.moveCall({
        target: `${CONTRACT_CONFIG.PACKAGE_ID}::payment::fund_vault`,
        arguments: [
          tx.object(CONTRACT_CONFIG.SHARED_OBJECTS.PAYMENT_REGISTRY),
          tx.object(CONTRACT_CONFIG.ADMIN_OBJECTS.PAYMENT_CAP),
          tx.object(vaultId),
          coin,
          tx.object(CONTRACT_CONFIG.SHARED_OBJECTS.CLOCK),
        ],
      });

      signAndExecuteTransaction(
        { transaction: tx },
        {
          onSuccess: (result) => {
            console.log('Transaction successful:', result);
            toast.success(
              <div>
                <div>Vault funded successfully! 💰</div>
                <a
                  href={buildExplorerUrl(result.digest, 'tx')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline text-sm font-semibold"
                >
                  View on Explorer →
                </a>
              </div>,
              { autoClose: 8000 }
            );

            setVaultId('');
            setFundAmount('0.003');
          },
          onError: (error) => {
            console.error('Transaction failed:', error);
            toast.error(`Transaction failed: ${error.message}`);
          },
        }
      );
    } catch (error: any) {
      console.error('Error building transaction:', error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsFunding(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ghost-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-charcoal-text">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-ghost-white outfit">
      {/* Header */}
      <header className="border-b-[3px] border-primary bg-white shadow-[0.1em_0.1em_0_0_rgb(0_0_0)]">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-charcoal-text">
                <span className="text-primary">Sui</span>Verify Admin
              </h1>
              <p className="text-charcoal-text/70 text-sm mt-1">
                Protocol Registration & Vault Management
              </p>
            </div>
            <div className="flex items-center gap-4">
              <ConnectButton />
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {!account ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white border-[3px] border-primary shadow-[0.1em_0.1em_0_0_rgb(0_0_0)] rounded-2xl p-12 text-center"
          >
            <div className="text-6xl mb-4">🔐</div>
            <h2 className="text-2xl font-bold text-charcoal-text mb-2">Wallet Not Connected</h2>
            <p className="text-charcoal-text/70 mb-6">
              Please connect your wallet to access the admin panel
            </p>
            <ConnectButton />
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Register Protocol Section */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white border-[3px] border-primary shadow-[0.1em_0.1em_0_0_rgb(0_0_0)] rounded-2xl p-6 hover:shadow-[0.15em_0.15em_0_0_rgb(0_0_0)] hover:-translate-x-[0.05em] hover:-translate-y-[0.05em] transition-all duration-150"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="text-3xl">📝</div>
                <div>
                  <h2 className="text-xl font-bold text-charcoal-text">Register Protocol</h2>
                  <p className="text-charcoal-text/70 text-sm">Create a new protocol vault</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal-text mb-2">
                    Protocol Name
                  </label>
                  <input
                    type="text"
                    value={protocolName}
                    onChange={(e) => setProtocolName(e.target.value)}
                    placeholder="e.g., MyProtocol"
                    className="w-full px-4 py-3 rounded-xl border-2 border-primary/30 text-charcoal-text placeholder-charcoal-text/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal-text mb-2">
                    Initial Funding (SUI)
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    min={CONTRACT_CONFIG.CONSTANTS.MIN_VAULT_AMOUNT_SUI}
                    value={initialFunding}
                    onChange={(e) => setInitialFunding(e.target.value)}
                    placeholder="0.003"
                    className="w-full px-4 py-3 rounded-xl border-2 border-primary/30 text-charcoal-text placeholder-charcoal-text/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                  />
                  <p className="text-xs text-charcoal-text/60 mt-1">
                    Minimum: {CONTRACT_CONFIG.CONSTANTS.MIN_VAULT_AMOUNT_SUI} SUI
                  </p>
                </div>

                <div className="bg-primary/10 border-2 border-primary/30 rounded-xl p-4">
                  <p className="text-sm text-charcoal-text font-medium mb-2">ℹ️ What happens:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-charcoal-text/70">
                    <li>Creates a new ProtocolVault on-chain</li>
                    <li>Minimum: {CONTRACT_CONFIG.CONSTANTS.MIN_VAULT_AMOUNT_SUI} SUI</li>
                    <li>Fee: {CONTRACT_CONFIG.CONSTANTS.SETTLEMENT_FEE_SUI} SUI per NFT</li>
                  </ul>
                </div>

                <Button
                  onClick={handleRegisterProtocol}
                  disabled={isRegistering || !protocolName.trim()}
                  className="w-full"
                  size="lg"
                >
                  {isRegistering ? 'Registering...' : 'Register Protocol'}
                </Button>
              </div>
            </motion.div>

            {/* Fund Vault Section */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white border-[3px] border-secondary shadow-[0.1em_0.1em_0_0_rgb(0_0_0)] rounded-2xl p-6 hover:shadow-[0.15em_0.15em_0_0_rgb(0_0_0)] hover:-translate-x-[0.05em] hover:-translate-y-[0.05em] transition-all duration-150"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="text-3xl">💰</div>
                <div>
                  <h2 className="text-xl font-bold text-charcoal-text">Fund Vault</h2>
                  <p className="text-charcoal-text/70 text-sm">Add funds to existing vault</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal-text mb-2">
                    Protocol Vault ID
                  </label>
                  <input
                    type="text"
                    value={vaultId}
                    onChange={(e) => setVaultId(e.target.value)}
                    placeholder="0x..."
                    className="w-full px-4 py-3 rounded-xl border-2 border-secondary/30 text-charcoal-text placeholder-charcoal-text/40 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary font-mono text-sm transition-all duration-300"
                  />
                  <p className="text-xs text-charcoal-text/60 mt-1">
                    Enter vault ID from protocol registration
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal-text mb-2">
                    Funding Amount (SUI)
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    min="0.001"
                    value={fundAmount}
                    onChange={(e) => setFundAmount(e.target.value)}
                    placeholder="0.003"
                    className="w-full px-4 py-3 rounded-xl border-2 border-secondary/30 text-charcoal-text placeholder-charcoal-text/40 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all duration-300"
                  />
                </div>

                <div className="bg-secondary/10 border-2 border-secondary/30 rounded-xl p-4">
                  <p className="text-sm text-charcoal-text font-medium mb-2">ℹ️ What happens:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-charcoal-text/70">
                    <li>Adds SUI to the protocol vault</li>
                    <li>Vault must exist from registration</li>
                    <li>Only vault owner can fund</li>
                  </ul>
                </div>

                <Button
                  onClick={handleFundVault}
                  disabled={isFunding || !vaultId.trim()}
                  variant="secondary"
                  className="w-full"
                  size="lg"
                >
                  {isFunding ? 'Funding...' : 'Fund Vault'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Contract Info */}
        {account && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 bg-white border-[3px] border-charcoal-text/20 shadow-[0.1em_0.1em_0_0_rgb(0_0_0)] rounded-2xl p-6"
          >
            <h3 className="text-lg font-bold text-charcoal-text mb-4">Contract Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-charcoal-text/70 mb-1">Package ID</p>
                <p className="text-charcoal-text font-mono text-xs break-all bg-ghost-white px-3 py-2 rounded-lg">
                  {CONTRACT_CONFIG.PACKAGE_ID}
                </p>
              </div>
              <div>
                <p className="text-charcoal-text/70 mb-1">Payment Registry</p>
                <p className="text-charcoal-text font-mono text-xs break-all bg-ghost-white px-3 py-2 rounded-lg">
                  {CONTRACT_CONFIG.SHARED_OBJECTS.PAYMENT_REGISTRY}
                </p>
              </div>
              <div>
                <p className="text-charcoal-text/70 mb-1">Network</p>
                <p className="text-charcoal-text bg-ghost-white px-3 py-2 rounded-lg">
                  {CONTRACT_CONFIG.NETWORK.NETWORK}
                </p>
              </div>
              <div>
                <p className="text-charcoal-text/70 mb-1">Settlement Fee</p>
                <p className="text-charcoal-text bg-ghost-white px-3 py-2 rounded-lg">
                  {CONTRACT_CONFIG.CONSTANTS.SETTLEMENT_FEE_SUI} SUI per NFT
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
