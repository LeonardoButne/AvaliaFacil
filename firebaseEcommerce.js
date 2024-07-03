

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


// Referencie o Firestore
const feedbackAquiDB = firebase.firestore();

// Referencie o banco de dados em tempo real
const feedbackAquiDB2 = firebase.database().ref("feedbackAqui");

document.getElementById('cadastroEcommerce_form').addEventListener("submit", submitForm);

function submitForm(e) {
    e.preventDefault();

    var ecommerce_name = getElementVal('ecommerce_name');
    var category = getElementVal('category');
    var website = getElementVal('website');
    var provinceSelect = getElementVal('provinceSelect');
    var citySelect = getElementVal('citySelect');
    var phone = getElementVal('phone');
    var contact_email = getElementVal('contact_email');
    var legal_representative = getElementVal('legal_representative');
    var foundation_date = getElementVal('foundation_date');

    console.log(ecommerce_name, category, website, provinceSelect, citySelect, phone, contact_email, legal_representative, foundation_date);
    saveDados(ecommerce_name, category, website, provinceSelect, citySelect, phone, contact_email, legal_representative, foundation_date);
}

const saveDados = (ecommerce_name, category, website, provinceSelect, citySelect, phone, contact_email, legal_representative, foundation_date) => {
    // Usando Firestore
    feedbackAquiDB.collection("EcommerceCadastrados").add({
        ecommerce_name: ecommerce_name,
        category: category,
        website: website,
        provinceSelect: provinceSelect,
        citySelect: citySelect,
        phone: phone,
        contact_email: contact_email,
        legal_representative: legal_representative,
        foundation_date: foundation_date
    }).then(function (docRef) {
        console.log("Documento de E-commerce adicionado com ID: ", docRef.id);
    }).catch(function (error) {
        console.error("Erro ao adicionar documento de E-commerce: ", error);
    });


    const newCadastroFrom = {
        suspended: false,
        ecommerce_name: ecommerce_name,
        category: category,
        website: website,
        provinceSelect: provinceSelect,
        citySelect: citySelect,
        phone: phone,
        contact_email: contact_email,
        legal_representative: legal_representative,
        foundation_date: foundation_date
    };


    const newFeedbackRef = feedbackAquiDB2.child("ecommerces").push();
    newFeedbackRef.set(newCadastroFrom);
    alert("E-commerce cadastrado com sucesso!!!");
}

const getElementVal = (id) =>{
    return document.getElementById(id).value;
}


// Realize uma consulta para obter os dados dos E-commerces cadastrados
feedbackAquiDB2.on("value", (snapshot) => {
    snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        const ecommerce_name = data.ecommerce_name;
        const category = data.category;
        const website = data.website;
        const provinceSelect = data.provinceSelect;
        const citySelect = data.citySelect;
        const phone = data.phone;
        const contact_email = data.contact_email;
        const legal_representative = data.legal_representative;
        const foundation_date = data.foundation_date;

        console.log("Nome do E-commerce: " + ecommerce_name);
        console.log("Categoria: " + category);
        console.log("Website: " + website);
        console.log("Província: " + provinceSelect);
        console.log("Cidade: " + citySelect);
        console.log("Telefone: " + phone);
        console.log("Email de Contato: " + contact_email);
        console.log("Representante Legal: " + legal_representative);
        console.log("Data de Fundação: " + foundation_date);
    });
}, (error) => {
    console.error("Erro ao obter os dados do Realtime Database: " + error);
});

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // O usuário está autenticado
      const userId = user.uid;
      console.log("ID do usuário:", userId);
    } else {
      // O usuário não está autenticado
      console.log("Usuário não autenticado");
    }
  });
  
