import {
  AdjustmentsHorizontalIcon,
  MagnifyingGlassIcon,
  MinusIcon,
  PencilSquareIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";

import data from "../data.json";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import { useNavigate } from "react-router";

function formatUang(subject) {
  const rupiah = subject.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
  return `Rp${rupiah}`;
}

const ProductCard = ({ product, addToCart }) => {
  const [counter, setCounter] = useState(0);

  const addItem = () => {
    console.log("addItem");
    const newCounter = counter + 1;
    setCounter(newCounter);
    addToCart(product.id, newCounter);
  };

  const removeItem = () => {
    console.log("removeItem");
    const newCounter = counter >= 1 ? counter - 1 : counter;
    setCounter(newCounter);
    addToCart(product.id, newCounter);
  };

  return (
    <div
      onClick={() => addItem()}
      className="bg-[#F8F8FF] font-poppins relative shadow-product rounded-3xl mt-14 cursor-pointer select-none"
    >
      <div className="absolute -top-14 inset-x-0 flex justify-center">
        <div className="relative">
          {counter != 0 ? (
            <>
              <span className="absolute -top-2.5 -left-4 rounded-full bg-[#FF6D58] inline-flex items-center px-3 py-2 text-lg text-gray-50 leading-4 font-medium">
                {counter}
              </span>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  removeItem();
                }}
                className="absolute -top-2.5 -right-4 rounded-full bg-[#FF6D58] flex justify-center items-center p-1 cursor-pointer"
              >
                <MinusIcon className="w-7 h-7 text-gray-50" />
              </div>
            </>
          ) : (
            <></>
          )}
          <img
            src={product.gambar}
            alt={product.nama}
            className="w-[122px] h-[110px] rounded-2xl"
          />
        </div>
      </div>
      <div className="p-3.5 mt-12">
        <p className="pb-2 font-medium text-lg text-gray-700 capitalize">
          {product.nama}
        </p>
        <p className="font-bold text-xl text-gray-900">
          {formatUang(product.harga)}
        </p>
      </div>
    </div>
  );
};

const ProductGrid = ({ addToCart }) => {
  return (
    <div className="pt-5 px-6">
      <div className="grid grid-cols-2 gap-6 content-start">
        {data.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            addToCart={addToCart}
          />
        ))}
      </div>
    </div>
  );
};

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState([]);
  let navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const addToCart = (productId, quantity) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === productId);
      if (existingProduct) {
        if (quantity === 0) {
          return prevCart.filter((item) => item.id !== productId);
        }
        return prevCart.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        );
      } else {
        return [...prevCart, { id: productId, quantity }];
      }
    });
  };

  const handleCheckout = () => {
    navigate("cart", {
      state: { cart },
    });
  };

  if (isLoading) return <Loading />;

  return (
    <div className="mx-auto min-h-screen max-w-md bg-[#F8F8FF] relative">
      <div className="relative px-6 pb-14">
        <h3 className="pt-8 font-poppins font-bold text-3xl text-gray-700">
          Meja 1
        </h3>
        <div className="flex justify-start items-center">
          <form className="py-7.5 w-full">
            <div className="relative w-full">
              <input
                type="text"
                id="name"
                className="block w-full p-4 bg-[#FEECE9] text-gray-700 text-base font-poppins rounded-lg focus:outline-none"
                placeholder="John"
                required
              />
              <button className="absolute end-0 top-0 p-4 h-full bg-[#FEECE9] rounded-lg cursor-pointer">
                <MagnifyingGlassIcon className="w-6 h-6 text-gray-700" />
              </button>
            </div>
          </form>
          <button className="pl-4.5 cursor-pointer">
            <AdjustmentsHorizontalIcon className="w-7.5 h-7.5 text-gray-700" />
          </button>
        </div>
        <div>
          <div className="flex justify-between items-center">
            <h4 className="font-poppins font-medium text-2xl text-gray-700">
              Menu Populer
            </h4>
          </div>
          <ProductGrid addToCart={addToCart} />
        </div>
        <div className="sticky bottom-18 z-20 flex flex-col items-end mt-10">
          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className={`py-3 px-4 bg-[#FF6D58] rounded-lg cursor-pointer group disabled:bg-[#b97267] text-white hover:text-gray-700 disabled:hover:text-white`}
          >
            <ShoppingCartIcon className="w-8 h-8" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
