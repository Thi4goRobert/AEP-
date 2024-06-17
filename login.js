document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault();

    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    // verificação simples (substitua isso com sua lógica de autenticação)
    if (username === "admin" && password === "admin123") {
        alert("Login bem-sucedido!");
        // Redirecionar para outra página lista-produtos.html
        window.location.href = "dashboard.html";
    } else {
        document.getElementById("error-message").textContent = "Nome de usuário ou senha incorretos.";
    }
});
