var product=artifacts.require('Medicine');

module.exports=function(deployer) {
    deployer.deploy(product); 
}