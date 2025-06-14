import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MinusIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { CartContext } from "../context/CartContext";
import axios from "axios";
import formatRupiah from "../utilities/FormatRupiah";
import Loader from "./Loader";

const Cart = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { nomorMeja } = useParams();
  const { cart, setCart } = useContext(CartContext);
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (cart && cart.length === 0) {
      navigate(`/menu/${nomorMeja}`);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const listCart = cart
    ? cart.map((item) => {
        return {
          ...item,
          totalHarga: item.qty * item.harga,
        };
      })
    : [];

  const handleBack = () => {
    navigate(-1);
  };

  const handleCounter = (id, type) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity:
                type === "+"
                  ? item.qty + 1
                  : item.qty > 1
                  ? item.qty - 1
                  : item.qty,
            }
          : item
      )
    );
  };

  // Calculate total price
  const totalHarga = listCart.reduce((sum, item) => sum + item.totalHarga, 0);

  // Remove item from cart
  const handleRemove = (id) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item.id !== id);
      return updatedCart;
    });
    if (cart.length === 0) {
      console.log("ok");
      navigate(`/menu/${nomorMeja}`);
    }
  };

  const handleOrder = () => {
    setIsLoading(true);
    const data = {
      catatan: null,
      meja: parseInt(nomorMeja),
      details: listCart.map((item) => ({
        produk_id: item.id,
        nama_produk: item.nama,
        harga_produk: item.harga,
        qty: item.qty,
      })),
    };

    axios
      .post(`${apiUrl}/orders`, data, {
        headers: { "ngrok-skip-browser-warning": "1" },
      })
      .then((res) => {
        console.log("sukses menambah pesanan!");
        setCart([]);
        navigate(`/detail-order/${res.data.data.uuid}`);
      })
      .catch((err) => {
        alert(err);
        console.error(err);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="flex flex-col mx-auto min-h-screen max-w-md md:max-w-3xl lg:max-w-5xl xl:max-w-6xl bg-[#F8F8FF] relative">
      <div className="flex-1 relative px-6 pb-14">
        <div className="flex pt-8">
          <button className="cursor-pointer" onClick={handleBack}>
            <ChevronLeftIcon className="w-8 h-8 text-gray-700" />
          </button>
          <h3 className="pl-4 font-poppins font-bold text-3xl text-gray-700">
            Meja {nomorMeja}
          </h3>
        </div>
        <div className="relative flex justify-between mt-10 mb-[260px] md:mx-auto lg:mx-0 md:max-w-xl lg:max-w-full">
          <div className="flex flex-col gap-5">
            {listCart.map((item) => (
              <div
                key={item.nama}
                className="flex justify-start items-center text-gray-700"
              >
                <img
                  src={item.gambar}
                  alt={item.nama}
                  className="w-[110px] h-[110px] rounded-2xl"
                />
                <div className="grow flex flex-col font-poppins ml-5">
                  <p className="font-medium text-base capitalize">
                    {item.nama}
                  </p>
                  <span className="mt-1 text-lg font-bold">
                    {formatRupiah(item.totalHarga)}
                  </span>
                  <div className="flex items-center gap-4 mt-2.5">
                    <button
                      onClick={() => handleCounter(item.id, "-")}
                      className="cursor-pointer"
                    >
                      <MinusIcon className="w-5 h-5" />
                    </button>
                    <span className="text-2xl font-bold">{item.qty}</span>
                    <button
                      onClick={() => handleCounter(item.id, "+")}
                      className="cursor-pointer"
                    >
                      <PlusIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col justify-center ml-5 lg:ml-16">
                  <button
                    className="cursor-pointer"
                    onClick={() => handleRemove(item.id)}
                  >
                    <TrashIcon className="w-9 h-9" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="hidden lg:sticky top-10 lg:flex flex-col bg-gray-900 px-10 py-7 rounded-2xl lg:w-sm h-max">
            <div className="flex justify-between pb-3">
              <span className="font-poppins font-medium text-lg text-white">
                Catatan
              </span>
              <ChevronRightIcon className="w-6 h-6 text-white" />
            </div>
            <div className="flex justify-between pb-4">
              <span className="font-poppins font-medium text-xl text-white">
                Total
              </span>
              <span className="font-poppins font-bold text-2xl text-white">
                {formatRupiah(totalHarga)}
              </span>
            </div>
            <button
              onClick={() => handleOrder()}
              className="w-full bg-[#fb5f48] rounded-lg py-4 font-poppins font-medium text-xl text-white cursor-pointer"
            >
              Pesan Sekarang
            </button>
          </div>
        </div>
      </div>
      <div className="sticky lg:hidden bottom-0 inset-x-0 bg-gray-900 px-10 py-7 rounded-t-3xl">
        <div className="flex justify-between pb-3">
          <span className="font-poppins font-medium text-lg text-white">
            Catatan
          </span>
          <ChevronRightIcon className="w-6 h-6 text-white" />
        </div>
        <div className="flex justify-between pb-4">
          <span className="font-poppins font-medium text-xl text-white">
            Total
          </span>
          <span className="font-poppins font-bold text-2xl text-white">
            {formatRupiah(totalHarga)}
          </span>
        </div>
        <button
          onClick={() => handleOrder()}
          className="w-full bg-[#fb5f48] rounded-lg py-4 font-poppins font-medium text-xl text-white cursor-pointer"
          disabled={isLoading}
        >
          {isLoading ? <Loader /> : "Pesan Sekarang"}
        </button>
      </div>
    </div>
  );
};

export default Cart;
