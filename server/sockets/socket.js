const { io } = require('../server');
const { TicketControl } = require('../classes/ticket-control')


const ticketControl = new TicketControl();

io.on('connection', (client) => {

    client.emit('estadoActual', {
        actual: ticketControl.getUltimoTicket()
    })

    client.emit('ultimos4', ticketControl.ultimos4);

    client.emit('tickets-pendientes', ticketControl.tickets.length)

    client.on('siguienteTicket', (data, callback) => {

        let siguiente = ticketControl.siguiente();

        callback(siguiente);
        client.broadcast.emit('tickets-pendientes', ticketControl.tickets.length)
    });

    client.on('atenderTicket', ({ escritorio }, callback) => {
        if (!escritorio) {
            return callback({
                err: true,
                msj: 'El escritorio es necesario'
            })
        }

        let ticket = ticketControl.atenderTicket(escritorio);
        client.broadcast.emit('ultimos4', ticketControl.ultimos4);
        client.emit('tickets-pendientes', ticketControl.tickets.length)
        client.broadcast.emit('tickets-pendientes', ticketControl.tickets.length);

        if (!ticket) {
            callback({
                ok: false,
                msg: "Ya no hay tickets pendientes"
            })
        } else {
            callback({
                ok: true,
                ticket
            })
        }
    });

});