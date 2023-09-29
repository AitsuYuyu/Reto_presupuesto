let myform = document.querySelector("form");
let myTable = document.querySelector("#myData");

async function refreshTable() {
    myTable.innerHTML = '';

    try {
        let response = await fetch('https://65124103b8c6ce52b395763c.mockapi.io/nomina');
        let data = await response.json();

        data.forEach(item => {
            agregarFila(item.id, item.valor, item.caja);
        });
    } catch (error) {
        console.error('Error al obtener datos:', error);
    }
}

function buscarPorId() {
    let searchId = document.getElementById('searchId').value;
    let rows = document.querySelectorAll('#myData tr');

    rows.forEach((row) => {
        let idCell = row.cells[0];
        if (idCell.textContent === searchId) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function Clear() {
    document.getElementById('searchId').value = '';
    let rows = document.querySelectorAll('#myData tr');

    rows.forEach((row) => {
        row.style.display = '';
    });
}

async function eliminarFila(boton) {
    let fila = boton.parentNode.parentNode;
    let id = fila.cells[0].innerHTML;
    let deleteConfig = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    try {
        await fetch(`https://65124103b8c6ce52b395763c.mockapi.io/nomina/${id}`, deleteConfig);
        fila.remove();
    } catch (error) {
        console.error('Error al eliminar la fila:', error);
    }
}

function editarFila(boton) {
    let fila = boton.parentNode.parentNode;
    let id = fila.cells[0].innerHTML;
    let valor = fila.cells[1].innerHTML;
    let caja = fila.cells[2].innerHTML;

    document.querySelector('input[name="valor"]').value = valor;
    if (caja === 'ingreso') {
        document.querySelector('input[name="caja"][value="ingreso"]').checked = true;
    } else {
        document.querySelector('input[name="caja"][value="egreso"]').checked = true;
    }

    document.querySelector('form').setAttribute('data-edit-id', id);

    fila.remove();
}

function agregarFila(id, valor, caja) {
    let tabla = document.getElementById('myData');
    let fila = tabla.insertRow();
    let celdaNum = fila.insertCell(0);
    let celdaValor = fila.insertCell(1);
    let celdaCaja = fila.insertCell(2);
    let celdaEdit = fila.insertCell(3);
    let celdaDelete = fila.insertCell(4);


    celdaNum.innerHTML = id;
    celdaValor.innerHTML = valor;
    celdaCaja.innerHTML = caja;
    
    let botonEditar = document.createElement('button');
    botonEditar.textContent = '✔️';
    botonEditar.addEventListener('click', function() {
        editarFila(this);     });

   
    let botonEliminar = document.createElement('button');
    botonEliminar.textContent = '❌';
    botonEliminar.addEventListener('click', function() {
        eliminarFila(this); 
    });

    celdaEdit.appendChild(botonEditar);
    celdaDelete.appendChild(botonEliminar);

};



myform.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    const { valor } = data;
    data.valor = typeof valor === 'string' ? Number(valor) : null;

    let editId = e.target.getAttribute('data-edit-id');
    let config = {
        method: editId ? 'PUT' : 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(data),
    };

    let apiUrl = editId
        ? `https://65124103b8c6ce52b395763c.mockapi.io/nomina/${editId}`
        : 'https://65124103b8c6ce52b395763c.mockapi.io/nomina';

    try {
        let res = await (await fetch(apiUrl, config)).json();
        console.log(res);
    } catch (error) {
        console.error('Error al enviar los datos:', error);
    }

    e.target.reset();
    e.target.removeAttribute('data-edit-id');

    return refreshTable();
});

document.addEventListener('DOMContentLoaded', () => {
    refreshTable();
});
agregarFila();
