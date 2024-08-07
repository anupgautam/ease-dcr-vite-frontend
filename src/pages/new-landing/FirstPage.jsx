import React from 'react'
import laptop from "/assets/images/EASE_SFA/LaptopFrame.webp"
import mobile from "/assets/images/EASE_SFA/mobile.webp"
import dots from "/assets/dots2.png"

const FirstPage = () => {
  return (
    <div className=' py-5 md:py-12 bg-no-repeat ' style={{backgroundImage:`url(${dots})`}}>
    <div className='lg:flex container justify-between items-center'>
      <section className=' lg:w-[35%] font-public_sans'>
      <h1 className=' text-[28px] md:text-[38px] font-semibold text-[#3e3d48] leading-tight my-2'>EASESFA-Streamlining Sales Force Automation</h1>
      <p className='text-[#7c7ca1]'>EaseSFA provides cutting-edge sales force automation solutions, revolutionizing the way business manage and optimize their sales reporting process.Simplify your sales operation process.Simplify your sales operations and enhance productivity with our intuitive platform.</p>
      <section className=' flex items-center gap-x-7 my-6'>
      <button className=' bg-[#6364f2] rounded-lg p-2 text-gray-100'>Book a Demo</button>
      <h2>About Us →</h2>
      </section>
      </section>
      <section className=' flex items-center gap-x-2 rounded-xl justify-center'>
        <img src={laptop} className=' h-[180px] md:h-[280px] lg:h-[300px] xl:h-[350px] hover:scale-105 duration-500'/>
        <img src={mobile} className=' h-[180px] md:j-[280px] lg:h-[300px] xl:h-[350px] hover:scale-105 duration-500 '/>
      </section>
    </div>
    </div>
  )
}

export default FirstPage
