# Smart Contract Deployment Guide

This document explains how to set up, test, and deploy the `ProductRegistry` smart contract to the Polygon Amoy testnet using Foundry.

## Prerequisites

1. Install **Foundry**:
   ```bash
   curl -L https://foundry.paradigm.xyz | bash
   foundryup
   ```

2. Initialize Foundry Submodules:
   From within the `contracts` directory, run:
   ```bash
   forge install foundry-rs/forge-std --no-commit
   ```

## Setup Environment

Create a `.env` file in the `contracts` directory with your deployment credentials:

```env
# The private key of your deployment wallet (starts with 0x)
PRIVATE_KEY=your_private_key_here

# Amoy RPC URL (Default provided, or use Infura/Alchemy)
AMOY_RPC_URL=https://rpc-amoy.polygon.technology
```

*Note: Make sure your wallet has Amoy MATIC for gas fees. You can get testnet MATIC from the [Polygon Faucet](https://faucet.polygon.technology/).*

## Compilation

To compile the smart contract:

```bash
forge build
```

## Testing

To run the smart contract tests:

```bash
forge test -vvv
```

## Deployment 

To deploy the smart contract to Polygon Amoy testnet:

```bash
source .env
forge script script/DeployProductRegistry.s.sol:DeployProductRegistry --rpc-url $AMOY_RPC_URL --broadcast -vvvv
```

### Verification (Optional)

If you have a PolygonScan API key, you can verify the contract upon deployment by adding `--verify --etherscan-api-key YOUR_KEY_HERE`.

## Using the Contract

Once deployed, copy the deployed contract address from the terminal output and place it in your frontend application (e.g., as `NEXT_PUBLIC_REGISTRY_CONTRACT_ADDRESS` in your Next.js `.env.local` file) to interact with it.