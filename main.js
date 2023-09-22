let rowNum = 1; 

let myform = document.querySelector("form");
let myTable = document.querySelector("#myData");
async function refreshTable() {
myTable.innerHTML = '';

            let res = await (await fetch('https://650b2201dfd73d1fab09a578.mockapi.io/Api/Presupuestos_SI')).json();

            for (let i = 0; i < res.length; i++) {
                agregarFila(res[i].id, res[i].valor, res[i].caja);
            }
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
            celdaEdit.innerHTML = '<button onclick="editarFila(this)">Editar</button>';
            celdaDelete.innerHTML = '<button onclick="eliminarFila(this)">Eliminar</button>';
        }

        async function eliminarFila(boton) {
            let fila = boton.closest('tr');
            let id = fila.cells[0].innerHTML;
        
    
            let deleteConfig = {
                method: 'DELETE',
            };
        
            await fetch(`https://650b2201dfd73d1fab09a578.mockapi.io/Api/Presupuestos_SI/${id}`, deleteConfig);
        

            fila.remove();
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
                ? `https://650b2201dfd73d1fab09a578.mockapi.io/Api/Presupuestos_SI${editId}`
                : 'https://650b2201dfd73d1fab09a578.mockapi.io/Api/Presupuestos_SI';

            let res = await (await fetch(apiUrl, config)).json();
            console.log(res);

   
            e.target.reset();
            e.target.removeAttribute('data-edit-id');

            refreshTable();
        });

        document.addEventListener('DOMContentLoaded', () => {
            refreshTable();
        });
        // buscador
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
            });}
            function Clear() {
                document.getElementById('searchId').value = '';
                let rows = document.querySelectorAll('#myData tr');
    
                rows.forEach((row) => {
                    row.style.display = ''; 
                });
            }
        