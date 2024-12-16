import React, { useEffect, useState } from "react";
import { Layout, Menu, Dropdown, Button, Space, message, Typography } from "antd";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { DownOutlined, LogoutOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { NFTMarketplaceService } from "../service/NFTMarketplaceService";

const { Header } = Layout;
const { Text } = Typography;

interface NavBarProps {
  marketplaceService: NFTMarketplaceService;
}

const NavBar: React.FC<NavBarProps> = ({ marketplaceService }) => {
  const { connected, account, network, disconnect, signTransaction } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBalance = async () => {
      if (account) {
        try {
          const resources: any[] = await marketplaceService.getNFTsByRarity(0); // Mock call for NFT data
          const accountResource = resources.find(
            (r) => r.type === "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>"
          );
          if (accountResource) {
            const balanceValue = (accountResource.data as any).coin.value;
            setBalance(balanceValue ? parseInt(balanceValue) / 100000000 : 0);
          } else {
            setBalance(0);
          }
        } catch (error) {
          console.error("Error fetching balance:", error);
          message.error("Failed to fetch balance.");
        }
      }
    };

    if (connected) {
      fetchBalance();
    }
  }, [connected, account, marketplaceService]);

  const handleLogout = async () => {
    try {
      await disconnect();
      setBalance(null);
      message.success("Disconnected from wallet.");
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      message.error("Failed to disconnect wallet.");
    }
  };

  const handleWithdrawRoyalties = async () => {
    try {
      if (!signTransaction) {
        throw new Error("Signer is not available.");
      }
      message.loading("Withdrawing royalties...");
      await marketplaceService.withdrawRoyalties(signTransaction);
      message.success("Royalties withdrawn successfully!");
    } catch (error) {
      console.error("Error withdrawing royalties:", error);
      message.error("Failed to withdraw royalties.");
    }
  };

  return (
    <Header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#001529",
        padding: "0 20px",
      }}
    >
      {/* Logo dan Menu */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <img src="/Aptos_Primary_WHT.png" alt="Aptos Logo" style={{ height: 30, marginRight: 16 }} />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["marketplace"]} style={{ backgroundColor: "#001529" }}>
          <Menu.Item key="marketplace">
            <Link to="/" style={{ color: "#fff" }}>Marketplace</Link>
          </Menu.Item>
          <Menu.Item key="my-collection">
            <Link to="/my-nfts" style={{ color: "#fff" }}>My Collection</Link>
          </Menu.Item>
          <Menu.Item key="mint-nft">
            <Link to="/mint-nft" style={{ color: "#fff" }}>Mint NFT</Link>
          </Menu.Item>
          <Menu.Item key="list-for-sale">
            <Link to="/list-for-sale" style={{ color: "#fff" }}>List for Sale</Link>
          </Menu.Item>
          <Menu.Item key="start-auction">
            <Link to="/start-auction" style={{ color: "#fff" }}>Start Auction</Link>
          </Menu.Item>
          <Menu.Item key="make-offer">
            <Link to="/make-offer" style={{ color: "#fff" }}>Make Offer</Link>
          </Menu.Item>
          <Menu.Item key="auction-management">
            <Link to="/auction-management" style={{ color: "#fff" }}>Auction Management</Link>
          </Menu.Item>
        </Menu>
      </div>

      {/* Status Dompet */}
      <Space>
        {connected && account ? (
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key="withdraw-royalties" onClick={handleWithdrawRoyalties}>
                  Withdraw Royalties
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key="address">
                  <Text strong>Address:</Text> <br />
                  <Text copyable>{account.address}</Text>
                </Menu.Item>
                <Menu.Item key="network">
                  <Text strong>Network:</Text> {network?.name || "Unknown"}
                </Menu.Item>
                <Menu.Item key="balance">
                  <Text strong>Balance:</Text> {balance !== null ? `${balance} APT` : "Loading..."}
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
                  Log Out
                </Menu.Item>
              </Menu>
            }
            trigger={["click"]}
          >
            <Button type="primary">
              Connected <DownOutlined />
            </Button>
          </Dropdown>
        ) : (
          <Button type="primary" onClick={() => navigate("/")}>
            Connect Wallet
          </Button>
        )}
      </Space>
    </Header>
  );
};

export default NavBar;
