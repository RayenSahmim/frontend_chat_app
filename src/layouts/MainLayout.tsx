import Navbar from '../sections/Navbar'

const MainLayout = ({children} : {children: React.ReactNode}) => {
  return (
    <>
        <Navbar/> 
        {children}

    </>
  )
}

export default MainLayout
