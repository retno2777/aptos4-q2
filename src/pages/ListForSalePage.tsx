import React, { useState } from "react";
import { Layout, Form, Input, Button, message } from "antd";
import NavBar from "../components/NavBar";
import { NFTMarketplaceService } from "../service/NFTMarketplaceService";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

const { Content } = Layout;

interface ListForSalePageProps {
  marketplaceService: NFTMarketplaceService;
}

const ListForSalePage: React.FC<ListForSalePageProps> = ({ marketplaceService }) => {
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

      // Memanggil metode listForSale dengan signer
      await marketplaceService.listForSale(Number(nftId), Number(price), signTransaction);
      message.success("NFT listed for sale successfully!");
    } catch (error) {
      console.error("Failed to list NFT:", error);
      message.error("Failed to list NFT for sale.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <NavBar marketplaceService={marketplaceService} />
      <Content style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
        <h2>List NFT for Sale</h2>
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
            label="Price (APT)"
            rules={[{ required: true, message: "Please enter price!" }]}
          >
            <Input type="number" placeholder="Enter the price in APT" />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            List for Sale
          </Button>
        </Form>
      </Content>
    </Layout>
  );
};

export default ListForSalePage;
