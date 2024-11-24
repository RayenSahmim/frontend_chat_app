import { Link } from 'react-router-dom';
import logo from '../../public/logo.png';
import { IoMdMenu } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
const navLinks = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
    
]
const Navbar = () => {
    const navigate = useNavigate();
  return (
    <section>
        <div className=' container mx-auto mt-5 max-w-7xl fixed top-0 right-0 left-0 z-50 backdrop:blur-3xl bg-white/70'>
            <div className='grid grid-cols-2 lg:grid-cols-3 items-center border border-black/15 rounded-full px-8 py-2'>
            <div>
                <Link to="/">
                <img src={logo} alt="logo" className='h-10 md:h-14 w-auto '/>
                </Link>
            </div>
            <div className='hidden lg:flex lg:justify-center'>

                {navLinks.map((link, index) => (
                    <Link key={index} to={link.href} className='mx-4 text-lg font-medium text-gray-600 hover:text-gray-900'>{link.label}</Link> 
                ))}

            </div>
            <div className='flex justify-end '>
                <IoMdMenu className='md:hidden'/>
                <div className='hidden md:flex gap-2'> 
                    <button onClick={() => {navigate("/login")}} className='border border-primary-light/50 text-primary-light rounded-full px-4 py-2 hover:bg-primary-light hover:text-white'>Log in</button>
                    <button onClick={() => {navigate("/signup")}} className='bg-primary-light text-white rounded-full px-4 py-2 hover:bg-primary'>Sign up</button>
                </div>
            </div>
            </div>

        </div>

    </section>
  )
}

export default Navbar
