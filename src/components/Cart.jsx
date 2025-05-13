import {
  ChevronLeftIcon,
  MinusIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useLocation, useNavigate } from "react-router";
import dataProduct from "../data.json";
import { useEffect } from "react";

function formatUang(subject) {
  const rupiah = subject.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
  return `Rp${rupiah}`;
}

const Cart = () => {
  const location = useLocation();
  let navigate = useNavigate();

  useEffect(() => {
    if (!location.state?.cart) {
      navigate("/");
    }
  });

  const cart = location.state?.cart
    ? location.state.cart.map((item) => {
        const product = dataProduct.find((p) => p.id === item.id);
        return {
          ...item,
          nama: product.nama,
          harga: product.harga,
          gambar: product.gambar,
          kategori: product.kategori,
          quantity: item.quantity,
          totalHarga: item.quantity * product.harga,
        };
      })
    : [];

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="mx-auto min-h-screen max-w-md bg-[#F8F8FF] relative">
      <div className="relative px-6 pb-14">
        <div className="flex pt-8">
          <button className="cursor-pointer" onClick={handleBack}>
            <ChevronLeftIcon className="w-8 h-8 text-gray-700" />
          </button>
          <h3 className="pl-8 font-poppins font-bold text-3xl text-gray-700">
            Meja 1
          </h3>
        </div>
        <div className="mt-10">
          <div className="flex flex-col items-center gap-5">
            {cart.map((item) => (
              <div key={item.nama} className="flex justify-start text-gray-700">
                <img
                  src={item.gambar}
                  alt={item.nama}
                  className="w-[130px] h-[130px] rounded-2xl"
                />
                <div className="flex flex-col font-poppins ml-5">
                  <p className="font-medium text-xl capitalize">{item.nama}</p>
                  <span className="mt-3 text-xl font-bold">
                    {formatUang(item.totalHarga)}
                  </span>
                  <div className="flex items-center gap-5 mt-2.5">
                    <button className="cursor-pointer">
                      <MinusIcon className="w-7 h-7" />
                    </button>
                    <span className="text-2xl font-bold">{item.quantity}</span>
                    <button className="cursor-pointer">
                      <PlusIcon className="w-7 h-7" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col justify-center ml-5">
                  <button className="cursor-pointer">
                    <TrashIcon className="w-9 h-9" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
