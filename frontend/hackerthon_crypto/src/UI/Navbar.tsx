import Direct from "../assets/e37125d1-d503-4d42-bf03-0edd92f1d25a.webp"
import Wallet from "../Wallet/ConnectWallet"
const Navbar = () => {
  return (
    <div className="navbar_cover text-white p-4 md:p-10 bg-gray-900">
    <nav className="flex justify-between items-center">
      <div className="nav_logo flex gap-2 items-center">
        <img src={Direct} className="h-10 rounded-full" alt="Direct logo" />
        <b className="text-2xl">Direct</b>
      </div>

    </nav>
  </div>
  
  )
}

export default Navbar
