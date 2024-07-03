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

  // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

 //referencie o database

 var feedbackAquiDB = firebase.firestore();

 var feedbackAquiDB2 = firebase.database().ref("feedbackAqui");

// ouvinte para o envio do formulário
document.getElementById("cadastroForm").addEventListener("submit", function (event) {
    // evite que o formulário seja enviado normalmente
    event.preventDefault();

    // colete os dados do formulário
    const dadosConsumidor = {
        nome: document.getElementById("name").value,
        bi: document.getElementById("binumber").value,
        dataNascimento: document.getElementById("birthdate").value,
        genero: document.getElementById("genero").value,
        provincia: document.getElementById("provinceSelect").value,
        cidade: document.getElementById("citySelect").value,
        email: document.getElementById("email").value,
        celular: document.getElementById("phone").value,
        senha: document.getElementById("senha").value
    };

    // criar usuário no Firebase Authentication
    firebase.auth().createUserWithEmailAndPassword(dadosConsumidor.email, dadosConsumidor.senha)
        .then((userCredential) => {
            // o usuário foi criado com sucesso
            const user = userCredential.user;

            // associar IDs no Realtime Database
            feedbackAquiDB2.child("consumidores").child(user.uid).set({
                isAdmin: false,
                isRemoved:false,
                isSuspended: false,
                nome: dadosConsumidor.nome,
                bi: dadosConsumidor.bi,
                dataNascimento: dadosConsumidor.dataNascimento,
                genero: dadosConsumidor.genero,
                provincia: dadosConsumidor.provincia,
                cidade: dadosConsumidor.cidade,
                email: dadosConsumidor.email,
                celular: dadosConsumidor.celular,
                senha: dadosConsumidor.senha
                // outros dados que você deseje associar
            });

            // limpe o formulário após o envio
            document.getElementById("cadastroForm").reset();

            alert("Usuario cadastrado com sucesso!!!")

            window.location.href = "TelaLogin.html";
       
        })
        .catch((error) => {
            // lidar com erros durante o cadastro
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error(errorMessage);
        });
});
