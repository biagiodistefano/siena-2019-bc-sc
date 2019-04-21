pragma solidity ^0.5.7; 


contract CompravenditaPra {
    
    address public pra;
    
    struct Automobile {
        string targa;
        address payable proprietario;
        uint prezzo;
        bool inVendita;
        bool registrata;
    }
    
    uint constant oneEther = 1 ether;
    
    mapping (string => Automobile) public registro;
    event Registrazione(string targa, address proprietario);
    event Acquisto(address compratore, address venditore, uint prezzo);
    event MessaInVendita(string targa, uint prezzo);
    event NonInVendita(string targa);
    
    constructor () public {
        pra = msg.sender;
    }
    
    modifier soloPra () {
        require(msg.sender == pra, "Solo il PRA effettuare questa azione");
        _;
    }
    
    modifier noPra() {
        require(msg.sender != pra, "Il PRA non può effettuare questa azione");
        _;
    }
    
    function nuovaAuto(string memory targa, address payable proprietario) public soloPra {
        require(!registro[targa].registrata, "L'Automobile esiste già");
        registro[targa] = Automobile(targa, proprietario, 0, false, true);
        emit Registrazione(targa, proprietario);
    }
    
    function mettiInVendita(string memory targa, uint prezzo) public {
        require(registro[targa].registrata, "L'Auto richiesta non è registrata");
        require(registro[targa].proprietario == msg.sender, "Solo il proprietario può mettere in vendita");
        registro[targa].prezzo = prezzo * oneEther;
        registro[targa].inVendita = true;
        emit MessaInVendita(targa, registro[targa].prezzo);
    }
    
    function togliDallaVendita(string memory targa) public {
        require(registro[targa].registrata, "L'Auto richiesta non è registrata");
        require(registro[targa].proprietario == msg.sender, "Solo il proprietario può mettere in vendita");
        registro[targa].inVendita = false;
        emit NonInVendita(targa);
    }
    
    function acquista(string memory targa) public payable noPra {
        require(registro[targa].registrata, "L'Auto richiesta non è registrata");
        require(registro[targa].inVendita == true, "Non in vendita");
        require(registro[targa].proprietario != msg.sender, "Solo chi non è proprietario può acquistare");
        require(registro[targa].prezzo == msg.value, "Prezzo errato");
        address payable compratore = msg.sender;
        address payable venditore = registro[targa].proprietario;
        registro[targa].proprietario = compratore;
        registro[targa].inVendita = false;
        venditore.transfer(msg.value);
        emit Acquisto(compratore, venditore, msg.value);
    }
    
}
