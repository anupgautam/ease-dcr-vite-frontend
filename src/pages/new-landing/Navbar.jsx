import React from 'react'
import logo from "/assets/logo.png"

const Navbar = () => {
    const navItems=[
        {
            id:0,
            title:"Home"
        },
        {
            id:1,
            title:"About"
        },
        {
            id:2,
            title:"Book a Demo"
        },
        {
            id:3,
            title:"Contact"
        },
    ]
  return (
    <div className=' bg-[#ffffff]'>
    <div className=' font-public_sans  flex items-center container justify-between py-3 font-semibold'>
     <div className=' flex items-center'>
     <img src={logo} alt="logo" className=' h-10 md:h-14'/>
     <p className=' hidden md:block'>Ease SFA</p>
     </div>
     <div className=' flex gap-x-2 lg:gap-x-8 text-xl'>
       {
        navItems.map((item)=>{
          return(
            <div key={item.id}>
             <h2 className=' text-[12px] md:text-lg '>{item.title}</h2>
            </div>
          )
        })
       }
     </div>
      <button className=' bg-[#6364f2] p-2 lg:p-3 rounded-lg text-[12px] md:text-lg text-white'>Go to Dashboard</button>
    </div>
    </div>
  )
}

export default Navbar
