import Navbar from '../sections/Navbar'
import { useMemo } from 'react'


const MainLayout = ({children} : {children: React.ReactNode}) => {
  const useMemoizedChildren = (children: React.ReactNode) => useMemo(() => children, [children])
const memorizenavbar = useMemoizedChildren(<Navbar/>)
  return (
    <>

        {memorizenavbar}
        {children}

    </>
  )
}

export default MainLayout
