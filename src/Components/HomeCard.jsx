import React, { useEffect, useState } from "react";
import "./HomeCard.css";
import Web3 from "web3";
import { contractABI, contractAddress } from "../config";

const HomeCard = (props) => {
  const handleApprove = async () => {
    try {
      const web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:7545");
      const registrationContract = new web3.eth.Contract(
        contractABI,
        contractAddress
      );
      const account = (await web3.eth.getAccounts())[0];
      const vehicleId = props.index + 1;
      await registrationContract.methods
        .approveMarketplace(vehicleId)
        .send({ from: account });
      window.location.reload();
    } catch (error) {
      console.error("Error approving marketplace:", error);
    }
  };
  console.log(props.user.imageHash);
  return (
    <div className={`homecard ${props.user.approved} `}>
      <h2 style={{ marginBottom: "18px" }}>
        {props.user.approved ? "Approved" : "Not Approved"}
      </h2>
      <img src={props.user.imageHash} alt="vehicle" />
      <h3 style={{ margin: "3px" }}>{props.user.vehicleNo}</h3>
      <h3 style={{ margin: "3px" }}>{props.user.vehicleType}</h3>
      <h3 style={{ margin: "3px" }}>{props.user.vehicleModel}</h3>
      <h3 style={{ margin: "3px" }}>{props.user.vehicleCompany}</h3>
      <h3 style={{ margin: "3px" }}>{props.user.vehicleColor}</h3>
      <a
        style={{ margin: "3px" }}
        href={props.user.documentHash1}
        target="_blank"
        rel="noopener noreferrer"
      >
        Document 1 Download
      </a>
      <a
        style={{ margin: "3px" }}
        href={props.user.documentHash2}
        target="_blank"
        rel="noopener noreferrer"
      >
        Document 2 Download
      </a>
      {/* <button onClick={()=> window.location.href = "/transfer"} >Transfer Ownership</button> */}
    </div>
  );
};

export default HomeCard;
