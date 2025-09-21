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
            App.web3Provider=new Web3.proviers.HttpProvider('http://127.0.0.1:7545');
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

        $(document).on('click','.btn-register',App.registerPharmacy);
    },

    registerPharmacy: function(event) {
        event.preventDefault();

        var medicineInstance;

        var pharmacyName = document.getElementById('PharmacyName').value;
        var pharmacyLicense = document.getElementById('PharmacyLicense').value;
        var pharmacyCode = document.getElementById('PharmacyCode').value;
        var pharmacyPhoneNumber = document.getElementById('PharmacyPhoneNumber').value;
        var pharmacistName = document.getElementById('PharmacistName').value;
        var pharmacyAddress = document.getElementById('PharmacyAddress').value;
        var manufacturerId = document.getElementById('ManufacturerId').value;
       
        //window.ethereum.enable();
        web3.eth.getAccounts(function(error,accounts){

            if(error) {
                console.log(error);
            }

            console.log(accounts);
            var account=accounts[0];

            App.contracts.medicine.deployed().then(function(instance){
                medicineInstance=instance;
                return medicineInstance.addPharmacy(
                    web3.fromAscii(manufacturerId),
                    web3.fromAscii(pharmacyName),
                    web3.fromAscii(pharmacyLicense), 
                    web3.fromAscii(pharmacyCode), 
                    pharmacyPhoneNumber, 
                    web3.fromAscii(pharmacistName), 
                    web3.fromAscii(pharmacyAddress), 
                    {from:account}
                );
             }).then(function(result){
                console.log(result);
                window.location.reload();

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