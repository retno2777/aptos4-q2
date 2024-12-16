import React, { useEffect, useState } from "react";
import { Layout, Card, Button, Typography, Spin } from "antd";
import NavBar from "../components/NavBar";
import { NFTMarketplaceService } from "../service/NFTMarketplaceService";

const { Content } = Layout;
const { Title } = Typography;

interface MyCollectionPageProps {
  marketplaceService: NFTMarketplaceService;
}

const MyCollectionPage: React.FC<MyCollectionPageProps> = ({ marketplaceService }) => {
  const [nfts, setNfts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMyNFTs = async () => {
      setLoading(true);
      try {
        const result = await marketplaceService.getNFTsByRarity(1); // Replace with logic for owned NFTs
        setNfts(result || []);
      } catch (error) {
        console.error("Failed to fetch user NFTs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyNFTs();
  }, [marketplaceService]);

  const handleTransfer = async (nftId: number, newOwner: string) => {
    try {
      await marketplaceService.transferNFT(nftId, newOwner);
      console.log(`NFT ${nftId} transferred to ${newOwner}`);
    } catch (error) {
      console.error("Failed to transfer NFT:", error);
    }
  };

  return (
    <Layout>
      <NavBar marketplaceService={marketplaceService} />
      <Content style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
        <Title level={2}>My Collection</Title>
        {loading ? (
          <Spin size="large" style={{ display: "block", margin: "50px auto" }} />
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
            {nfts.map((nft, index) => (
              <Card key={index} title={nft.name} bordered>
                <p>{nft.description}</p>
                <Button type="primary" onClick={() => handleTransfer(nft.id, "newOwnerAddress")}>
                  Transfer NFT
                </Button>
              </Card>
            ))}
          </div>
        )}
      </Content>
    </Layout>
  );
};

export default MyCollectionPage;
