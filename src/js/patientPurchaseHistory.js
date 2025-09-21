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
                return medicineInstance.getPurchaseHistory(web3.fromAscii(patientCode),{from:account});

            }).then(function(result){
                
                var medicineBatches=[];
                var pharmacyCodes=[];
                var manufacturerCodes=[];
                
                for(var k=0;k<result[0].length;k++){
                    medicineBatches[k]=web3.toAscii(result[0][k]);
                }

                for(var k=0;k<result[1].length;k++){
                    pharmacyCodes[k]=web3.toAscii(result[1][k]);
                }

                for(var k=0;k<result[2].length;k++){
                    manufacturerCodes[k]=web3.toAscii(result[2][k]);
                }
                
                var t= "";
                document.getElementById('logdata').innerHTML = t;
                for(var i=0;i<result[0].length;i++) {
                    var temptr = "<td>"+pharmacyCodes[i]+"</td>";
                    if(temptr === "<td>0</td>"){
                        break;
                    }
                    var tr="<tr>";
                    tr+="<td>"+medicineBatches[i]+"</td>";
                    tr+="<td>"+pharmacyCodes[i]+"</td>";
                    tr+="<td>"+manufacturerCodes[i]+"</td>";
                    tr+="</tr>";
                    t+=tr;
                }
                document.getElementById('logdata').innerHTML += t;
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