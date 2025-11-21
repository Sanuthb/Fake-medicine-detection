const express = require("express");
const bodyParser = require("body-parser");
const { Web3 } = require("web3");
const cors = require("cors");

// Contract artifact
const contractArtifact = require("../build/contracts/Medicine.json");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Connect to Ganache
const web3 = new Web3("http://127.0.0.1:7545");

// Contract instance
const contractABI = contractArtifact.abi;
const contractAddress = contractArtifact.networks["5777"].address;
const medicineContract = new web3.eth.Contract(contractABI, contractAddress);

// Default Ganache account
let defaultAccount;
web3.eth.getAccounts().then(accounts => {
  defaultAccount = accounts[0];
  console.log("Using default account:", defaultAccount);
});

// Helpers
const toBytes32 = str => web3.utils.padRight(web3.utils.asciiToHex(str), 64);
const fromBytes32 = hex => web3.utils.hexToAscii(hex).replace(/\u0000/g, "");
const serializeBigInt = obj => {
  if (Array.isArray(obj)) return obj.map(serializeBigInt);
  if (typeof obj === "bigint") return obj.toString();
  if (typeof obj === "object" && obj !== null) {
    const res = {};
    for (let k in obj) res[k] = serializeBigInt(obj[k]);
    return res;
  }
  return obj;
};

// ===== ROUTES (ALL FUNCTIONS SPLIT TO AVOID STACK TOO DEEP ERRORS) ===== //

// ⭐ NEW TEMPORARY ROUTE: Initialize Admin (Must be called ONCE)
app.post("/initializeAdmin", async (req, res) => {
    try {
        const { adminAddress } = req.body;
        if (!adminAddress) {
            return res.status(400).json({ error: "Missing adminAddress in request body." });
        }
        
        // Use defaultAccount to send the transaction
        const receipt = await medicineContract.methods
            .initializeAdmin(adminAddress)
            .send({ from: defaultAccount, gas: 3000000 });
            
        res.json({ message: "Admin initialized successfully!", admin: adminAddress, txHash: receipt.transactionHash });
    } catch (err) {
        console.error("Error initializing admin:", err.message);
        res.status(500).json({ error: "Failed to initialize admin. Ensure it's only called once per deployment." });
    }
});


// 1️⃣ Add Pharmacy
app.post("/addPharmacy", async (req, res) => {
  try {
    const { manufacturerID, pharmacyName, pharmacyLicense, pharmacyCode, pharmacyPhone, pharmacistName, pharmacyAddress } = req.body;
    const receipt = await medicineContract.methods
      .addPharmacy(
        toBytes32(manufacturerID),
        toBytes32(pharmacyName),
        toBytes32(pharmacyLicense),
        toBytes32(pharmacyCode),
        pharmacyPhone,
        toBytes32(pharmacistName),
        toBytes32(pharmacyAddress)
      )
      .send({ from: defaultAccount, gas: 3000000 });
    res.json({ message: "Pharmacy added", txHash: receipt.transactionHash });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 2️⃣ Add Medicine (UPDATED: 8 parameters)
app.post("/addMedicine", async (req, res) => {
  try {
    const { manufacturerID, medicineName, medicineBatch, medicineBrand, medicinePrice,manufactureDate, expiryDate, composition } = req.body;
    const receipt = await medicineContract.methods
      .addMedicine(
        toBytes32(manufacturerID),
        toBytes32(medicineName),
        toBytes32(medicineBatch),
        toBytes32(medicineBrand),
        medicinePrice,
        toBytes32(manufactureDate), // New field
        toBytes32(expiryDate),
        toBytes32(composition)
      )
      .send({ from: defaultAccount, gas: 3000000 });
    res.json({ message: "Medicine added", txHash: receipt.transactionHash });
  } catch (err) { 
        console.error("Error in /addMedicine:", err.message);
        res.status(500).json({ error: err.message }); 
    }
});

// Purchase History
app.get("/getPurchaseHistory/:patientCode", async (req, res) => {
  try {
    const { patientCode } = req.params;
    const patientCodeBytes = toBytes32(patientCode);
    const result = await medicineContract.methods.getPurchaseHistory(patientCodeBytes).call();
    const response = result[0].map((_, i) => ({
      medicineBatch: fromBytes32(result[0][i]),
      pharmacyCode: fromBytes32(result[1][i]),
      manufacturerCode: fromBytes32(result[2][i]),
    }));
    res.json(response);
  } catch (err) {
    console.error("Error in getPurchaseHistory:", err);
    res.status(500).json({ error: err.message });
  }
});

// 3️⃣ View Medicines (UPDATED: Calls split functions and combines results)
app.get("/viewMedicineItems", async (req, res) => {
  try {
    // 1. Fetch Basic Info
    const basicData = await medicineContract.methods.viewMedicineItemsBasic().call();
    // 2. Fetch Detailed Info
    const detailData = await medicineContract.methods.viewMedicineItemsDetails().call();

    const result = basicData[0].map((_, i) => serializeBigInt({
      medicineId: basicData[0][i],
      medicineBatch: fromBytes32(basicData[1][i]),
      medicineName: fromBytes32(basicData[2][i]),
      medicineBrand: fromBytes32(basicData[3][i]),
      medicinePrice: basicData[4][i],
      // Map detailed data from the second call
      medicineStatus: fromBytes32(detailData[0][i]),
      manufactureDate: fromBytes32(detailData[1][i]),
      expiryDate: fromBytes32(detailData[2][i]),
      composition: fromBytes32(detailData[3][i])
    }));
    res.json(result);
  } catch (err) { 
      console.error("Error in /viewMedicineItems:", err.message);
      res.status(500).json({ error: "Failed to fetch medicine items. Please ensure you have recompiled and migrated the latest contract." }); 
  }
});

// 4️⃣ Manufacturer Sell Medicine
app.post("/manufacturerSellMedicine", async (req, res) => {
  try {
    const { medicineBatch, pharmacyCode } = req.body;
    const receipt = await medicineContract.methods
      .manufacturerSellMedicine(toBytes32(medicineBatch), toBytes32(pharmacyCode))
      .send({ from: defaultAccount, gas: 3000000 });
    res.json({ message: "Medicine sent to pharmacy", txHash: receipt.transactionHash });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 5️⃣ Pharmacy Sell Medicine
app.post("/pharmacySellMedicine", async (req, res) => {
  try {
    const { medicineBatch, patientCode } = req.body;
    const receipt = await medicineContract.methods
      .pharmacySellMedicine(toBytes32(medicineBatch), toBytes32(patientCode))
      .send({ from: defaultAccount, gas: 3000000 });
    res.json({ message: "Medicine sold to patient", txHash: receipt.transactionHash });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 6️⃣ Verify Medicine (UPDATED: Calls split functions and combines results)
app.post("/verifyMedicine", async (req, res) => {
  try {
    const { medicineBatch, patientCode } = req.body;
    if (!medicineBatch || !patientCode) {
      return res.status(400).json({ error: "Missing medicineBatch or patientCode" });
    }
    const medicineBatchBytes = toBytes32(medicineBatch);
    const patientCodeBytes = toBytes32(patientCode);

    // 1. Get Status and Codes (verifyMedicineStatus)
    const statusData = await medicineContract.methods
      .verifyMedicineStatus(medicineBatchBytes, patientCodeBytes)
      .call();
    
    // 2. Get Details (getMedicineDetailsByBatch)
    const detailsData = await medicineContract.methods
        .getMedicineDetailsByBatch(medicineBatchBytes)
        .call();

    const response = {
        // Status and Codes (from statusData)
        isVerified: statusData[0], 
        manufacturerCode: fromBytes32(statusData[1]),
        pharmacyCode: fromBytes32(statusData[2]),
        
        // Medicine Details (from detailsData)
        medicineName: fromBytes32(detailsData[0]),
        medicineBrand: fromBytes32(detailsData[1]),
        medicinePrice: serializeBigInt(detailsData[2]), 
        medicineStatus: fromBytes32(detailsData[3]),
        manufactureDate: fromBytes32(detailsData[4]),
        expiryDate: fromBytes32(detailsData[5]),
        composition: fromBytes32(detailsData[6]),
    };
    
    res.json(response);
  } catch (err) {
    console.error("Error in /verifyMedicine:", err);
    res.status(500).json({ error: "Verification failed: " + err.message });
  }
});

// 7️⃣ View Pharmacies (UPDATED: Calls split functions and combines results)
app.get("/viewPharmacies", async (req, res) => {
  try {
    // 1. Fetch Basic Info
    const basicData = await medicineContract.methods.viewPharmaciesBasicInfo().call();
    // 2. Fetch Contact Info
    const contactData = await medicineContract.methods.viewPharmaciesContactInfo().call();

    const result = basicData[0].map((_, i) => ({
      pharmacyId: basicData[0][i].toString(),
      pharmacyName: fromBytes32(basicData[1][i]),
      pharmacyLicense: fromBytes32(basicData[2][i]),
      pharmacyCode: fromBytes32(basicData[3][i]),
      
      pharmacyPhone: contactData[0][i].toString(),
      pharmacistName: fromBytes32(contactData[1][i]),
      pharmacyAddress: fromBytes32(contactData[2][i]),
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch pharmacies: " + err.message });
  }
});

// ✅ NEW ROUTE: Filters pharmacies by manufacturerCode
app.get("/queryPharmaciesList/:manufacturerCode", async (req, res) => {
  try {
    const { manufacturerCode } = req.params;
    // 1. Fetch Basic Info
    const basicData = await medicineContract.methods
      .queryPharmaciesBasicInfoList(toBytes32(manufacturerCode))
      .call();
    // 2. Fetch Contact Info
    const contactData = await medicineContract.methods
      .queryPharmaciesContactInfoList(toBytes32(manufacturerCode))
      .call();

    const result = basicData[0].map((_, i) => ({
      pharmacyId: basicData[0][i].toString(),
      pharmacyName: fromBytes32(basicData[1][i]),
      pharmacyLicense: fromBytes32(basicData[2][i]),
      pharmacyCode: fromBytes32(basicData[3][i]),
      
      pharmacyPhone: contactData[0][i].toString(),
      pharmacistName: fromBytes32(contactData[1][i]),
      pharmacyAddress: fromBytes32(contactData[2][i]),
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to query manufacturer pharmacies: " + err.message });
  }
});

// ✅ NEW ROUTE: View Medicines by Pharmacy
app.get("/queryMedicines/pharmacy/:pharmacyCode", async (req, res) => {
  try {
    const { pharmacyCode } = req.params;
    const basicData = await medicineContract.methods
      .queryMedicinesBasicInfo(toBytes32(pharmacyCode))
      .call();
    const detailData = await medicineContract.methods
      .queryMedicinesDetailInfo(toBytes32(pharmacyCode))
      .call();
    
    const result = basicData[0].map((_, i) => ({
      medicineId: basicData[0][i].toString(),
      medicineBatch: fromBytes32(basicData[1][i]),
      medicineName: fromBytes32(basicData[2][i]),
      medicineBrand: fromBytes32(basicData[3][i]),
      medicinePrice: basicData[4][i].toString(),
      
      medicineStatus: fromBytes32(detailData[0][i]),
      manufactureDate: fromBytes32(detailData[1][i]),
      expiryDate: fromBytes32(detailData[2][i]),
      composition: fromBytes32(detailData[3][i]),
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to query pharmacy medicines: " + err.message });
  }
});

// ===== NEW COMPLAINT ROUTES ===== //

// Submit Complaint (Patient)
app.post("/submitComplaint", async (req, res) => {
    try {
        const { medicineBatch, patientCode, reason } = req.body;
        const receipt = await medicineContract.methods
            .submitComplaint(toBytes32(medicineBatch), toBytes32(patientCode), toBytes32(reason))
            .send({ from: defaultAccount, gas: 3000000 });
        res.json({ message: "Complaint submitted", txHash: receipt.transactionHash });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// View Complaints (Admin)
app.get("/viewComplaints", async (req, res) => {
    try {
        // This transaction must be sent by the initialized admin account
        const data = await medicineContract.methods.viewComplaints().call({ from: defaultAccount }); 
        
        const result = data[0].map((_, i) => ({
            id: data[0][i].toString(),
            medicineBatch: fromBytes32(data[1][i]),
            patientCode: fromBytes32(data[2][i]),
            reason: fromBytes32(data[3][i]),
        }));

        res.json(result);
    } catch (err) {
        console.error("Error in /viewComplaints:", err.message);
        res.status(500).json({ error: "Failed to fetch complaints. Solution: Use the /initializeAdmin route to set the admin address first." });
    }
});


// ===== START SERVER ===== //
app.listen(5000, () => console.log("🚀 API running on http://localhost:5000"));