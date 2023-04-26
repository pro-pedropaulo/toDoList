document.addEventListener('DOMContentLoaded', () => {
    const tarefaInput = document.getElementById('tarefa');
    const adicionarBtn = document.getElementById('adicionar');
    const listaTarefas = document.getElementById('lista-tarefas');
    const modalEditar = document.getElementById('modal-editar');
    const editarTarefaInput = document.getElementById('editar-tarefa');
    const salvarBtn = document.getElementById('salvar');
    const cancelarBtn = document.getElementById('cancelar');
    const relogio = document.getElementById('relogio');
    let indiceTarefaEditar;

    const recuperarTarefas = () => JSON.parse(localStorage.getItem('tarefas')) || [];

    const salvarTarefas = tarefas => localStorage.setItem('tarefas', JSON.stringify(tarefas));

    const renderizarTarefas = () => {
        const tarefas = recuperarTarefas();
        listaTarefas.innerHTML = '';
        const mensagemSemTarefas = document.getElementById('mensagem-sem-tarefas');
        const contadorTarefas = document.getElementById('contador-tarefas');
        const contadorTarefasSpan = contadorTarefas.querySelector('span');

        if (tarefas.length === 0) {
            mensagemSemTarefas.classList.remove('esconder');
            contadorTarefas.classList.add('esconder');
        } else {
            mensagemSemTarefas.classList.add('esconder');
            contadorTarefas.classList.remove('esconder');
            contadorTarefasSpan.textContent = tarefas.length;
        }

        tarefas.forEach((tarefa, indice) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${tarefa}</span>
                <button class="editar" data-indice="${indice}">Editar</button>
                <button class="excluir" data-indice="${indice}">Excluir</button>
            `;

            listaTarefas.appendChild(li);
        });
    };

    adicionarBtn.addEventListener('click', () => {
        const tarefa = tarefaInput.value.trim();
        if (tarefa === '') return;

        const tarefas = recuperarTarefas();
        tarefas.push(tarefa);
        salvarTarefas(tarefas);

        tarefaInput.value = '';
        renderizarTarefas();
    });

    listaTarefas.addEventListener('click', event => {
        const { target } = event;
        const indice = parseInt(target.dataset.indice);
        const tarefas = recuperarTarefas();

        if (target.classList.contains('excluir')) {
            const confirmarExclusao = confirm('Tem certeza que deseja excluir esta tarefa?');
            if (!confirmarExclusao) return;

            tarefas.splice(indice, 1);
            salvarTarefas(tarefas);
            renderizarTarefas();
        } else if (target.classList.contains('editar')) {
            abrirModalEditar(indice);
        }
    });

    const abrirModalEditar = indice => {
        indiceTarefaEditar = indice;
        const tarefas = recuperarTarefas();
        editarTarefaInput.value = tarefas[indice];
        modalEditar.style.display = 'block';
    };

    const fecharModalEditar = () => {
        modalEditar.style.display = 'none';
    };

    salvarBtn.addEventListener('click', () => {
        const novaTarefa = editarTarefaInput.value.trim();
        if (novaTarefa === '') return;

        const tarefas = recuperarTarefas();
        tarefas[indiceTarefaEditar] = novaTarefa;
        salvarTarefas(tarefas);
        renderizarTarefas();
        fecharModalEditar();
    });

    cancelarBtn.addEventListener('click', () => {
        fecharModalEditar();
    });

    const atualizarRelogio = () => {
        const dataAtual = new Date();
        const horas = dataAtual.getHours().toString().padStart(2, '0');
        const minutos = dataAtual.getMinutes().toString().padStart(2, '0');
        const segundos = dataAtual.getSeconds().toString().padStart(2, '0');
    
        relogio.textContent = `${horas}:${minutos}:${segundos}`;
    };
    
    setInterval(atualizarRelogio, 1000);

    renderizarTarefas();
});
