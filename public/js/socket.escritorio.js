const lblEscritorio = document.querySelector('h1');
const btnAtender = document.querySelector('button');
const lblTicket = document.querySelector('small');
const divAlerta = document.querySelector('.alert')
const lblPendientes = document.querySelector('#lblPendientes')

const searchParams = new URLSearchParams(window.location.search);
if (!searchParams.has('escritorio')) {
    window.location = 'index.html'
    throw new Error('El escritorio es necesario')
};

const escritorio = searchParams.get('escritorio');
lblEscritorio.innerText = "Escritorio: " + escritorio;
divAlerta.style.display = "none"

let socket = io();

socket.on('connect', () => {
    btnAtender.disabled = false;
});

socket.on('disconnect', () => {
    btnAtender.disabled = true;
});

socket.on('tickets-pendientes', (pendientes) => {
    if (pendientes == 0) {
        lblPendientes.style.display = "none";
        divAlerta.style.display = ""
    } else {
        lblPendientes.style.display = "";
        divAlerta.style.display = "none"
        lblPendientes.innerText = pendientes;
    }
})


btnAtender.addEventListener('click', () => {
    socket.emit('atenderTicket', { escritorio }, ({ ok, ticket, msg }) => {

        if (!ok) {
            lblTicket.innerText = "Nadie";
            return divAlerta.style.display = ''
        }
        lblTicket.innerText = "Ticket " + ticket.numero;
    });
})