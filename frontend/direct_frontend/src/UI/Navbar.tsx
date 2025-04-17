import Direct from "../assets/logo.png";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";


const Navbar = () => {
  const { connected } = useWallet();


  return (
    <WalletModalProvider>
          <div className="navbar_cover font-sans text-black p-4 bg-white shadow">
            <nav className="flex justify-between items-center">
              {/* Left: Logo + Name */}
              <div className="flex items-center gap-2">
                <img src={Direct} className="h-10 rounded-full" alt="Direct logo" />
                <span className="text-2xl text-[#10A0C9] font-bold">Direct</span>
              </div>

              {/* Right: Wallet Buttons */}
              <div className="flex items-center gap-3">
                <WalletMultiButton style={{ backgroundColor: '#10A0C9', color: 'white' }} />
                 <WalletDisconnectButton
                    style={{
                      backgroundColor: connected ? '#10A0C9' : '#A9A9A9',
                      color: connected ? '#FFFFFF' : '#A9A9A9', 
                    }}
                  />
              </div>
            </nav>
          </div>
      </WalletModalProvider>
  );
};


export default Navbar;
