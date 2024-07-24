import React, { useState, useRef } from "react";
import Web3 from "web3";
import { contractABI, contractAddress } from "../config";
import Navbar from "./Navbar";

const PINATA_SECRET_JWT = process.env.REACT_APP_PINATA_SECRET_JWT;

// console.log(PINATA_SECRET_JWT);

const VehicleRegistration = () => {
  const [isRegistering, setIsRegistering] = useState(false);

  const [username, setUsername] = useState(
    window.localStorage.getItem("username") || ""
  );
  const [vehicleNo, setVehicleNo] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehicleCompany, setVehicleCompany] = useState("");
  const [vehicleColor, setVehicleColor] = useState("");
  const [document1, setDocument1] = useState(null);
  const [document2, setDocument2] = useState(null);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [document1Preview, setDocument1Preview] = useState(null);
  const [document2Preview, setDocument2Preview] = useState(null);
  const inputFile1 = useRef(null);
  const inputFile2 = useRef(null);
  const inputImage = useRef(null);

  const pinataGateway = "https://gateway.pinata.cloud/ipfs/";

  const uploadToPinata = async (file, name_) => {
    try {
      setUploading(true);
      const formData = new FormData();
      // formData.append("file", file);
      formData.append("file", file);
      const metadata = JSON.stringify({
        name: name_,
      });
      formData.append("pinataMetadata", metadata);

      const options = JSON.stringify({
        cidVersion: 0,
      });
      formData.append("pinataOptions", options);

      const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          // Authorization: `Basic ${btoa(
          //   `${PINATA_API_KEY}:${PINATA_SECRET_API_KEY}`
          // )}`,
          Authorization: `Bearer ${PINATA_SECRET_JWT}`,
        },
        body: formData,
      });

      const data = await response.json();
      setUploading(false);
      return data.IpfsHash;
    } catch (error) {
      console.error("Error uploading file to Pinata:", error);
      setUploading(false);
      return null;
    }
  };

  // const handleDocument1Change = async (e) => {
  //   setDocument1(e.target.files[0]);
  //   const ipfsHash = await uploadToPinata(
  //     e.target.files[0],
  //     `${window.localStorage.getItem("username")} Document 1`
  //   );
  //   // console.log(ipfsHash);
  //   if (ipfsHash) {
  //     console.log(
  //       "Document 1 uploaded to IPFS:",
  //       `<span class="math-inline">\{pinataGateway\}</span>{ipfsHash}`
  //     );
  //   }
  // };

  // const handleDocument2Change = async (e) => {
  //   setDocument2(e.target.files[0]);
  //   const ipfsHash = await uploadToPinata(
  //     e.target.files[0],
  //     `${window.localStorage.getItem("username")} Document 2`
  //   );
  //   if (ipfsHash) {
  //     console.log(
  //       "Document 2 uploaded to IPFS:",
  //       `<span class="math-inline">\{pinataGateway\}</span>{ipfsHash}`
  //     );
  //   }
  // };

  // const handleImageChange = async (e) => {
  //   setImage(e.target.files[0]);
  //   const ipfsHash = await uploadToPinata(
  //     e.target.files[0],
  //     `${window.localStorage.getItem("username")} Image`
  //   );
  //   if (ipfsHash) {
  //     console.log(
  //       "Image uploaded to IPFS:",
  //       `<span class="math-inline">\{pinataGateway\}</span>{ipfsHash}`
  //     );
  //   }
  // };

  const handleSubmit = async () => {
    setIsRegistering(true);
    try {
      const web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:7545");
      const registrationContract = new web3.eth.Contract(
        contractABI,
        contractAddress
      );

      const accounts = await web3.eth.getAccounts();

      // handleDocument1Change
      const document1Hash = await uploadToPinata(
        document1,
        `${window.localStorage.getItem("username")} Document 1`
      );
      console.log("Document 1 uploaded");
      console.log(document2);
      const document2Hash = await uploadToPinata(
        document2,
        `${window.localStorage.getItem("username")} Document 2`
      );
      console.log("Document 2 uploaded");

      const imageHash = await uploadToPinata(
        image,
        `${window.localStorage.getItem("username")} Image`
      );
      console.log("image uploaded");

      if (!document1Hash || !document2Hash || !imageHash) {
        console.error("Failed to upload all files to Pinata");
        return;
      }

      const document1Url = `${pinataGateway}${document1Hash}`;
      const document2Url = `${pinataGateway}${document2Hash}`;
      const imageUrl = `${pinataGateway}${imageHash}`;

      console.log(document1Url);
      console.log(document2Url);
      console.log(imageUrl);
      await registrationContract.methods
        .createRegistrationData(
          username,
          vehicleNo,
          vehicleType,
          vehicleModel,
          vehicleCompany,
          vehicleColor,
          document1Url,
          document2Url,
          imageUrl
        )
        .send({ from: accounts[0] });

      // Reset form fields after successful registration
      setUsername("");
      setVehicleNo("");
      setVehicleType("");
      setVehicleModel("");
      setVehicleCompany("");
      setVehicleColor("");
      setDocument1(null);
      setDocument2(null);
      setImage(null);

      console.log("Data registered successfully!");
      window.location.href = "/";
    } catch (error) {
      console.error("Error registering data:", error);
    }
    setIsRegistering(false);
  };

  return (
    <div>
      <Navbar />
      <h1 style={{ marginTop: "10px" }}>Registration Form</h1>
      <table style={{ width: "auto", marginLeft: "35%" }}>
        <tbody>
          <tr>
            <td>Vehicle Number:</td>
            <td>
              <input
                type="text"
                value={vehicleNo}
                onChange={(e) => setVehicleNo(e.target.value)}
                required
              />
            </td>
          </tr>
          <tr>
            <td>Vehicle Type:</td>
            <td>
              <input
                type="text"
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                required
              />
            </td>
          </tr>
          <tr>
            <td>Vehicle Model:</td>
            <td>
              <input
                type="text"
                value={vehicleModel}
                onChange={(e) => setVehicleModel(e.target.value)}
                required
              />
            </td>
          </tr>
          <tr>
            <td>Vehicle Company:</td>
            <td>
              <input
                type="text"
                value={vehicleCompany}
                onChange={(e) => setVehicleCompany(e.target.value)}
                required
              />
            </td>
          </tr>
          <tr>
            <td>Vehicle Color:</td>
            <td>
              <input
                type="text"
                value={vehicleColor}
                onChange={(e) => setVehicleColor(e.target.value)}
                required
              />
            </td>
          </tr>
          <tr>
            <td>Document 1:</td>
            <td>
              <input
                type="file"
                // onChange={handleDocument1Change}
                onChange={(e) => setDocument1(e.target.files[0])}
                accept=".pdf,.doc,.docx"
                required
              />
              {document1Preview && (
                <button onClick={() => window.open(document1Preview)}>
                  Preview
                </button>
              )}
            </td>
          </tr>
          <tr>
            <td>Document 2:</td>
            <td>
              <input
                type="file"
                // onChange={handleDocument2Change}
                onChange={(e) => setDocument2(e.target.files[0])}
                accept=".pdf,.doc,.docx"
                required
              />
              {document2Preview && (
                <button onClick={() => window.open(document2Preview)}>
                  Preview
                </button>
              )}
            </td>
          </tr>
          <tr>
            <td>Image:</td>
            <td>
              <input
                type="file"
                // onChange={handleImageChange}
                onChange={(e) => setImage(e.target.files[0])}
                accept="image/*"
                required
              />
            </td>
          </tr>
        </tbody>
      </table>
      <button
        onClick={handleSubmit}
        className="registerbutton"
        disabled={isRegistering}
        style={{ marginLeft: "47%" }}
      >
        {isRegistering ? "Registering" : "Register"}
      </button>
    </div>
  );
};

export default VehicleRegistration;
