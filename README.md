# general_server
E' il core da cui partire per la scrittura di un server con fastify.
Contiene una parte seprimentale che permette di collegare il server ad un dato ramo GIT e di mantenere il server aggiornato in maniera automatica al variare della versione su git stesso.

Problemi noti:
- robustezza: se i fase di deploy non si testa abbastanza bene ed il server crasha in startup, tutte le installazioni collegate andranno aggiornate a mano.
    - per ovviare  a questo problema abbiamo utilizzato una versione 'doppia' dove il primo server aggiorna il secondo e l'aggiornamento di quello di controllo resta comunque manuale.
