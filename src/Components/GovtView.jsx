import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { contractABI, contractAddress } from "../config";
import { isVisible } from "@testing-library/user-event/dist/utils";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const GovtView = () => {
  const storedLoginStatus = localStorage.getItem("isLoggedIn");
  const [isLoggedIn, setIsLoggedIn] = useState(storedLoginStatus === "true");
  const [vehicleData, setVehicleData] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
    const fetchVehicleData = async () => {
      try {
        const web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:7545");
        const registrationContract = new web3.eth.Contract(
          contractABI,
          contractAddress
        );
        const registrationCount = await registrationContract.methods
          .registrationCount()
          .call();
        const vehicleDataArray = [];
        for (let i = 1; i <= registrationCount; i++) {
          const vehicle = await registrationContract.methods
            .registrationData(i)
            .call();
          vehicleDataArray.push(vehicle);
        }
        setVehicleData(vehicleDataArray);
      } catch (error) {
        console.error("Error fetching vehicle data:", error);
      }
    };

    fetchVehicleData();
  }, []);

  const handleApprove = async (index) => {
    try {
      const web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:7545");
      const registrationContract = new web3.eth.Contract(
        contractABI,
        contractAddress
      );
      const account = (await web3.eth.getAccounts())[0];
      const vehicleId = index + 1; // Add 1 to index to match with vehicleId in the contract
      await registrationContract.methods
        .approveRegistration(vehicleId)
        .send({ from: account });
      // Update the vehicle data after approval
      const updatedVehicleData = [...vehicleData];
      updatedVehicleData[index].approved = true;
      setVehicleData(updatedVehicleData);
    } catch (error) {
      console.error("Error approving registration:", error);
    }
  };

  const handleLogin = () => {
    console.log("Govt");
    if (username !== "govt") {
      // alert("Invalid Credentials");
      notify("❌ Login Unsuccessfully");
      return;
    }
    console.log("Govt");
    localStorage.setItem("isLoggedIn", "true");
    notify("✅ Login Successfully");
    setTimeout(() => {
      setIsLoggedIn(true);
      // window.location.href = "/";
      // window.location.reload();
    }, 1500);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
  };

  return (
    <>
      {!isLoggedIn && (
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
                  handleLogin();
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
                  <p>Enter your personal details to use all site features</p>
                  <button className="hidden" id="login" onClick={handleLogin}>
                    Sign In
                  </button>
                </div>
                <div className="toggle-panel toggle-right">
                  <h1 style={{ color: "white" }}>Government</h1>
                  <h1 style={{ color: "white" }}>Login</h1>
                  {/* <p>
                      Register with your personal details to use all site features
                    </p> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {isLoggedIn && (
        <>
          <div className="centered-text">
            <h1 style={{ marginTop: "10px" }}>Govt View</h1>
            <h2 style={{ marginTop: "40px" }}>Welcome to the Govt View</h2>
          </div>
          <button
            className="logout-button"
            style={{ backgroundColor: "red", fontWeight: "bold" }}
            onClick={handleLogout}
          >
            Logout
          </button>
          <h2 style={{ marginTop: "20px" }}>All Vehicle Data</h2>
          <table>
            <thead>
              <tr>
                <th>Status</th>
                <th>Username</th>
                <th>Vehicle No</th>
                <th>Vehicle Type</th>
                <th>Vehicle Model</th>
                <th>Vehicle Company</th>
                <th>Vehicle Color</th>
                <th>Document 1</th>
                <th>Document 2</th>
                <th>image Hash</th>
                <th>Approve</th>
              </tr>
            </thead>
            <tbody>
              {vehicleData.map((vehicle, index) => (
                <tr key={index}>
                  <td>{vehicle.approved ? "Approved" : "Pending"}</td>
                  <td>{vehicle.username}</td>
                  <td>{vehicle.vehicleNo}</td>
                  <td>{vehicle.vehicleType}</td>
                  <td>{vehicle.vehicleModel}</td>
                  <td>{vehicle.vehicleCompany}</td>
                  <td>{vehicle.vehicleColor}</td>
                  <td>
                    <a
                      href={vehicle.documentHash1}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download
                    </a>
                  </td>
                  {/* Accessing the second element of documentHashes if it exists */}
                  {/* <td>{user.documentHash2}</td> */}
                  <td>
                    <a
                      href={vehicle.documentHash2}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download
                    </a>
                  </td>
                  {/* <td>{user.imageHash}</td> */}
                  <td>
                    <a
                      href={vehicle.imageHash}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download
                    </a>
                  </td>
                  <td>
                    {!vehicle.approved && (
                      <button
                        disabled={vehicle.approved}
                        style={
                          vehicle.approved ? { backgroundColor: "grey" } : {}
                        }
                        onClick={() => handleApprove(index)}
                      >
                        Approve
                      </button>
                    )}
                    {vehicle.approved && <p>Approved</p>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </>
  );
};

export default GovtView;

// <>
//   {!isLoggedIn && (
//     <>
//       <h1>Govt View</h1>
//       <label htmlFor="username">Username</label>
//       <input
//         type="text"
//         placeholder="Username"
//         value={username}
//         onChange={(e) => setUsername(e.target.value)}
//       />
//       <label htmlFor="Password">Password</label>
//       <input
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//       />
//       <button onClick={handleLogin}>Login</button>
//     </>
//   )}
//   {isLoggedIn && (
//     <>
//       <h1>Govt View</h1>
//       <p>Welcome to the Govt View</p>
//       <button onClick={handleLogout}>Logout</button>
//       <h2>All Vehicle Data</h2>
//       <table>
//         <thead>
//           <tr>
//             <th>Status</th>
//             <th>Username</th>
//             <th>Vehicle No</th>
//             <th>Vehicle Type</th>
//             <th>Vehicle Model</th>
//             <th>Vehicle Company</th>
//             <th>Vehicle Color</th>
//             <th>Document 1</th>
//             <th>Document 2</th>
//             <th>image Hash</th>
//             <th>Approve</th>
//           </tr>
//         </thead>
//         <tbody>
//           {vehicleData.map((vehicle, index) => (
//             <tr key={index}>
//               <td>{vehicle.approved ? "Approved" : "Pending"}</td>
//               <td>{vehicle.username}</td>
//               <td>{vehicle.vehicleNo}</td>
//               <td>{vehicle.vehicleType}</td>
//               <td>{vehicle.vehicleModel}</td>
//               <td>{vehicle.vehicleCompany}</td>
//               <td>{vehicle.vehicleColor}</td>
//               <td>
//                 <a
//                   href={vehicle.documentHash1}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                 >
//                   Download
//                 </a>
//               </td>
//               {/* Accessing the second element of documentHashes if it exists */}
//               {/* <td>{user.documentHash2}</td> */}
//               <td>
//                 <a
//                   href={vehicle.documentHash2}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                 >
//                   Download
//                 </a>
//               </td>
//               {/* <td>{user.imageHash}</td> */}
//               <td>
//                 <a
//                   href={vehicle.imageHash}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                 >
//                   Download
//                 </a>
//               </td>
//               <td>
//                 {!vehicle.approved && (
//                   <button
//                     disabled={vehicle.approved}
//                     style={
//                       vehicle.approved ? { backgroundColor: "grey" } : {}
//                     }
//                     onClick={() => handleApprove(index)}
//                   >
//                     Approve
//                   </button>
//                 )}
//                 {vehicle.approved && <p>Approved</p>}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </>
//   )}
// </>
