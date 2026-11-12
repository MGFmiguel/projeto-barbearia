const form = document.getElementById("formCorte");
const listaCortes = document.getElementById("listaCortes");

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const dados = Object.fromEntries(new FormData(form).entries());
    try {
        const resposta = await fetch("/novo-corte", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(dados) });
        const resultado = await resposta.json();
        if (!resposta.ok || !resultado.sucesso) return alert(resultado.mensagem || "Erro ao cadastrar corte.");
        form.reset();
        await carregarCortes();
    } catch (erro) { alert("Erro ao cadastrar corte."); }
});

function adicionarCelula(linha, valor) {
    const celula = document.createElement("td");
    celula.textContent = valor ?? "";
    linha.appendChild(celula);
}

async function carregarCortes() {
    try {
        const resposta = await fetch("/api/cortes");
        if (!resposta.ok) throw new Error("Não foi possível carregar os cortes.");
        const cortes = await resposta.json();
        listaCortes.replaceChildren();
        if (!cortes.length) {
            const linha = document.createElement("tr");
            const celula = document.createElement("td");
            celula.colSpan = 7;
            celula.textContent = "Nenhum corte cadastrado.";
            linha.appendChild(celula);
            listaCortes.appendChild(linha);
            return;
        }
        cortes.forEach((corte) => {
            const linha = document.createElement("tr");
            adicionarCelula(linha, corte.cliente);
            adicionarCelula(linha, corte.corte);
            adicionarCelula(linha, Number(corte.valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }));
            adicionarCelula(linha, corte.pagamento);
            adicionarCelula(linha, corte.data);
            adicionarCelula(linha, corte.hora);
            const acoes = document.createElement("td");
            const editar = document.createElement("button");
            editar.className = "btnEditar";
            editar.textContent = "Editar";
            editar.addEventListener("click", () => editarCorte(corte));
            const excluir = document.createElement("button");
            excluir.className = "btnExcluir";
            excluir.textContent = "Excluir";
            excluir.addEventListener("click", () => excluirCorte(corte.id));
            acoes.append(editar, excluir);
            linha.appendChild(acoes);
            listaCortes.appendChild(linha);
        });
    } catch (erro) { console.error(erro); }
}

async function editarCorte(corteAtual) {
    const cliente = prompt("Nome do cliente:", corteAtual.cliente);
    if (cliente === null) return;
    const corte = prompt("Tipo de corte:", corteAtual.corte);
    if (corte === null) return;
    const valor = prompt("Valor:", corteAtual.valor);
    if (valor === null) return;
    const pagamento = prompt("Forma de pagamento:", corteAtual.pagamento);
    if (pagamento === null) return;
    const observacao = prompt("Observação:", corteAtual.observacao || "");
    if (observacao === null) return;
    try {
        const resposta = await fetch(`/api/cortes/${corteAtual.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ cliente, corte, valor, pagamento, observacao }) });
        const resultado = await resposta.json();
        if (!resposta.ok || !resultado.sucesso) return alert(resultado.mensagem || "Erro ao editar corte.");
        await carregarCortes();
    } catch (erro) { alert("Erro ao editar corte."); }
}

async function excluirCorte(id) {
    if (!confirm("Tem certeza que deseja excluir este corte?")) return;
    try {
        const resposta = await fetch(`/api/cortes/${id}`, { method: "DELETE" });
        const resultado = await resposta.json();
        if (!resposta.ok || !resultado.sucesso) return alert(resultado.mensagem || "Erro ao excluir corte.");
        await carregarCortes();
    } catch (erro) { alert("Erro ao excluir corte."); }
}

carregarCortes();
