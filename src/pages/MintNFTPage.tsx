import React, { useState } from "react";
import { Layout, Form, Input, Button, message } from "antd";
import NavBar from "../components/NavBar";
import { NFTMarketplaceService } from "../service/NFTMarketplaceService";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

const { Content } = Layout;

interface MintNFTPageProps {
  marketplaceService: NFTMarketplaceService;
}

const MintNFTPage: React.FC<MintNFTPageProps> = ({ marketplaceService }) => {
  const [loading, setLoading] = useState(false);
  const { signTransaction } = useWallet(); // Use signTransaction from wallet adapter

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const { name, description, uri, rarity, royaltyPercentage } = values;

      // Check if the signer is available
      if (!signTransaction) {
        throw new Error("Signer is not available.");
      }

      // Call the mintNFT method with the signer
      await marketplaceService.mintNFT(
        name,
        description,
        uri,
        Number(rarity),
        Number(royaltyPercentage),
        signTransaction
      );
      message.success("NFT minted successfully!");
    } catch (error) {
      console.error("Failed to mint NFT:", error);
      message.error("Failed to mint NFT.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <NavBar marketplaceService={marketplaceService} />
      <Content style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
        <h2>Mint New NFT</h2>
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="NFT Name"
            rules={[{ required: true, message: "Please enter NFT name!" }]}
          >
            <Input placeholder="Enter the name of your NFT" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter description!" }]}
          >
            <Input.TextArea placeholder="Enter a description for your NFT" />
          </Form.Item>
          <Form.Item
            name="uri"
            label="Image URI"
            rules={[{ required: true, message: "Please enter image URI!" }]}
          >
            <Input placeholder="Enter the URI of the NFT image" />
          </Form.Item>
          <Form.Item
            name="rarity"
            label="Rarity"
            rules={[{ required: true, message: "Please enter rarity!" }]}
          >
            <Input type="number" placeholder="Enter the rarity level (e.g., 1-10)" />
          </Form.Item>
          <Form.Item
            name="royaltyPercentage"
            label="Royalty Percentage"
            rules={[{ required: true, message: "Please enter royalty percentage!" }]}
          >
            <Input
              type="number"
              placeholder="Enter the royalty percentage (e.g., 5)"
            />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Mint NFT
          </Button>
        </Form>
      </Content>
    </Layout>
  );
};

export default MintNFTPage;
