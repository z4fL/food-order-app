import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Loader from "../Loader";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      navigate("/dashboard");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    await axios
      .post(apiUrl + "/login", formData)
      .then((res) => {
        localStorage.setItem("access_token", res.data.access_token);

        const role = res.data.role;
        if (role == "admin") {
          navigate("/dashboard");
        } else if (role == "cashier") {
          navigate("/cashier");
        }
      })
      .catch((error) => {
        const errorStatus = error.response.status;

        if (errorStatus == 401) {
          setError("Email atau Password salah!");
        } else {
          setError(error.response.statusText);
        }
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="mx-auto min-h-screen max-w-md md:max-w-3xl lg:max-w-5xl xl:max-w-6xl bg-[#F8F8FF] relative">
      <div className="relative mx-auto px-6 pb-14 max-w-md">
        <h3 className="pt-32 lg:pt-20 font-poppins font-bold text-3xl text-center text-gray-700">
          Login
        </h3>
        <div className="mt-8">
          {error.length != 0 && (
            <div
              className="p-4 mb-4 text-lg text-red-800 rounded-lg bg-red-50"
              role="alert"
            >
              {error}
            </div>
          )}

          <form
            onSubmit={handleLogin}
            className="flex flex-col justify-center font-poppins"
          >
            <div className="mb-5">
              <label
                htmlFor="email"
                className="block mb-2 text-lg font-medium text-gray-900"
              >
                Your email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:outline focus:outline-[#FF6D58] focus:border-[#FF6D58] block w-full p-2.5"
                required
              />
            </div>
            <div className="mb-5">
              <label
                htmlFor="password"
                className="block mb-2 text-lg font-medium text-gray-900"
              >
                Your password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:outline focus:outline-[#FF6D58] focus:border-[#FF6D58] block w-full p-2.5"
                required
              />
            </div>
            <button
              type="submit"
              className="text-white bg-[#FF6D58] hover:bg-[#ff6e58de] focus:ring-4 focus:outline-none focus:ring-[#ffafa2] font-medium rounded-lg text-xl w-full px-5 py-2.5 text-center"
            >
              {isLoading ? <Loader /> : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
