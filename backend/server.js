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

// ===== ROUTES ===== //

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

// 2️⃣ Add Medicine
app.post("/addMedicine", async (req, res) => {
  try {
    const { manufacturerID, medicineName, medicineBatch, medicineBrand, medicinePrice, expiryDate, composition } = req.body;
    const receipt = await medicineContract.methods
      .addMedicine(
        toBytes32(manufacturerID),
        toBytes32(medicineName),
        toBytes32(medicineBatch),
        toBytes32(medicineBrand),
        medicinePrice,
        toBytes32(expiryDate),
        toBytes32(composition)
      )
      .send({ from: defaultAccount, gas: 3000000 });
    res.json({ message: "Medicine added", txHash: receipt.transactionHash });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get("/getPurchaseHistory/:patientCode", async (req, res) => {
  try {
    const { patientCode } = req.params;
    const patientCodeBytes = web3.utils.rightPad(web3.utils.asciiToHex(patientCode), 64);
    const result = await medicineContract.methods.getPurchaseHistory(patientCodeBytes).call();
    const response = result[0].map((_, i) => ({
      medicineBatch: web3.utils.hexToAscii(result[0][i]).replace(/\u0000/g, ""),
      pharmacyCode: web3.utils.hexToAscii(result[1][i]).replace(/\u0000/g, ""),
      manufacturerCode: web3.utils.hexToAscii(result[2][i]).replace(/\u0000/g, ""),
    }));
    res.json(response);
  } catch (err) {
    console.error("Error in getPurchaseHistory:", err);
    res.status(500).json({ error: err.message });
  }
});

// 3️⃣ View Medicines
app.get("/viewMedicineItems", async (req, res) => {
  try {
    const data = await medicineContract.methods.viewMedicineItems().call();
    const result = data[0].map((_, i) => serializeBigInt({
      medicineId: data[0][i],
      medicineBatch: fromBytes32(data[1][i]),
      medicineName: fromBytes32(data[2][i]),
      medicineBrand: fromBytes32(data[3][i]),
      medicinePrice: data[4][i],
      medicineStatus: fromBytes32(data[5][i]),
      expiryDate: fromBytes32(data[6][i]),
      composition: fromBytes32(data[7][i])
    }));
    res.json(result);
  } catch (err) { res.status(500).json({ error: err.message }); }
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

// 6️⃣ Verify Medicine
app.post("/verifyMedicine", async (req, res) => {
  try {
    const { medicineBatch, patientCode } = req.body;
    if (!medicineBatch || !patientCode) {
      return res.status(400).json({ error: "Missing medicineBatch or patientCode" });
    }
    const medicineBatchBytes = toBytes32(medicineBatch);
    const patientCodeBytes = toBytes32(patientCode);
    const isValid = await medicineContract.methods
      .verifyMedicine(medicineBatchBytes, patientCodeBytes)
      .call();
    res.json({ valid: isValid });
  } catch (err) {
    console.error("Error in /verifyMedicine:", err);
    res.status(500).json({ error: err.message });
  }
});

// 7️⃣ View Pharmacies
app.get("/viewPharmacies", async (req, res) => {
  try {
    const data = await medicineContract.methods.viewPharmacies().call();
    const result = data[0].map((_, i) => ({
      pharmacyId: data[0][i].toString(),
      pharmacyName: fromBytes32(data[1][i]),
      pharmacyLicense: fromBytes32(data[2][i]),
      pharmacyCode: fromBytes32(data[3][i]),
      pharmacyPhone: data[4][i].toString(),
      pharmacistName: fromBytes32(data[5][i]),
      pharmacyAddress: fromBytes32(data[6][i]),
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ NEW ROUTE: Filters pharmacies by manufacturerCode
app.get("/queryPharmaciesList/:manufacturerCode", async (req, res) => {
  try {
    const { manufacturerCode } = req.params;
    const data = await medicineContract.methods
      .queryPharmaciesList(toBytes32(manufacturerCode))
      .call();

    const result = data[0].map((_, i) => ({
      pharmacyId: data[0][i].toString(),
      pharmacyName: fromBytes32(data[1][i]),
      pharmacyLicense: fromBytes32(data[2][i]),
      pharmacyCode: fromBytes32(data[3][i]),
      pharmacyPhone: data[4][i].toString(),
      pharmacistName: fromBytes32(data[5][i]),
      pharmacyAddress: fromBytes32(data[6][i]),
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
    
    // Combine the results
    const result = basicData[0].map((_, i) => ({
      medicineId: basicData[0][i].toString(),
      medicineBatch: fromBytes32(basicData[1][i]),
      medicineName: fromBytes32(basicData[2][i]),
      medicineBrand: fromBytes32(basicData[3][i]),
      medicinePrice: basicData[4][i].toString(),
      medicineStatus: fromBytes32(detailData[0][i]),
      expiryDate: fromBytes32(detailData[1][i]),
      composition: fromBytes32(detailData[2][i]),
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/queryMedicinesDetailInfo/:pharmacyCode", async (req, res) => {
  try {
    const { pharmacyCode } = req.params;
    const data = await medicineContract.methods
      .queryMedicinesDetailInfo(toBytes32(pharmacyCode))
      .call();
    
    // The smart contract returns: mstatus, mexpiry, mcomposition arrays
    const result = data[0].map((_, i) => ({
      medicineStatus: fromBytes32(data[0][i]),
      expiryDate: fromBytes32(data[1][i]),
      composition: fromBytes32(data[2][i]),
    }));

    res.json(result);
  } catch (err) {
    console.error("Error in queryMedicinesDetailInfo:", err);
    res.status(500).json({ error: err.message });
  }
});

// ===== START SERVER ===== //
app.listen(5000, () => console.log("🚀 API running on http://localhost:5000"));