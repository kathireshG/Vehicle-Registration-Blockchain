import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { contractABI, contractAddress } from "../config";
import { Link } from "react-router-dom";
// import "./UserLogin.css";
import "./login.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState("");
  const [userRegistrationContract, setUserRegistrationContract] =
    useState(null);
  const [users, setUsers] = useState([]);

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
        const userRegistrationContract = new web3.eth.Contract(
          contractABI,
          contractAddress
        );
        const accounts = await web3.eth.getAccounts();
        setUserRegistrationContract(userRegistrationContract);
        setAccount(accounts[0]);
        console.log(accounts);
        await fetchUserData(userRegistrationContract);
      } catch (error) {
        console.error("Error loading blockchain data:", error);
      }
    };
    loadBlockchainData();
  }, []);

  const fetchUserData = async (contract) => {
    try {
      const userCount = await contract.methods.userCount().call();
      // console.log("User count:", userCount);
      const usersArray = [];
      for (let i = 1; i <= userCount; i++) {
        const user = await contract.methods.users(i).call();
        // console.log("User fetched:", user);
        usersArray.push(user);
      }
      // console.log("Fetched users:", usersArray);
      setUsers(usersArray);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleSubmit = async () => {
    console.log(username);
    console.log(password);
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

      const userExists = users.some(
        (user) => user.username === username && user.password === password
      );

      if (userExists) {
        console.log("User login successful");
        window.localStorage.setItem("username", username);
        // window.location.href = "/";
        notify("✅ Login Successfully");
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      } else {
        notify("❌ Login Unsuccessful");
        // alert("Incorrect username or password");
      }

      setUsername("");
      setPassword("");
    } catch (error) {
      console.error("Error logging in user:", error);
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
            <h1>Sign In</h1>
            <input
              type="text"
              className="login-input"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              className="login-input"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button>Sign In</button>
          </form>
        </div>
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1>Welcome Back!</h1>
              <p>Enter your personal details to use all of site features</p>
              <button className="hidden" id="login" onClick={handleSubmit}>
                Sign In
              </button>
            </div>
            <div className="toggle-panel toggle-right">
              <h1 style={{ color: "white" }}>Hello, Friend!</h1>
              <p>
                Register with your personal details to use all of site features
              </p>
              <button
                className="hidden"
                id="register"
                onClick={() => (window.location.href = "/register")}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
