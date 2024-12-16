import React, { useState } from "react";
import { Layout, Form, Input, Button, message } from "antd";
import NavBar from "../components/NavBar";
import { NFTMarketplaceService } from "../service/NFTMarketplaceService";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

const { Content } = Layout;

interface MakeOfferPageProps {
  marketplaceService: NFTMarketplaceService;
}

const MakeOfferPage: React.FC<MakeOfferPageProps> = ({ marketplaceService }) => {
  const [loading, setLoading] = useState(false);
  const { signTransaction } = useWallet(); // Menggunakan signTransaction dari wallet adapter

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const { nftId, price } = values;

      // Validasi jika signTransaction tidak tersedia
      if (!signTransaction) {
        throw new Error("Signer is not available.");
      }

      // Memanggil metode makeOffer dengan signer
      await marketplaceService.makeOffer(Number(nftId), Number(price), signTransaction);
      message.success("Offer made successfully!");
    } catch (error) {
      console.error("Failed to make offer:", error);
      message.error("Failed to make offer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <NavBar marketplaceService={marketplaceService} />
      <Content style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
        <h2>Make an Offer</h2>
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="nftId"
            label="NFT ID"
            rules={[{ required: true, message: "Please enter NFT ID!" }]}
          >
            <Input type="number" placeholder="Enter the ID of the NFT" />
          </Form.Item>
          <Form.Item
            name="price"
            label="Offer Price (APT)"
            rules={[{ required: true, message: "Please enter offer price!" }]}
          >
            <Input type="number" placeholder="Enter the offer price in APT" />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Make Offer
          </Button>
        </Form>
      </Content>
    </Layout>
  );
};

export default MakeOfferPage;
