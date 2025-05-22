import {
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  MagnifyingGlassIcon,
  MinusIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { CartContext } from "../context/CartContext";
import axios from "axios";
import formatRupiah from "../utilities/FormatRupiah";

const ProductCard = ({ product, addToCart, cart }) => {
  const [counter, setCounter] = useState(0);

  const storageUrl = import.meta.env.VITE_STORAGE_URL;

  useEffect(() => {
    const cartItem = cart.find((item) => item.id === product.id);
    if (cartItem) {
      setCounter(cartItem.qty);
    }
  }, [cart, product.id]);

  const addItem = () => {
    const newCounter = counter + 1;
    setCounter(newCounter);
    addToCart(product.id, newCounter);
  };

  const removeItem = () => {
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
            src={`${storageUrl}/${product.gambar}`}
            alt={product.nama}
            className="w-[122px] h-[110px] rounded-2xl"
          />
        </div>
      </div>
      <div className="p-3.5 mt-12">
        <p className="pb-2 font-medium text-base text-gray-700 capitalize">
          {product.nama}
        </p>
        <p className="font-bold text-lg text-gray-900">
          {formatRupiah(product.harga)}
        </p>
      </div>
    </div>
  );
};

const Menu = () => {
  const { nomorMeja } = useParams();
  const [produks, setProduks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { cart, setCart } = useContext(CartContext);

  const [showMakanan, setShowMakanan] = useState(true);
  const [showMinuman, setShowMinuman] = useState(true);
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL;

  const checkMeja = async (meja) => {
    try {
      await axios
        .post(`${apiUrl}/orders/check-meja`, {
          meja: meja,
        })
        .then((res) => {
          if (res.data.exists) {
            console.log("Meja sedang digunakan!");
            navigate("/");
          }
        });
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    await axios
      .get(`${apiUrl}/produks`)
      .then((res) => {
        setProduks(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    checkMeja(nomorMeja);
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addToCart = (productId, quantity) => {
    const product = produks.find((p) => p.id === productId);
    if (!product) return; // Optionally handle missing product

    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === productId);
      if (existingProduct) {
        if (quantity === 0) {
          return prevCart.filter((item) => item.id !== productId);
        }
        return prevCart.map((item) =>
          item.id === productId ? { ...item, qty: quantity } : item
        );
      } else {
        // Add all product properties plus quantity
        return [...prevCart, { ...product, qty: quantity }];
      }
    });
  };

  const handleCart = () => {
    navigate(`/cart/${nomorMeja}`);
  };

  return (
    <div className="mx-auto min-h-screen max-w-md bg-[#F8F8FF] relative">
      <div className="relative px-6 pb-28">
        <h3 className="pt-8 font-poppins font-bold text-3xl text-gray-700">
          Meja {nomorMeja}
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
          {isLoading ? (
            <div className="flex justify-center items-center">
              <div className="loader"></div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <h4 className="font-poppins font-medium text-2xl text-gray-700">
                  Makanan
                </h4>
                {showMakanan ? (
                  <ChevronUpIcon
                    className="w-6 h-6 text-gray-900"
                    onClick={() => setShowMakanan((prev) => !prev)}
                  />
                ) : (
                  <ChevronDownIcon
                    className="w-6 h-6 text-gray-900"
                    onClick={() => setShowMakanan((prev) => !prev)}
                  />
                )}
              </div>
              <div
                id="makanan"
                className={`pt-5 pb-6 ${!showMakanan && "hidden"}`}
              >
                <div className="grid grid-cols-2 gap-6 content-start">
                  {produks
                    .filter((product) => product.kategori === "makanan")
                    .map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        addToCart={addToCart}
                        cart={cart}
                      />
                    ))}
                </div>
              </div>

              <div className="flex justify-between items-center mt-6 ">
                <h4 className="font-poppins font-medium text-2xl text-gray-700">
                  Minuman
                </h4>
                {showMinuman ? (
                  <ChevronUpIcon
                    className="w-6 h-6 text-gray-900"
                    onClick={() => setShowMinuman((prev) => !prev)}
                  />
                ) : (
                  <ChevronDownIcon
                    className="w-6 h-6 text-gray-900"
                    onClick={() => setShowMinuman((prev) => !prev)}
                  />
                )}
              </div>
              <div
                id="minuman"
                className={`pt-5 pb-6 ${!showMinuman && "hidden"}`}
              >
                <div className="grid grid-cols-2 gap-6 content-start">
                  {produks
                    .filter((product) => product.kategori === "minuman")
                    .map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        addToCart={addToCart}
                        cart={cart}
                      />
                    ))}
                </div>
              </div>
            </>
          )}
        </div>
        {!isLoading && (
          <div className="fixed right-6 bottom-10 z-20 flex flex-col items-end mt-10">
            <button
              onClick={handleCart}
              disabled={cart.length === 0}
              className={`py-3 px-4 bg-[#FF6D58] rounded-lg cursor-pointer group disabled:bg-[#b97267] text-white hover:text-gray-700 disabled:hover:text-white`}
            >
              <ShoppingCartIcon className="w-8 h-8" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
