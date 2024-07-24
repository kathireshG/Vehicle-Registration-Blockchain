import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { contractABI, contractAddress } from "../config";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserRegistration = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [web3, setWeb3] = useState(null);

  const [account, setAccount] = useState("");
  const [userRegistrationContract, setUserRegistrationContract] =
    useState(null);

  const navigate = useNavigate();

  const notify = (text) => {
    toast(`${text}`, {
      position: "top-center",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };

  useEffect(() => {
    if (window.localStorage.getItem("username") !== null) {
      window.location.href = "/";
    }

    const loadBlockchainData = async () => {
      try {
        const web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:7545");
        setWeb3(web3);
        // let provider = window.ethereum;
        // console.log(provider);

        // if (typeof provider !== 'undefined') {
        //     //Metamask is installed
        //     provider
        //     .request({method: 'eth_requestAccounts' })
        //     .then((accounts) => {
        //     console.log(accounts);
        //     })
        //     .catch((err) => {
        //     console.log(err);
        //     });
        // }

        const userRegistrationContract = new web3.eth.Contract(
          contractABI,
          contractAddress
        );
        const accounts = await web3.eth.getAccounts();
        // console.log(accounts);
        setUserRegistrationContract(userRegistrationContract);
        setAccount(accounts[0]);
      } catch (error) {
        console.error("Error loading blockchain data:", error);
      }
    };
    loadBlockchainData();
  }, []);

  const handleSubmit = async () => {
    try {
      if (!web3) {
        throw new Error("Web3 instance not initialized");
      }
      if (!userRegistrationContract) {
        throw new Error("User registration contract not initialized");
      }
      if (!username || !password) {
        throw new Error("Please provide both username and password");
      }

      await userRegistrationContract.methods
        .createUser(username, password)
        .send({ from: account });

      setUsername("");
      setPassword("");
      // await alert("User registration successful");
      window.localStorage.setItem("username", username);
      notify("✅ Registered successfully");
      // navigate("/");
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  return (
    <div>
      <ToastContainer
        position="bottom-center"
        autoClose={100}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className="container" id="container">
        <div className="form-container sign-in">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <h1>Register</h1>
            <input
              type="text"
              className="login-input"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              className="login-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Register</button>
          </form>
        </div>
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-right">
              <h1 style={{ color: "white" }}>Hello, Friend!</h1>
              <p>Already have an Account?</p>
              <button
                className="hidden"
                id="register"
                onClick={() => (window.location.href = "/")}
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRegistration;
