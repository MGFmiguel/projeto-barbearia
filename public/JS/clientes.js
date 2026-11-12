async function carregarClientes() {
    const tbody = document.querySelector("tbody");
    const busca = document.getElementById("pesquisaCliente");
    try {
        const resposta = await fetch("/api/clientes");
        if (!resposta.ok) throw new Error("Não foi possível carregar clientes.");
        const clientes = await resposta.json();
        tbody.replaceChildren();
        const termo = busca.value.trim().toLocaleLowerCase("pt-BR");
        const filtrados = clientes.filter((cliente) =>
            `${cliente.nome} ${cliente.telefone || ""}`.toLocaleLowerCase("pt-BR").includes(termo));
        filtrados.forEach((cliente) => {
            const linha = document.createElement("tr");
            [cliente.nome, cliente.telefone || "-", cliente.ultimo_corte || "-",
                Number(cliente.total_gasto).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })].forEach((valor) => {
                const celula = document.createElement("td");
                celula.textContent = valor;
                linha.appendChild(celula);
            });
            tbody.appendChild(linha);
        });
    } catch (erro) { console.error("Erro ao carregar clientes:", erro); }
}

document.getElementById("pesquisaCliente").addEventListener("input", carregarClientes);
carregarClientes();
