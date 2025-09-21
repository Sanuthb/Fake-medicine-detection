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
        var medicineBatch = document.getElementById('medicineBatch').value;
        var patientCode = document.getElementById('patientCode').value;
        var medicineInstance;
        //window.ethereum.enable();
        web3.eth.getAccounts(function(error,accounts){

            if(error) {
                console.log(error);
            }

            var account=accounts[0];
            
            App.contracts.medicine.deployed().then(function(instance){

                medicineInstance=instance;
                return medicineInstance.verifyMedicine(web3.fromAscii(medicineBatch), web3.fromAscii(patientCode),{from:account});

            }).then(function(result){

                var t= "";

                var tr="<tr>";
                if(result){
                    tr+="<td>"+ "Authentic Medicine - Safe to Use"+"</td>";
                }else{
                    tr+="<td>"+ "Fake Medicine - DO NOT USE"+"</td>";
                }
                tr+="</tr>";
                t+=tr;

                document.getElementById('logdata').innerHTML = t;
                document.getElementById('add').innerHTML=account;
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