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

        $(document).on('click','.btn-register',App.sellMedicine);
    },

    sellMedicine: function(event) {
        event.preventDefault();

        var medicineInstance;

        var medicineBatch = document.getElementById('medicineBatch').value;
        var pharmacyCode = document.getElementById('pharmacyCode').value;
 
        //window.ethereum.enable();
        web3.eth.getAccounts(function(error,accounts){

            if(error) {
                console.log(error);
            }

            console.log(accounts);
            var account=accounts[0];

            App.contracts.medicine.deployed().then(function(instance){
                medicineInstance=instance;
                return medicineInstance.manufacturerSellMedicine(web3.fromAscii(medicineBatch),web3.fromAscii(pharmacyCode), {from:account});
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