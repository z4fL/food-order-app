const SplashScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F8F8FF] p-4 -mt-30">
      <img src="/logo.png" alt="logo" className="w-24 mb-4" />
      <h4 className="text-2xl font-bold font-inter">Food Order App</h4>
      <div className="mt-4 loader"></div>
    </div>
  )
}

export default SplashScreen