const lblNuevoTicket = document.querySelector('#lblNuevoTicket')
const btnCrear = document.querySelector('button')
    // Comando para establecer la conexión

let socket = io();


socket.on('connect', () => {
    btnCrear.disabled = false;
});

socket.on('disconnect', () => {
    btnCrear.disabled = true;
});

socket.on('estadoActual', (ticket) => {
    lblNuevoTicket.innerText = ticket.actual;
})


btnCrear.addEventListener('click', () => {
    socket.emit('siguienteTicket', null, function(ticket) {
        lblNuevoTicket.innerText = ticket;
    })
})