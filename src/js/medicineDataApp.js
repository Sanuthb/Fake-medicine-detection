App = {
    web3Provider: null,
    contracts: {},

    init: async function() {
        return await App.initWeb3();
    },

    initWeb3: function() {
        if(window.web3) {
            App.web3Provider=window.web3.currentProvider;
        } else {
            App.web3Provider=new Web3.proviers.HttpProvider('http://localhost:7545');
        }

        web3 = new Web3(App.web3Provider);
        return App.initContract();
    },

    initContract: function() {

        $.getJSON('medicine.json',function(data){

            var medicineArtifact=data;
            App.contracts.medicine=TruffleContract(medicineArtifact);
            App.contracts.medicine.setProvider(App.web3Provider);
        });

        return App.bindEvents();
    },

    bindEvents: function() {

        $(document).on('click','.btn-register',App.getData);
    },

    getData:function(event) {
        event.preventDefault();
        var pharmacyCode = document.getElementById('pharmacyCode').value;

        var medicineInstance;
        //window.ethereum.enable();
        web3.eth.getAccounts(function(error,accounts){

            if(error) {
                console.log(error);
            }

            var account=accounts[0];

            App.contracts.medicine.deployed().then(function(instance){
                medicineInstance=instance;
                
                // First call to get basic info
                return medicineInstance.queryMedicinesBasicInfo(web3.fromAscii(pharmacyCode),{from:account});

            }).then(function(basicResult){
                
                // Second call to get detail info
                return medicineInstance.queryMedicinesDetailInfo(web3.fromAscii(pharmacyCode),{from:account})
                .then(function(detailResult) {
                    
                    var medicineIds=[];
                    var medicineBatches=[];
                    var medicineNames=[];
                    var medicineBrands=[];
                    var medicinePrices=[];
                    var medicineStatus=[];
                    var medicineExpiry=[];
                    var medicineComposition=[];
                    
                    // Process basic info
                    for(var k=0;k<basicResult[0].length;k++){
                        medicineIds[k]=basicResult[0][k];
                    }

                    for(var k=0;k<basicResult[1].length;k++){
                        medicineBatches[k]=web3.toAscii(basicResult[1][k]);
                    }

                    for(var k=0;k<basicResult[2].length;k++){
                        medicineNames[k]=web3.toAscii(basicResult[2][k]);
                    }

                    for(var k=0;k<basicResult[3].length;k++){
                        medicineBrands[k]=web3.toAscii(basicResult[3][k]);
                    }

                    for(var k=0;k<basicResult[4].length;k++){
                        medicinePrices[k]=basicResult[4][k];
                    }

                    // Process detail info
                    for(var k=0;k<detailResult[0].length;k++){
                        medicineStatus[k]=web3.toAscii(detailResult[0][k]);
                    }

                    for(var k=0;k<detailResult[1].length;k++){
                        medicineExpiry[k]=web3.toAscii(detailResult[1][k]);
                    }

                    for(var k=0;k<detailResult[2].length;k++){
                        medicineComposition[k]=web3.toAscii(detailResult[2][k]);
                    }

                    var t= "";
                    document.getElementById('logdata').innerHTML = t;
                    for(var i=0;i<basicResult[0].length;i++) {
                        var temptr = "<td>"+medicinePrices[i]+"</td>";
                        if(temptr === "<td>0</td>"){
                            break;
                        }

                        var tr="<tr>";
                        tr+="<td>"+medicineIds[i]+"</td>";
                        tr+="<td>"+medicineBatches[i]+"</td>";
                        tr+="<td>"+medicineNames[i]+"</td>";
                        tr+="<td>"+medicineBrands[i]+"</td>";
                        tr+="<td>"+medicinePrices[i]+"</td>";
                        tr+="<td>"+medicineStatus[i]+"</td>";
                        tr+="<td>"+medicineExpiry[i]+"</td>";
                        tr+="<td>"+medicineComposition[i]+"</td>";
                        tr+="</tr>";
                        t+=tr;
                    }
                    document.getElementById('logdata').innerHTML += t;
                    document.getElementById('add').innerHTML=account;
                });
                
           }).catch(function(err){
               console.log(err.message);
           })
        })
    }
};

$(function() {
    $(window).load(function() {
        App.init();
    })
})