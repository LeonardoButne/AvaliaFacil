const firebaseConfig = {
    apiKey: "AIzaSyA5W3WDwlAgF8Qn5ptmZ4V4JvVaHQ5KBEk",
    authDomain: "feedback-aqui.firebaseapp.com",
    databaseURL: "https://feedback-aqui-default-rtdb.firebaseio.com",
    projectId: "feedback-aqui",
    storageBucket: "feedback-aqui.appspot.com",
    messagingSenderId: "390730068105",
    appId: "1:390730068105:web:4f9c564b63192d6ddc5658",
    measurementId: "G-4V5LL17MRE"
};

const feedbackAquiDB2 = firebase.database().ref("feedbackAqui");
firebase.initializeApp(firebaseConfig);



function login() {
    $("#progress-bar-container").show();
    
    const email = document.form.email.value;
    const password = document.form.password.value;

    

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(response => {
            const userId = response.user.uid;

            // Consulta para obter informações do usuário no Realtime Database
            return feedbackAquiDB2.child("consumidores").child(userId).once("value");
        })
        .then(snapshot => {
            $("#progress-bar").css("width", "100%");

            // Esconde a barra de progresso após um breve atraso (por exemplo, 500ms)
            setTimeout(() => {
                $("#progress-bar-container").hide();
            }, 500);

            const userData = snapshot.val();
            if (userData && userData.isAdmin) {
                // O usuário é um administrador, redirecione para a página do painel de admin
                window.location.href = 'admin/PainelAdmin.html';
            }else if(userData.isSuspended){
                alert("Essa conta esta Suspensa! Tente uma outra.")
                return;
            } 
            else {
                window.location.href = "TelaPrincipal.html";
            }
        })
        .catch(error => {
            console.error("Erro no login:", error);
            //alert(getErrorMessage(error));

            $("#progress-bar-container").hide();
        });
}
