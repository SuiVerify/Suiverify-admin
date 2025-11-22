# SuiVerify Admin Dashboard

A comprehensive administrative interface for managing protocols, vaults, and payment settlements on the Sui blockchain. Built with Next.js, TypeScript, and integrated with Sui's blockchain infrastructure.

## 🎯 Overview

The SuiVerify Admin Dashboard provides protocol administrators with tools to:

- Register new protocols on the payment system
- Fund protocol vaults for settlement operations
- Monitor vault balances and settlement statistics
- Manage payment settlements for verification services

## ✨ Key Features

### 🔐 **Authentication**

- **zkLogin Integration**: Secure authentication using Google OAuth + Zero-Knowledge proofs
- **Sui Address Generation**: Deterministic wallet addresses from social login
- **Session Management**: 24-hour proof caching for seamless user experience

### 💰 **Protocol Management**

- **Protocol Registration**: Register new protocols with initial funding
- **Vault Funding**: Add funds to protocol vaults for settlements
- **Balance Monitoring**: Real-time vault balance tracking
- **Transaction History**: Complete audit trail of all operations

### 📊 **Smart Contract Integration**

- **Payment Registry**: Integration with Sui payment smart contracts
- **Settlement Operations**: Automated NFT payment settlements
- **Vault Management**: Protocol-specific vault operations
- **Gas Sponsorship**: Sponsored transactions for seamless UX

## 🏗️ Architecture

```
Frontend (Next.js)
├── Authentication (zkLogin)
├── UI Components (Tailwind CSS)
└── Sui Client Integration

Backend Services
├── Sui Payment Contracts
├── Enoki zkLogin Service
└── Protocol Registry
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Sui testnet access
- Google OAuth credentials
- Enoki API access

### Installation

```bash
# Clone the repository
git clone https://github.com/SuiVerify/Suiverify-admin.git
cd Suiverify-admin

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration
```

### Environment Configuration

```env
# Sui Network Configuration
NEXT_PUBLIC_SUI_NETWORK=testnet
NEXT_PUBLIC_SUI_RPC_URL=https://fullnode.testnet.sui.io

# Smart Contract Addresses
NEXT_PUBLIC_PACKAGE_ID=0xac8705fa3257db9641ba4ff340060984f42124cc2dfab9903d7505323c0080a3
NEXT_PUBLIC_PAYMENT_REGISTRY=0xf9f37bcd05810d2929e2446d498c63a218b3d18c73227e7964ffae936000830d

# zkLogin Configuration
NEXT_PUBLIC_ENOKI_API_KEY=your_enoki_public_key
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_REDIRECT_URL=http://localhost:3000/callback

# Enoki API Endpoints
NEXT_PUBLIC_ENOKI_NONCE_URL=https://api.enoki.mystenlabs.com/v1/zklogin/nonce
NEXT_PUBLIC_ENOKI_ZKP_URL=https://api.enoki.mystenlabs.com/v1/zklogin/zkp
```

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📋 Core Operations

### Protocol Registration

Register a new protocol to enable payment settlements:

```typescript
// Example protocol registration
{
  protocolName: "MyDApp",
  protocolAddress: "0x...", // Your protocol's address
  initialFunding: 0.01, // SUI amount (minimum 0.003)
}
```

### Vault Funding

Add funds to your protocol vault:

```typescript
// Example vault funding
{
  vaultId: "0x...", // From registration response
  amount: 0.005 // Additional SUI funding
}
```

## 🎮 User Interface

### Dashboard Sections

#### **Protocol Registration**

- Protocol name input and validation
- Address configuration
- Initial funding amount selection
- Real-time transaction status

#### **Vault Management**

- Vault selection dropdown
- Funding amount input
- Balance display and updates
- Transaction confirmation

#### **Transaction Results**

- Automatic result cards after operations
- Copy-to-clipboard functionality
- Explorer links for transaction verification
- Auto-fill for subsequent operations

## 🔧 Technical Implementation

### Smart Contract Integration

```typescript
// Protocol registration transaction
tx.moveCall({
  target: `${PACKAGE_ID}::payment::register_protocol`,
  arguments: [
    tx.object(PAYMENT_REGISTRY),
    tx.object(PAYMENT_CAP),
    tx.pure.string(protocolName),
    tx.pure.address(protocolAddress),
    fundingCoin,
    tx.object(CLOCK),
  ],
});
```

### zkLogin Authentication Flow

```typescript
// zkLogin authentication process
1. Google OAuth → JWT Token
2. Enoki nonce generation
3. ZK proof creation
4. Sui address computation
5. Session persistence
```

### Error Handling

- Comprehensive input validation
- Network error recovery
- Transaction failure handling
- User-friendly error messages

## 📊 Monitoring & Analytics

### Transaction Tracking

- All operations logged with timestamps
- Transaction digests for verification
- Explorer integration for detailed view
- Real-time status updates

### Vault Analytics

- Current balance tracking
- Funding history
- Settlement statistics
- Performance metrics

## 🔐 Security Features

### Authentication Security

- Zero-knowledge proof verification
- Social login without password storage
- Deterministic address generation
- Session token encryption

### Transaction Security

- Input sanitization and validation
- Smart contract interaction safety
- Network request verification
- Error boundary protection

## 🌐 Network Support

### Sui Testnet

- Full testnet integration
- Test SUI faucet support
- Explorer integration
- Development-friendly environment

### Production Readiness

- Mainnet configuration ready
- Environment-based switching
- Production optimization
- Monitoring integration

## 📁 Project Structure

```
suiverify-admin/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard pages
│   ├── callback/          # OAuth callback handler
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── admin/            # Admin-specific components
├── lib/                  # Utility libraries
│   ├── sui-client.ts     # Sui blockchain client
│   ├── zklogin.ts        # zkLogin implementation
│   └── utils.ts          # Helper functions
├── config/               # Configuration files
│   └── contracts.ts      # Smart contract addresses
└── public/               # Static assets
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- 📧 Email: support@suiverify.com
- 💬 Discord: [SuiVerify Community](https://discord.gg/suiverify)
- 📖 Documentation: [docs.suiverify.com](https://docs.suiverify.com)

## 🔗 Related Projects

- **[SuiVerify Main](https://github.com/SuiVerify/Suiverify-main)** - Core verification platform
- **[SuiVerify Contracts](https://github.com/SuiVerify/Suiverify-contracts)** - Smart contracts
- **[Settlement Backend](https://github.com/SuiVerify/nodejs_backend_micro)** - Settlement microservice

---

Built with ❤️ by the SuiVerify team
