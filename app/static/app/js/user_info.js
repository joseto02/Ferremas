document.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem('username');
    const userInfo = document.getElementById('user-info');
    if (username) {
        userInfo.innerText = `Hola, ${username}`;
    } else {
        userInfo.innerText = 'No has iniciado sesión';
    }
});