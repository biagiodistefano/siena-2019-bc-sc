spinner = `<span class="loader"><i class="fa-li fa fa-spinner fa-spin"></i><span>`;

function loadPra() {
    PRA.pra(function (err, res) {
        if (err) {
            alert(err);
        } else {
            pra = res;
            console.log("Indirizzo PRA: " + res)
            getDefaultAccount();
        }
    });
}

function getDefaultAccount() {
    web3.eth.getAccounts(function (err, accounts) {
        if (err) {
            alert("Non riesco a trovare l'Account!")
        } else {
            currentAccount = accounts[0];
            console.log("Account default: " + currentAccount);
            if (currentAccount === pra) {
                $("#formImmatricolazione").show();
                console.log("Mostro la consolle PRA");
            } else {
                $("#formImmatricolazione").hide();
                console.log("Nascondo la consolle PRA");
            }
            loadRegister();
        }
    });
};

function loadRegister() {
    PRA.numeroAuto(function (err, res) {
        if (err) {
            alert(err);
        } else {
            var numeroAuto = res.toNumber();
            for (var i = 0; i < numeroAuto; i++) {
                console.log(i);
                PRA.targheLUT(i, function (err, targa) {
                    if (err) {
                        alert(err);
                    } else {
                        loadCar(targa);
                    }
                });
            }
        }
    });
};

function loadCar(targa) {
    console.log(targa);
    PRA.registro(targa, function (err, auto) {
        if (!err) {
            var targa = auto[0];
            var proprietario = auto[1];
            var prezzo = auto[2].toNumber();
            var inVendita = auto[3];
            var miaAuto = currentAccount == proprietario;
            var cardAuto = $(`
                <div class="card mb-4" style="width: 18rem;">
                    <img class="card-img-top" src="/img/${targa}.png" alt="AUTOMOBILE" onerror="this.onerror=null;this.src='img/generic.png';">
                    <div class="card-body">
                        <h5 class="card-title">Targa: ${targa}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">Proprietario: ${proprietario}</h6>
                        <div class="input-group">
                            <button data-targa="${targa}" data-prezzo="${prezzo}" disabled="true" class="btn btn-danger scCall">Non in vendita</button>
                        </div>
                    </div>
                </div>
            `);
            var button = cardAuto.find("button");
            if (miaAuto) {
                var subTitle = cardAuto.find("h6");
                subTitle.text(`Proprietario (Tu): ${proprietario}`)
                if (inVendita) {
                    button.attr("class", "btn btn-warning scCall");
                    button.attr("data-action", "togliDallaVendita");
                    button.text(`Rimuovi dalla vendita (prezzo attuale: ${web3.fromWei(prezzo, "ether")} ETH)`);
                    button.removeAttr("disabled");
                } else {
                    boxPrezzo = $(`<input id="inputPrezzo_${targa}" type="number" class="form-control" placeholder="Prezzo in ETH">`);
                    button.after(boxPrezzo);
                    button.attr("class", "btn btn-primary scCall");
                    button.attr("data-action", "mettiInVendita");
                    button.text("Metti in vendita");
                    button.removeAttr("disabled");
                }
            } else if (inVendita) {
                button.attr("class", "btn btn-success scCall");
                button.attr("data-action", "acquista");
                button.text(`Acquista per ${web3.fromWei(prezzo, "ether")} ETH`);
                button.removeAttr("disabled");
            }
            $("#registroAuto").find(".card-holder").append(cardAuto);
        }
    });
};

function mettiInVendita(targa, prezzo, btn) {
    if (!isNaN(prezzo)) {
        btn.attr("disabled", "true");
        PRA.mettiInVendita(targa, prezzo, function (err, res) {
            if (!err) {
                eventMessaInVendita.watch(function (err, res) {
                    if (!err) {
                        if (res.args.targa == targa) {
                            location.reload();
                        } else {
                            console.log(res.args.targa, targa, res.args.prezzo, prezzo);
                        }
                    } else {
                        alert(err);
                    }
                });
            } else {
                alert(err);
                btn.removeAttr("disabled");
            }
        });
    } else {
        alert("Prezzo inserito non valido!");
    }
}

function togliDallaVendita(targa, btn) {
    btn.attr("disabled", "true");
    PRA.togliDallaVendita(targa, function (err, res) {
        if (!err) {
            eventNonInVendita.watch(function (err, res) {
                if (!err) {
                    if (res.args.targa == targa) {
                        location.reload();
                    } else {
                        console.log(res.args.targa, targa);
                    }
                } else {
                    alert(err);
                }
            });
        } else {
            alert(err);
            btn.removeAttr("disabled");
        }
    });
}

function acquista(targa, prezzo, btn) {
    btn.attr("disabled", "true");
    PRA.acquista(targa, { value: prezzo }, function (err, res) {
        if (!err) {
            eventAcquisto.watch(function (err, res) {
                if (!err) {
                    if (res.args.compratore == currentAccount) {
                        location.reload();
                    } else {
                        console.log(res.args.compratore, venditore);
                    }
                } else {
                    alert(err);
                }
            });
        } else {
            alert(err);
            btn.removeAttr("disabled");
        }
    });
}


window.addEventListener('load', () => {
    console.log("loading");
    if (typeof web3 !== 'undefined') {
        web3 = new Web3(web3.currentProvider);
        var ABI = [{ "constant": true, "inputs": [], "name": "pra", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "uint256" }], "name": "targheLUT", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "string" }], "name": "registro", "outputs": [{ "name": "targa", "type": "string" }, { "name": "proprietario", "type": "address" }, { "name": "prezzo", "type": "uint256" }, { "name": "inVendita", "type": "bool" }, { "name": "registrata", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "numeroAuto", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "targa", "type": "string" }, { "indexed": false, "name": "proprietario", "type": "address" }], "name": "Registrazione", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "compratore", "type": "address" }, { "indexed": false, "name": "venditore", "type": "address" }, { "indexed": false, "name": "prezzo", "type": "uint256" }], "name": "Acquisto", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "targa", "type": "string" }, { "indexed": false, "name": "prezzo", "type": "uint256" }], "name": "MessaInVendita", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "targa", "type": "string" }], "name": "NonInVendita", "type": "event" }, { "constant": false, "inputs": [{ "name": "targa", "type": "string" }, { "name": "proprietario", "type": "address" }], "name": "nuovaImmatricolazione", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "targa", "type": "string" }, { "name": "prezzo", "type": "uint256" }], "name": "mettiInVendita", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "targa", "type": "string" }], "name": "togliDallaVendita", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "targa", "type": "string" }], "name": "acquista", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [], "name": "chiudi", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }];
        ContractPRA = web3.eth.contract(ABI);
        PRA = ContractPRA.at("0xD9c453dC11773866e4f89b65A34164ACfb4C2dab");
        eventRegistrazione = PRA.Registrazione();
        eventAcquisto = PRA.Acquisto();
        eventMessaInVendita = PRA.MessaInVendita();
        eventNonInVendita = PRA.NonInVendita();
        loadPra();
    } else {
        alert("Devi installare MetaMask per usare questa dApp!")
    }
});


function nuovaImmatricolazione(nuovaTarga, nuovoProprietario, btn) {
    PRA.nuovaImmatricolazione(nuovaTarga, nuovoProprietario, function (err, res) {
        if (err) {
            alert(err);
        } else {
            btn.attr("disabled", "true");
            btn.append($(spinner));
            eventRegistrazione.watch(function (err, res) {
                if (!err) {
                    if (res.args.targa == nuovaTarga) {
                        location.reload();
                    } else {
                        console.log(res.args.targa, nuovaTarga, res.args.proprietario, nuovoProprietario);
                    }
                } else {
                    console.log(err);
                    btn.removeAttr("disabled");
                }
            });
        }
    });
}


$(document).on('click', '#btnImmatricolazione', function () {
    var nuovaTarga = $("#nuovaTarga").val().toUpperCase();
    var nuovoProprietario = $("#nuovoProprietario").val();
    nuovaImmatricolazione(nuovaTarga, nuovoProprietario, $(this));
});

$(document).on('click', ".scCall", function () {
    var action = $(this).data("action");
    var targa = $(this).data("targa");
    var prezzo = $(this).data("prezzo");
    console.log(action, targa);
    if (action === "mettiInVendita") {
        var nuovoPrezzo = parseInt($(`#inputPrezzo_${targa}`).val(), 10);
        mettiInVendita(targa, nuovoPrezzo, $(this));
    } else if (action === "togliDallaVendita") {
        togliDallaVendita(targa, $(this));
    } else if (action === "acquista") {
        acquista(targa, prezzo, $(this));
    } else {
        alert("Unkown action " + action);
    }
});