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

        $(document).on('click','.btn-register',App.registerMedicine);
    },

    registerMedicine: function(event) {
        event.preventDefault();

        var medicineInstance;

        var manufacturerID = document.getElementById('manufacturerID').value;
        var medicineName = document.getElementById('medicineName').value;
        var medicineBatch = document.getElementById('medicineBatch').value;
        var medicineBrand = document.getElementById('medicineBrand').value;
        var medicinePrice = document.getElementById('medicinePrice').value;
        var expiryDate = document.getElementById('expiryDate').value;
        var composition = document.getElementById('composition').value;

        //window.ethereum.enable();
        web3.eth.getAccounts(function(error,accounts){

            if(error) {
                console.log(error);
            }

            console.log(accounts);
            var account=accounts[0];

            App.contracts.medicine.deployed().then(function(instance){
                medicineInstance=instance;
                return medicineInstance.addMedicine(
                    web3.fromAscii(manufacturerID),
                    web3.fromAscii(medicineName), 
                    web3.fromAscii(medicineBatch), 
                    web3.fromAscii(medicineBrand), 
                    medicinePrice, 
                    web3.fromAscii(expiryDate), 
                    web3.fromAscii(composition), 
                    {from:account}
                );
             }).then(function(result){
                console.log(result);

                document.getElementById('manufacturerID').value='';
                document.getElementById('medicineName').value='';
                document.getElementById('medicineBatch').value='';
                document.getElementById('medicineBrand').value='';
                document.getElementById('medicinePrice').value='';
                document.getElementById('expiryDate').value='';
                document.getElementById('composition').value='';

            }).catch(function(err){
                console.log(err.message);
            });
        });
    }
};

$(function() {

    $(window).load(function() {
        App.init();
    })
})