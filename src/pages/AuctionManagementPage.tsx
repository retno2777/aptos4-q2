import React, { useEffect, useState } from "react";
import { Layout, Table, Button, Spin, message } from "antd";
import NavBar from "../components/NavBar";
import { NFTMarketplaceService } from "../service/NFTMarketplaceService";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

const { Content } = Layout;

interface AuctionManagementPageProps {
  marketplaceService: NFTMarketplaceService;
}

const AuctionManagementPage: React.FC<AuctionManagementPageProps> = ({ marketplaceService }) => {
  const [auctions, setAuctions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { signTransaction } = useWallet(); // Mengambil signer dari wallet adapter

  useEffect(() => {
    const fetchAuctions = async () => {
      setLoading(true);
      try {
        // Mengganti logika simulasi dengan logika yang sesuai untuk mengambil data lelang
        const result = await marketplaceService.getNFTsByRarity(0); // Replace with real auction fetching logic
        setAuctions(result || []);
      } catch (error) {
        console.error("Failed to fetch auctions:", error);
        message.error("Failed to fetch auctions.");
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, [marketplaceService]);

  const handleEndAuction = async (auctionId: number) => {
    try {
      if (!signTransaction) {
        throw new Error("Signer is not available.");
      }
      message.loading("Ending auction...");
      await marketplaceService.endAuction(auctionId, signTransaction); // Memastikan signer dikirim
      message.success(`Auction ${auctionId} ended successfully!`);
      // Update list auctions after ending one
      setAuctions((prev) => prev.filter((auction) => auction.id !== auctionId));
    } catch (error) {
      console.error("Failed to end auction:", error);
      message.error(`Failed to end auction ${auctionId}.`);
    }
  };

  const columns = [
    {
      title: "Auction ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "NFT Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Highest Bid",
      dataIndex: "highestBid",
      key: "highestBid",
      render: (value: number) => `${value} APT`,
    },
    {
      title: "End Time",
      dataIndex: "endTime",
      key: "endTime",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Button type="primary" onClick={() => handleEndAuction(record.id)}>
          End Auction
        </Button>
      ),
    },
  ];

  return (
    <Layout>
      <NavBar marketplaceService={marketplaceService} />
      <Content style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
        <h2>Auction Management</h2>
        {loading ? (
          <Spin size="large" style={{ display: "block", margin: "50px auto" }} />
        ) : auctions.length > 0 ? (
          <Table
            dataSource={auctions}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 5 }}
          />
        ) : (
          <p style={{ textAlign: "center" }}>No active auctions at the moment.</p>
        )}
      </Content>
    </Layout>
  );
};

export default AuctionManagementPage;
