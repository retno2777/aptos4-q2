import React, { useEffect, useState } from "react";
import { Layout, Card, Typography, Spin } from "antd";
import NavBar from "../components/NavBar";
import { NFTMarketplaceService } from "../service/NFTMarketplaceService";

const { Content } = Layout;
const { Title } = Typography;

interface HomePageProps {
  marketplaceService: NFTMarketplaceService;
}

const HomePage: React.FC<HomePageProps> = ({ marketplaceService }) => {
  const [nfts, setNfts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNFTs = async () => {
      setLoading(true);
      try {
        const result = await marketplaceService.getNFTsByRarity(0);
        setNfts(result || []);
      } catch (error) {
        console.error("Failed to fetch NFTs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNFTs();
  }, [marketplaceService]);

  return (
    <Layout>
      <NavBar marketplaceService={marketplaceService} />
      <Content style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
        <Title level={2}>NFT Marketplace</Title>
        {loading ? (
          <Spin size="large" style={{ display: "block", margin: "50px auto" }} />
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
            {nfts.map((nft, index) => (
              <Card key={index} title={nft.name} bordered>
                <p>{nft.description}</p>
                <p><strong>Price:</strong> {nft.price} APT</p>
              </Card>
            ))}
          </div>
        )}
      </Content>
    </Layout>
  );
};

export default HomePage;
