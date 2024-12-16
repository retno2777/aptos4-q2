import React from "react";
import { Layout, Button, message } from "antd";
import NavBar from "../components/NavBar";
import { NFTMarketplaceService } from "../service/NFTMarketplaceService";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

const { Content } = Layout;

interface WithdrawRoyaltiesPageProps {
  marketplaceService: NFTMarketplaceService;
}

const WithdrawRoyaltiesPage: React.FC<WithdrawRoyaltiesPageProps> = ({ marketplaceService }) => {
  const { signTransaction } = useWallet();

  const handleWithdrawRoyalties = async () => {
    try {
      if (!signTransaction) throw new Error("Signer is not available.");
      await marketplaceService.withdrawRoyalties(signTransaction);
      message.success("Royalties withdrawn successfully!");
    } catch (error) {
      console.error("Failed to withdraw royalties:", error);
      message.error("Failed to withdraw royalties.");
    }
  };

  return (
    <Layout>
      <NavBar marketplaceService={marketplaceService} />
      <Content style={{ padding: "20px", textAlign: "center" }}>
        <Button type="primary" onClick={handleWithdrawRoyalties}>
          Withdraw Royalties
        </Button>
      </Content>
    </Layout>
  );
};

export default WithdrawRoyaltiesPage;
