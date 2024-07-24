import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Web3 from "web3";
import { contractABI, contractAddress } from "../config";

const Transfer = () => {
  const [vehicleNo, setVehicleNo] = useState("");
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState("");
  const [password_, setPassword_] = useState("");
  const [value, setValue] = useState(false);
  const [transferTo, setTransferTo] = useState("");
  const [userRegistrationContract, setUserRegistrationContract] =
    useState(null);
  const [users, setUsers] = useState([]);
  const [users_, setUsers_] = useState([]);
  const [localStorageUsername, setLocalStorageUsername] = useState("");

  useEffect(() => {
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
        await fetchUserData(userRegistrationContract);
        await fetchUserData_(userRegistrationContract);
        const storedUsername = window.localStorage.getItem("username");
        setLocalStorageUsername(storedUsername);
      } catch (error) {
        console.error("Error loading blockchain data:", error);
      }
    };
    loadBlockchainData();
  }, []);

  const fetchUserData = async (contract) => {
    try {
      const registrationCount = await contract.methods
        .registrationCount()
        .call();
      const usersArray = [];
      for (let i = 1; i <= registrationCount; i++) {
        const user = await contract.methods.registrationData(i).call();
        console.log("User fetched:", user);
        usersArray.push(user);
      }
      console.log("Fetched users:", usersArray);
      setUsers(usersArray);
      console.log(users);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchUserData_ = async (contract) => {
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
      setUsers_(usersArray);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleTransfer = async () => {
    try {
      const userExists = users_.some((user) => user.password === password_);

      if (!userExists) {
        alert("Incorrect username or password");
      } else {
        const isVehicleOwned = users.some(
          (user) =>
            user.username === localStorageUsername &&
            user.vehicleNo === vehicleNo
        );
        if (isVehicleOwned) {
          setValue(true);
          // alert("Error Transfering Vehicle");
          await new Promise((resolve) => setTimeout(resolve, 0)); // Wait for state update to take effect
        }

        if (value) {
          const web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:7545");
          const registrationContract = new web3.eth.Contract(
            contractABI,
            contractAddress
          );
          const account = (await web3.eth.getAccounts())[0];
          await registrationContract.methods
            .transferOwnership(vehicleNo, transferTo)
            .send({ from: account });
          window.location.href = "/";
        } else {
          // alert("Error Transfering Vehicle");
        }
      }
    } catch (error) {
      console.error("Error transferring:", error);
    }
  };

  // const handleTransfer = async () => {
  //   try {
  //     users.map((user, index) => {
  //       if (user.username === localStorageUsername) {
  //         console.log(user.vehicleNo);
  //         if (vehicleNo === user.vehicleNo) {
  //           console.log("True");
  //           // setValue(true);
  //         }
  //       }
  //     });
  //     // console.log(value);

  //     const web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:7545");
  //     const registrationContract = new web3.eth.Contract(
  //       contractABI,
  //       contractAddress
  //     );
  //     const account = (await web3.eth.getAccounts())[0];
  //     await registrationContract.methods
  //       .transferOwnership(vehicleNo, transferTo)
  //       .send({ from: account });
  //     window.location.href = "/";
  //   } catch (error) {
  //     console.error("Error transfering:", error);
  //   }
  // };

  return (
    <div>
      <Navbar />
      <h1 style={{ marginTop: "10px" }}>Transfer Ownership</h1>
      <div className="transferForm" style={{ width: "50%", marginTop: "10px" }}>
        <h3>{null}</h3>
        <label>Vehicle Number:</label>
        <input
          type="text"
          value={vehicleNo}
          onChange={(e) => setVehicleNo(e.target.value)}
          required
        />
        <label>Transfer To: (username)</label>
        <input
          type="text"
          value={transferTo}
          onChange={(e) => setTransferTo(e.target.value)}
          required
        />
        <label>Password</label>
        <input
          type="password"
          value={password_}
          onChange={(e) => setPassword_(e.target.value)}
          required
        />
        <p>*This process is irreversible</p>
        <button onClick={handleTransfer} style={{ marginTop: "10px" }}>
          Transfer
        </button>
      </div>
    </div>
  );
};

export default Transfer;

// 2
// import React, { useState } from "react";
// import Navbar from "./Navbar";
// import Web3 from "web3";
// import { contractABI, contractAddress } from "../config";

// const Transfer = () => {
//   const [vehicleNo, setVehicleNo] = useState("");
//   const [transferTo, setTransferTo] = useState("");

//   const handleTransfer = async () => {
//     try {
//       const web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:7545");
//       const registrationContract = new web3.eth.Contract(
//         contractABI,
//         contractAddress
//       );
//       const account = (await web3.eth.getAccounts())[0];
//       const currentOwner = window.localStorage.getItem("username"); // Get current owner's username from local storage

//       // Call the transferOwnership function of the smart contract
//       await registrationContract.methods
//         .transferOwnership(vehicleNo, transferTo, currentOwner) // Pass current owner's username as the third argument
//         .send({ from: account });
//       window.location.reload();
//       // Optionally, you can add code to handle success, show a message, or navigate to another page
//       console.log("Ownership transferred successfully!");
//     } catch (error) {
//       // Handle errors appropriately
//       console.error("Error transferring ownership:", error);
//     }
//   };

//   return (
//     <div>
//       <Navbar />
//       <h1>Transfer Ownership</h1>
//       <div className="transferForm">
//         <h3>{null}</h3>
//         <label>Vehicle Number:</label>
//         <input
//           type="text"
//           value={vehicleNo}
//           onChange={(e) => setVehicleNo(e.target.value)}
//         />
//         <label>Transfer To: (username)</label>
//         <input
//           type="text"
//           value={transferTo}
//           onChange={(e) => setTransferTo(e.target.value)}
//         />
//         <p>*This process is irreversible</p>
//         <button onClick={handleTransfer}>Transfer</button>
//       </div>
//     </div>
//   );
// };

// export default Transfer;

//no password
// const handleTransfer = async () => {
//   try {
//     const isVehicleOwned = users.some(
//       (user) =>
//         user.username === localStorageUsername && user.vehicleNo === vehicleNo
//     );
//     if (isVehicleOwned) {
//       setValue(true);
//       await new Promise((resolve) => setTimeout(resolve, 0)); // Wait for state update to take effect
//     }

//     if (value) {
//       const web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:7545");
//       const registrationContract = new web3.eth.Contract(
//         contractABI,
//         contractAddress
//       );
//       const account = (await web3.eth.getAccounts())[0];
//       await registrationContract.methods
//         .transferOwnership(vehicleNo, transferTo)
//         .send({ from: account });
//       window.location.href = "/";
//     } else {
//       // alert("Error Transfering Vehicle");
//     }
//   } catch (error) {
//     console.error("Error transferring:", error);
//   }
// };
