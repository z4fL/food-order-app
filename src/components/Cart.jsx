import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MinusIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import dataProduct from "../data.json";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { CartContext } from "../context/CartContext";

function formatUang(subject) {
  const rupiah = subject.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
  return `Rp${rupiah}`;
}

const Cart = () => {
  const { cart } = useContext(CartContext);
  let navigate = useNavigate();

  useEffect(() => {
    if (!cart) {
      navigate("/");
    }
  });

  const listCart = cart
    ? cart.map((item) => {
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
    navigate(-1);
  };

  return (
    <div className="flex flex-col mx-auto min-h-screen max-w-md bg-[#F8F8FF] relative">
      <div className="flex-1 relative px-6 pb-14">
        <div className="flex pt-8">
          <button className="cursor-pointer" onClick={handleBack}>
            <ChevronLeftIcon className="w-8 h-8 text-gray-700" />
          </button>
          <h3 className="pl-8 font-poppins font-bold text-3xl text-gray-700">
            Meja 1
          </h3>
        </div>
        <div className="mt-10 mb-[260px]">
          <div className="flex flex-col gap-5">
            {listCart.map((item) => (
              <div key={item.nama} className="flex justify-start text-gray-700">
                <img
                  src={item.gambar}
                  alt={item.nama}
                  className="w-[130px] h-[130px] rounded-2xl"
                />
                <div className="grow flex flex-col font-poppins ml-5">
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
      <div className="sticky bottom-0 inset-x-0 bg-gray-900 px-12 py-10 rounded-t-3xl">
        <div className="flex justify-between pb-7">
          <span className="font-poppins font-medium text-xl text-white">
            Catatan
          </span>
          <ChevronRightIcon className="w-7 h-7 text-white" />
        </div>
        <div className="flex justify-between pb-7">
          <span className="font-poppins font-medium text-xl text-white">
            Total
          </span>
          <span className="font-poppins font-bold text-2xl text-white">
            {formatUang(51000)}
          </span>
        </div>
        <button className="w-full bg-[#fb5f48] rounded-lg py-4 font-poppins font-medium text-xl text-white cursor-pointer ">
          Pesan Sekarang
        </button>
      </div>
    </div>
  );
};

export default Cart;
