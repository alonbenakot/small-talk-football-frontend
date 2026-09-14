import {Link} from "react-router-dom";

const Footer = () => {
  return (
    <footer className="mt-12 flex justify-center gap-4 text-sm text-slate-400">
      <span>&copy; Alon Benakot 2025</span>
      <Link to="/about" className="hover:text-emerald-600">About</Link>
    </footer>
  )
}
export default Footer;
