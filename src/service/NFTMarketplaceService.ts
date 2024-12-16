import { AptosClient, Types } from "aptos";
import { Buffer } from "buffer";

// Configure the connection
const NODE_URL = "https://fullnode.devnet.aptoslabs.com/v1";
const client = new AptosClient(NODE_URL);

export class NFTMarketplaceService {
  private accountAddress: string;

  constructor(accountAddress: string) {
    this.accountAddress = accountAddress;
  }

  // Function to send transactions
  private async sendTransaction(
    payload: Types.EntryFunctionPayload,
    signer: any // Inject a signer function from wallet adapter
  ): Promise<Types.UserTransaction> {
    try {
      // Generate a raw transaction
      const txnRequest = await client.generateTransaction(this.accountAddress, payload);

      // Sign the transaction
      const signedTxn = await signer.signTransaction(txnRequest);

      // Submit the signed transaction
      const transaction = await client.submitTransaction(signedTxn);

      // Wait for the transaction to be confirmed
      await client.waitForTransaction(transaction.hash);
      return client.getTransactionByHash(transaction.hash) as Promise<Types.UserTransaction>;
    } catch (error) {
      console.error("Error sending transaction:", error);
      throw error;
    }
  }

  // Initialize Marketplace
  async initializeMarketplace(signer: any): Promise<Types.UserTransaction> {
    const payload: Types.EntryFunctionPayload = {
      function: "0xefe56f070ef05faad189aa756f78a378797603f999c0eaa3f3c26c7ad6358899::NFTMarketplace::initialize",
      arguments: [],
      type_arguments: [],
    };
    return await this.sendTransaction(payload, signer);
  }

  // Mint NFT
  async mintNFT(
    name: string,
    description: string,
    uri: string,
    rarity: number,
    royaltyPercentage: number,
    signer: any
  ): Promise<Types.UserTransaction> {
    const payload: Types.EntryFunctionPayload = {
      function: "0xefe56f070ef05faad189aa756f78a378797603f999c0eaa3f3c26c7ad6358899::NFTMarketplace::mint_nft",
      arguments: [
        Array.from(Buffer.from(name, "utf8")),
        Array.from(Buffer.from(description, "utf8")),
        Array.from(Buffer.from(uri, "utf8")),
        rarity,
        royaltyPercentage,
      ],
      type_arguments: [],
    };
    return await this.sendTransaction(payload, signer);
  }

  // List NFT for Sale
  async listForSale(nftId: number, price: number, signer: any): Promise<Types.UserTransaction> {
    const payload: Types.EntryFunctionPayload = {
      function: "0xefe56f070ef05faad189aa756f78a378797603f999c0eaa3f3c26c7ad6358899::NFTMarketplace::list_for_sale",
      arguments: [nftId, price],
      type_arguments: [],
    };
    return await this.sendTransaction(payload, signer);
  }

  // Transfer NFT Ownership
  async transferNFT(nftId: number, newOwner: string, signer: any): Promise<Types.UserTransaction> {
    const payload: Types.EntryFunctionPayload = {
      function: "0xefe56f070ef05faad189aa756f78a378797603f999c0eaa3f3c26c7ad6358899::NFTMarketplace::transfer_nft",
      arguments: [nftId, newOwner],
      type_arguments: [],
    };
    return await this.sendTransaction(payload, signer);
  }

  // Start Auction
  async startAuction(
    nftId: number,
    startPrice: number,
    duration: number,
    signer: any
  ): Promise<Types.UserTransaction> {
    const payload: Types.EntryFunctionPayload = {
      function: "0xefe56f070ef05faad189aa756f78a378797603f999c0eaa3f3c26c7ad6358899::NFTMarketplace::start_auction",
      arguments: [nftId, startPrice, duration],
      type_arguments: [],
    };
    return await this.sendTransaction(payload, signer);
  }

  // Place Bid
  async placeBid(auctionId: number, bidAmount: number, signer: any): Promise<Types.UserTransaction> {
    const payload: Types.EntryFunctionPayload = {
      function: "0xefe56f070ef05faad189aa756f78a378797603f999c0eaa3f3c26c7ad6358899::NFTMarketplace::place_bid",
      arguments: [auctionId, bidAmount],
      type_arguments: [],
    };
    return await this.sendTransaction(payload, signer);
  }

  // End Auction
  async endAuction(auctionId: number, signer: any): Promise<Types.UserTransaction> {
    const payload: Types.EntryFunctionPayload = {
      function: "0xefe56f070ef05faad189aa756f78a378797603f999c0eaa3f3c26c7ad6358899::NFTMarketplace::end_auction",
      arguments: [auctionId],
      type_arguments: [],
    };
    return await this.sendTransaction(payload, signer);
  }

  // Make Offer
  async makeOffer(nftId: number, price: number, signer: any): Promise<Types.UserTransaction> {
    const payload: Types.EntryFunctionPayload = {
      function: "0xefe56f070ef05faad189aa756f78a378797603f999c0eaa3f3c26c7ad6358899::NFTMarketplace::make_offer",
      arguments: [nftId, price],
      type_arguments: [],
    };
    return await this.sendTransaction(payload, signer);
  }

  // Accept Offer
  async acceptOffer(offerId: number, signer: any): Promise<Types.UserTransaction> {
    const payload: Types.EntryFunctionPayload = {
      function: "0xefe56f070ef05faad189aa756f78a378797603f999c0eaa3f3c26c7ad6358899::NFTMarketplace::accept_offer",
      arguments: [offerId],
      type_arguments: [],
    };
    return await this.sendTransaction(payload, signer);
  }

  // Get All NFTs by Rarity
  async getNFTsByRarity(rarity: number): Promise<any> {
    const payload = {
      function: "0xefe56f070ef05faad189aa756f78a378797603f999c0eaa3f3c26c7ad6358899::NFTMarketplace::get_nfts_by_rarity",
      arguments: [rarity],
      type_arguments: [],
    };
    return await client.view(payload);
  }

  // Withdraw Royalties
  async withdrawRoyalties(signer: any): Promise<Types.UserTransaction> {
    const payload: Types.EntryFunctionPayload = {
      function: "0xefe56f070ef05faad189aa756f78a378797603f999c0eaa3f3c26c7ad6358899::NFTMarketplace::withdraw_royalties",
      arguments: [],
      type_arguments: [],
    };
    return await this.sendTransaction(payload, signer);
  }
}
