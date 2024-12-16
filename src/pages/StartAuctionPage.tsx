import React, { useState } from "react";
import { Layout, Form, Input, Button, message } from "antd";
import NavBar from "../components/NavBar";
import { NFTMarketplaceService } from "../service/NFTMarketplaceService";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

const { Content } = Layout;

interface StartAuctionPageProps {
  marketplaceService: NFTMarketplaceService;
}

const StartAuctionPage: React.FC<StartAuctionPageProps> = ({ marketplaceService }) => {
  const [loading, setLoading] = useState(false);
  const { signTransaction } = useWallet();

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const { nftId, startPrice, duration } = values;

      // Check if the signer is available
      if (!signTransaction) {
        throw new Error("Signer is not available.");
      }

      // Call the startAuction method with the signer
      await marketplaceService.startAuction(
        Number(nftId),
        Number(startPrice),
        Number(duration),
        signTransaction
      );
      message.success("Auction started successfully!");
    } catch (error) {
      console.error("Failed to start auction:", error);
      message.error("Failed to start auction.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <NavBar marketplaceService={marketplaceService} />
      <Content style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
        <h2>Start Auction</h2>
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="nftId"
            label="NFT ID"
            rules={[{ required: true, message: "Please enter NFT ID!" }]}
          >
            <Input type="number" placeholder="Enter NFT ID" />
          </Form.Item>
          <Form.Item
            name="startPrice"
            label="Starting Price (APT)"
            rules={[{ required: true, message: "Please enter starting price!" }]}
          >
            <Input type="number" placeholder="Enter starting price in APT" />
          </Form.Item>
          <Form.Item
            name="duration"
            label="Duration (seconds)"
            rules={[{ required: true, message: "Please enter duration!" }]}
          >
            <Input type="number" placeholder="Enter duration in seconds" />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Start Auction
          </Button>
        </Form>
      </Content>
    </Layout>
  );
};

export default StartAuctionPage;
