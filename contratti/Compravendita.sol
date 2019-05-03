/*
ATTENZIONE:
QUESTO SMART CONTRACT È FRUTTO DI UNA DRASTICA SEMPLIFICAZIONE
AL FINE DI RENDERLO COMPRENSIBILE AI NON ADDETTI AI LAVORI.
NON RAPPRESENTA UN CASO D'USO REALE.
NON ESEGUIRE IL DEPLOYMENT SULLA RETE ETHEREUM PRINCIPALE PER NESSUN MOTIVO.
LO SCOPO PERSEGUITO DA QUESTO CONTRATTO SI RAGGIUNGE
ATTRAVERSO L'IMPLEMENTAZIONE DI TOKEN ERC-721.
Per saperne di più: http://erc721.org/
*/


pragma solidity ^0.5.7; 


contract Compravendita {
    
    address payable public proprietario;
    string public targa = "ETH2019SI";
    uint public prezzo = 0;
    uint constant oneEther = 1 ether;
    bool public inVendita = false;
    event Acquisto(address compratore, address venditore, uint prezzo);
    
    constructor () public {
        proprietario = msg.sender;
    }
    
    function mettiInVendita(uint _prezzo) public {
        require(msg.sender == proprietario, "Solo il proprietario può mettere in vendita");
        prezzo = _prezzo * oneEther;
        inVendita = true;
    }
    
    function togliDallaVendita(uint256) public {
        require(msg.sender == proprietario, "Solo il proprietario può togliere dalla vendita");
        inVendita = false;
    }
    
    function acquista() public payable {
        require(inVendita == true, "Non in vendita");
        require(msg.sender != proprietario, "Solo chi non è proprietario può acquistare");
        require(msg.value == prezzo, "Prezzo errato");
        proprietario.transfer(msg.value);
        address venditore = proprietario;
        proprietario = msg.sender;
        inVendita = false;
        emit Acquisto(msg.sender, venditore, msg.value);
    }
    
}
