const fs = require('fs')
const path = require('path')

class Ticket {
    constructor(numero, escritorio) {
        this.numero = numero;
        this.escritorio = escritorio;
    }
}

class TicketControl {

    constructor() {
        this.ultimo = 0;
        this.hoy = new Date().getDate();
        this.tickets = [];
        this.ultimos4 = [];
        let data = require('../data/data.json');

        if (data.hoy == this.hoy) {
            this.ultimo = data.ultimo;
            this.tickets = data.tickets;
            this.ultimos4 = data.ultimos4;
        } else {
            this.grabarArchivo();
        }
    }

    get toJson() {
        return {
            ultimo: this.ultimo,
            hoy: this.hoy,
            tickets: this.tickets,
            ultimos4: this.ultimos4
        }
    }


    siguiente() {
        this.ultimo += 1;

        let ticket = new Ticket(this.ultimo, null);
        this.tickets.push(ticket);

        this.grabarArchivo();

        return `Ticket ${this.ultimo}`;
    }

    getUltimoTicket() {
        return `Ticket ${this.ultimo}`;
    }

    atenderTicket(escritorio) {
        if (this.tickets.length === 0) {
            return null;
        }

        const ticket = this.tickets.shift();
        ticket.escritorio = escritorio;

        this.ultimos4.unshift(ticket);

        if (this.ultimos4.length > 4) {
            this.ultimos4.splice(-1, 1);
        }

        this.grabarArchivo();
        return ticket;
    }

    grabarArchivo() {
        const dbPath = path.join(__dirname, '../data/data.json')
        fs.writeFileSync(dbPath, JSON.stringify(this.toJson));
    }

}


module.exports = {
    TicketControl
}