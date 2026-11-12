const form = document.getElementById("loginForm");
const botao = form.querySelector("button[type='submit']");

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    botao.disabled = true;

    try {
        const resposta = await fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                usuario: document.getElementById("usuario").value,
                senha: document.getElementById("senha").value
            })
        });
        const dados = await resposta.json();
        if (resposta.ok && dados.sucesso) {
            window.location.href = "/dashboard";
        } else {
            alert(dados.mensagem || "Não foi possível entrar.");
        }
    } catch (erro) {
        alert("Erro ao conectar com o servidor.");
    } finally {
        botao.disabled = false;
    }
});
