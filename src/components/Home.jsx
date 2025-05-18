const Home = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F8F8FF]">
      <img src="/logo.png" alt="logo" className="w-24 mb-4" />
      <h4 className="text-2xl font-bold font-inter">Food Order App</h4>
      <div className="mt-4">
        <p className="font-poppins text-xl text-gray-700 capitalize">
          silahkan scan QR code di meja yang kosong :)
        </p>
      </div>
    </div>
  );
};

export default Home;
