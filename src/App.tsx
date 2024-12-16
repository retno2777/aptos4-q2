import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import HomePage from "./pages/HomePage";
import MyCollectionPage from "./pages/MyCollection";
import MintNFTPage from "./pages/MintNFTPage";
import ListForSalePage from "./pages/ListForSalePage";
import StartAuctionPage from "./pages/StartAuctionPage";
import MakeOfferPage from "./pages/MakeOfferPage";
import AuctionManagementPage from "./pages/AuctionManagementPage";
import WithdrawRoyaltiesPage from "./pages/WithdrawRoyaltiesPage";
import { NFTMarketplaceService } from "./service/NFTMarketplaceService";

const App: React.FC = () => {
  const { account, connected } = useWallet();

  if (!connected || !account) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <h1>Please connect your wallet to use the application</h1>
      </div>
    );
  }

  const marketplaceService = new NFTMarketplaceService(account.address);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<HomePage marketplaceService={marketplaceService} />}
        />
        <Route
          path="/my-nfts"
          element={<MyCollectionPage marketplaceService={marketplaceService} />}
        />
        <Route
          path="/mint-nft"
          element={<MintNFTPage marketplaceService={marketplaceService} />}
        />
        <Route
          path="/list-for-sale"
          element={<ListForSalePage marketplaceService={marketplaceService} />}
        />
        <Route
          path="/start-auction"
          element={<StartAuctionPage marketplaceService={marketplaceService} />}
        />
        <Route
          path="/make-offer"
          element={<MakeOfferPage marketplaceService={marketplaceService} />}
        />
        <Route
          path="/auction-management"
          element={
            <AuctionManagementPage marketplaceService={marketplaceService} />
          }
        />
        <Route
          path="/withdraw-royalties"
          element={
            <WithdrawRoyaltiesPage marketplaceService={marketplaceService} />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
