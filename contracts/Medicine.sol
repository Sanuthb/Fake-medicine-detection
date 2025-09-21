pragma solidity ^0.8.12;

contract Medicine {

    uint256 pharmacyCount;
    uint256 medicineCount;

    struct pharmacy{
        uint256 pharmacyId;
        bytes32 pharmacyName;
        bytes32 pharmacyLicense;
        bytes32 pharmacyCode;
        uint256 pharmacyPhone;
        bytes32 pharmacistName;
        bytes32 pharmacyAddress;
    }
    mapping(uint=>pharmacy) public pharmacies;

    struct medicineItem{
        uint256 medicineId;
        bytes32 medicineBatch;
        bytes32 medicineName;
        bytes32 medicineBrand;
        uint256 medicinePrice;
        bytes32 medicineStatus;
        bytes32 expiryDate;
        bytes32 composition;
    }

    mapping(uint256=>medicineItem) public medicineItems;
    mapping(bytes32=>uint256) public medicineMap;
    mapping(bytes32=>bytes32) public medicinesManufactured;
    mapping(bytes32=>bytes32) public medicinesForSale;
    mapping(bytes32=>bytes32) public medicinesSold;
    mapping(bytes32=>bytes32[]) public medicinesWithPharmacy;
    mapping(bytes32=>bytes32[]) public medicinesWithPatient;
    mapping(bytes32=>bytes32[]) public pharmaciesWithManufacturer;


    //PHARMACY SECTION

    function addPharmacy(bytes32 _manufacturerId, bytes32 _pharmacyName, bytes32 _pharmacyLicense, bytes32 _pharmacyCode,
    uint256 _pharmacyPhone, bytes32 _pharmacistName, bytes32 _pharmacyAddress) public{
        pharmacies[pharmacyCount] = pharmacy(pharmacyCount, _pharmacyName, _pharmacyLicense, _pharmacyCode,
        _pharmacyPhone, _pharmacistName, _pharmacyAddress);
        pharmacyCount++;

        pharmaciesWithManufacturer[_manufacturerId].push(_pharmacyCode);
    }


    function viewPharmacies () public view returns(uint256[] memory, bytes32[] memory, bytes32[] memory, bytes32[] memory, uint256[] memory, bytes32[] memory, bytes32[] memory) {
        uint256[] memory ids = new uint256[](pharmacyCount);
        bytes32[] memory pnames = new bytes32[](pharmacyCount);
        bytes32[] memory plicense = new bytes32[](pharmacyCount);
        bytes32[] memory pcodes = new bytes32[](pharmacyCount);
        uint256[] memory pphones = new uint256[](pharmacyCount);
        bytes32[] memory pharmacists = new bytes32[](pharmacyCount);
        bytes32[] memory paddress = new bytes32[](pharmacyCount);
        
        for(uint i=0; i<pharmacyCount; i++){
            ids[i] = pharmacies[i].pharmacyId;
            pnames[i] = pharmacies[i].pharmacyName;
            plicense[i] = pharmacies[i].pharmacyLicense;
            pcodes[i] = pharmacies[i].pharmacyCode;
            pphones[i] = pharmacies[i].pharmacyPhone;
            pharmacists[i] = pharmacies[i].pharmacistName;
            paddress[i] = pharmacies[i].pharmacyAddress;
        }
        return(ids, pnames, plicense, pcodes, pphones, pharmacists, paddress);
    }

    //MEDICINE SECTION

    function addMedicine(bytes32 _manufactuerID, bytes32 _medicineName, bytes32 _medicineBatch, bytes32 _medicineBrand,
    uint256 _medicinePrice, bytes32 _expiryDate, bytes32 _composition) public{
        medicineItems[medicineCount] = medicineItem(medicineCount, _medicineBatch, _medicineName, _medicineBrand,
        _medicinePrice, "Available", _expiryDate, _composition);
        medicineMap[_medicineBatch] = medicineCount;
        medicineCount++;
        medicinesManufactured[_medicineBatch] = _manufactuerID;
    }


    function viewMedicineItems () public view returns(uint256[] memory, bytes32[] memory, bytes32[] memory, bytes32[] memory, uint256[] memory, bytes32[] memory, bytes32[] memory, bytes32[] memory) {
        uint256[] memory mids = new uint256[](medicineCount);
        bytes32[] memory mBatches = new bytes32[](medicineCount);
        bytes32[] memory mnames = new bytes32[](medicineCount);
        bytes32[] memory mbrands = new bytes32[](medicineCount);
        uint256[] memory mprices = new uint256[](medicineCount);
        bytes32[] memory mstatus = new bytes32[](medicineCount);
        bytes32[] memory mexpiry = new bytes32[](medicineCount);
        bytes32[] memory mcomposition = new bytes32[](medicineCount);
        
        for(uint i=0; i<medicineCount; i++){
            mids[i] = medicineItems[i].medicineId;
            mBatches[i] = medicineItems[i].medicineBatch;
            mnames[i] = medicineItems[i].medicineName;
            mbrands[i] = medicineItems[i].medicineBrand;
            mprices[i] = medicineItems[i].medicinePrice;
            mstatus[i] = medicineItems[i].medicineStatus;
            mexpiry[i] = medicineItems[i].expiryDate;
            mcomposition[i] = medicineItems[i].composition;
        }
        return(mids, mBatches, mnames, mbrands, mprices, mstatus, mexpiry, mcomposition);
    }

    //SELL Medicine

    function manufacturerSellMedicine(bytes32 _medicineBatch, bytes32 _pharmacyCode) public{
        medicinesWithPharmacy[_pharmacyCode].push(_medicineBatch);
        medicinesForSale[_medicineBatch] = _pharmacyCode;
    }

    function pharmacySellMedicine(bytes32 _medicineBatch, bytes32 _patientCode) public{   
        bytes32 mStatus;
        uint256 i;
        uint256 j=0;

        if(medicineCount>0) {
            for(i=0;i<medicineCount;i++) {
                if(medicineItems[i].medicineBatch == _medicineBatch) {
                    j=i;
                }
            }
        }

        mStatus = medicineItems[j].medicineStatus;
        if(mStatus == "Available") {
            medicineItems[j].medicineStatus = "Sold";
            medicinesWithPatient[_patientCode].push(_medicineBatch);
            medicinesSold[_medicineBatch] = _patientCode;
        }
    }

    // Split the query function into two parts to avoid stack too deep error
    function queryMedicinesBasicInfo(bytes32 _pharmacyCode) public view returns(uint256[] memory, bytes32[] memory, bytes32[] memory, bytes32[] memory, uint256[] memory){
        bytes32[] memory medicineBatches = medicinesWithPharmacy[_pharmacyCode];
        uint256 k=0;

        uint256[] memory mids = new uint256[](medicineCount);
        bytes32[] memory mBatches = new bytes32[](medicineCount);
        bytes32[] memory mnames = new bytes32[](medicineCount);
        bytes32[] memory mbrands = new bytes32[](medicineCount);
        uint256[] memory mprices = new uint256[](medicineCount);

        for(uint i=0; i<medicineCount; i++){
            for(uint j=0; j<medicineBatches.length; j++){
                if(medicineItems[i].medicineBatch==medicineBatches[j]){
                    mids[k] = medicineItems[i].medicineId;
                    mBatches[k] = medicineItems[i].medicineBatch;
                    mnames[k] = medicineItems[i].medicineName;
                    mbrands[k] = medicineItems[i].medicineBrand;
                    mprices[k] = medicineItems[i].medicinePrice;
                    k++;
                }
            }
        }
        return(mids, mBatches, mnames, mbrands, mprices);
    }

    function queryMedicinesDetailInfo(bytes32 _pharmacyCode) public view returns(bytes32[] memory, bytes32[] memory, bytes32[] memory){
        bytes32[] memory medicineBatches = medicinesWithPharmacy[_pharmacyCode];
        uint256 k=0;

        bytes32[] memory mstatus = new bytes32[](medicineCount);
        bytes32[] memory mexpiry = new bytes32[](medicineCount);
        bytes32[] memory mcomposition = new bytes32[](medicineCount);

        for(uint i=0; i<medicineCount; i++){
            for(uint j=0; j<medicineBatches.length; j++){
                if(medicineItems[i].medicineBatch==medicineBatches[j]){
                    mstatus[k] = medicineItems[i].medicineStatus;
                    mexpiry[k] = medicineItems[i].expiryDate;
                    mcomposition[k] = medicineItems[i].composition;
                    k++;
                }
            }
        }
        return(mstatus, mexpiry, mcomposition);
    }

    function queryPharmaciesList (bytes32 _manufacturerCode) public view returns(uint256[] memory, bytes32[] memory, bytes32[] memory, bytes32[] memory, uint256[] memory, bytes32[] memory, bytes32[] memory) {
        bytes32[] memory pharmacyCodes = pharmaciesWithManufacturer[_manufacturerCode];
        uint256 k=0;
        uint256[] memory ids = new uint256[](pharmacyCount);
        bytes32[] memory pnames = new bytes32[](pharmacyCount);
        bytes32[] memory plicense = new bytes32[](pharmacyCount);
        bytes32[] memory pcodes = new bytes32[](pharmacyCount);
        uint256[] memory pphones = new uint256[](pharmacyCount);
        bytes32[] memory pharmacists = new bytes32[](pharmacyCount);
        bytes32[] memory paddress = new bytes32[](pharmacyCount);
        
        for(uint i=0; i<pharmacyCount; i++){
            for(uint j=0; j<pharmacyCodes.length; j++){
                if(pharmacies[i].pharmacyCode==pharmacyCodes[j]){
                    ids[k] = pharmacies[i].pharmacyId;
                    pnames[k] = pharmacies[i].pharmacyName;
                    plicense[k] = pharmacies[i].pharmacyLicense;
                    pcodes[k] = pharmacies[i].pharmacyCode;
                    pphones[k] = pharmacies[i].pharmacyPhone;
                    pharmacists[k] = pharmacies[i].pharmacistName;
                    paddress[k] = pharmacies[i].pharmacyAddress;
                    k++;
                    break;
               }
            }
        }

        return(ids, pnames, plicense, pcodes, pphones, pharmacists, paddress);
    }

    function getPurchaseHistory(bytes32 _patientCode) public view returns (bytes32[] memory, bytes32[] memory, bytes32[] memory){
        bytes32[] memory medicineBatches = medicinesWithPatient[_patientCode];
        bytes32[] memory pharmacyCodes = new bytes32[](medicineBatches.length);
        bytes32[] memory manufacturerCodes = new bytes32[](medicineBatches.length);
        for(uint i=0; i<medicineBatches.length; i++){
            pharmacyCodes[i] = medicinesForSale[medicineBatches[i]];
            manufacturerCodes[i] = medicinesManufactured[medicineBatches[i]];
        }
        return (medicineBatches, pharmacyCodes, manufacturerCodes);
    }

    //Verify

    function verifyMedicine(bytes32 _medicineBatch, bytes32 _patientCode) public view returns(bool){
        if(medicinesSold[_medicineBatch] == _patientCode){
            return true;
        }
        else{
            return false;
        }
    }
}