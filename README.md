# Blockchain e Smart Contract per giuristi 3.0

Lo scopo di questo documento è fornire uno strumentario di
base per consentire ai giuristi di comprendere, a grandi
linee, la tecnologia che sta dietro alla blockchain ed agli
smart contract.

Una comprensione tecnico-informatica, seppur non approfondita, è fondamentale per capire in un primo momento
la reale portata di ciò di cui si parla, e in un secondo
momento per poter trarre conclusioni di carattere dogmatico-giuridico in maniera più consapevole.

Rivolgendosi a non addetti ai lavori (informatici) saranno fatte delle enormi semplificazioni. Alcuni aspetti, sebbene
fondamentali per la tecnologia, saranno solo accennati rimandando a una approfondimento personale l'esplorazione di tali concetti.

Iniziamo dalle basi.

## Cos'è un HASH

In parole povere, una [funzione di hashing](https://en.wikipedia.org/wiki/Hash_function) è una funzione crittografica per trasformare dei dati in input di qulunque dimensione in un dato in output di dimensione fissa. Per dati intendiamo `bit`.

In input può esserci qualsiasi dato informatico rappresentato in `bit` (file di testo, file video, audio ecc.) e l'output sarà una sequenza di `bit` di lunghezza fissa che cambierà al cambiare dell'input. Esistono diverse funzioni di hashing. Guardiamo il seguente esempio usando la funzione `SHA256`

**esempio**

| INPUT | FUNZIONE  | OUTPUT                                                           |
|-------|-----------|------------------------------------------------------------------|
| ciao  | -sha256-> | b133a0c0e9bee3be20163d2ad31d6248db292aa6dcb1ee087a2aa50e0fc75ae2 |
| ciao! | -sha256-> | eefe92e093e75943262d57ef18211898f0b29f2f80c4d0e5bee36a63bdb13c30 |
| Ciao! | -sha256-> | 6119ce5b522dbbbcf1f5927eeab860165ad131e1c6b76aead9c0088a9ef85dd3 |
| Ciao  | -sha256-> | 25c73520e69f4bf229811e8e46ffe7d80471544b9bee15ed25044b86be4115ad |


* `SHA256` sta per Secure Hash Algorithm
* il risultato in output è sempre una sequenza di 256 bit (=32 byte)
* se cambia anche solo un `bit` in input, il risultato sarà sempre e radicalmente diverso
* la funzione è `deterministica`: lo stesso input produrrà sempre lo stesso output
* la funzione è `unidirezionale`: non è possibile dall'`hash` risalire all'input

Esistono diverse funzioni di hashing. Potete trovare una demo per provare voi stessi su
[questo sito](https://anders.com/blockchain/hash.html)
