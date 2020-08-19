
var socialLogin = {
  signInWithPopup: function(provider){
    firebase.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
    }).catch(function(error) {
      console.log(error);
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
    });
  },
  signInWithRedirect: function(provider){
    firebase.auth().signInWithRedirect(provider);
    // document.getElementById('circle').style.display="none";
  },
  signOut: function(){
    firebase.auth().signOut().then(function() {
      window.location.assign("./index.html");
    }).catch(function(error) {
      // An error happened.
    });
  }
};


function loginValidator(id){
   document.getElementById('circle').style.display="block";
  if (id.includes("google")) {
    var provider = new firebase.auth.GoogleAuthProvider();
    if (id.includes("Popup")) {
      socialLogin.signInWithPopup(provider);
    }else{
      socialLogin.signInWithRedirect(provider);
    }
  }else if(id.includes("facebook")){
    var provider = new firebase.auth.FacebookAuthProvider();
    if (id.includes("Popup")) {
      socialLogin.signInWithPopup(provider);
    }else{
      socialLogin.signInWithRedirect(provider);
    }
  }else if(id.includes("twitter")){
    var provider = new firebase.auth.TwitterAuthProvider();
    if (id.includes("Popup")) {
      socialLogin.signInWithPopup(provider);
    }else{
      socialLogin.signInWithRedirect(provider);
    }
  }
};

function display(e){
  var signUp = document.querySelector('#sign-up-form');
  signUp.style.display = "none";
  var signIn = document.querySelector('#login-form');
  signIn.style.display = "none";
  console.log(e);
  var element = document.querySelector('#'+e);
  element.style.display = "block";
  document.getElementById('left').style.height = '120vh';
  document.getElementById('right').style.height = '120vh';
}

function addToCart(id,name,price,description,starRating,imageUrl,code){
  firebase.database().ref('cart/'+code).push().set({
    productId: id,
    productName: name,
    productPrice: price,
    productDescription: description,
    productRating: starRating,
    productUrl: imageUrl,
    productCode: code
  });      
  itemsInCart();
}

function itemsInCart(){
  firebase.database().ref("cart").on("value", (snapshot) => {
      var count = snapshot.numChildren();
      document.getElementById('productCount').innerHTML = count;
    });
}

function filterByName(){
  var productName = document.getElementById("search").value;
  
  if (productName != '') {
  
  document.getElementById('circle').style.display = 'block';
  var res = [];

   var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function(){

      if (this.readyState == 4 && this.status == 200) {
        var obj = JSON.parse(this.responseText);
        var arr = [];
          
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 2
      });

      obj.map((item,i) => {
      var a = item['productName'].toUpperCase();
      var b = productName.toUpperCase();
      // console.log(a+" "+b);
      if (a.includes(b)) {
         res.push(`
          <div class="product-item">
                  <p class="text-right" style="padding-left: 15px"><span class="badge-secondary" style="padding: 5px"><b>`+formatter.format(item.price)+`</b></span></p>
                  <div id="img-top" class="badge-light" style="text-align: center;margin-top: -40px">
                    <img src="`+item.imageUrl+`" alt="`+item.productName+`" width="100" height="100" style="text-align: center">
                  </div>
                  <div class="details" style="margin-top: 35px">
                      <button type="button" class="btn btn-success" style="float:right;margin-right: 10px"><i class="fa fa-shopping-cart"></i> Buy Now </button>
                      <h5 style="padding: 10px;">`+item.productName+`</h5>
                      <span style="padding-left: 15px">
                      <span class="badge-light" style="font-size: 12px">
                      <span class="fa fa-star checked"></span>
                      <span class="fa fa-star checked"></span>
                      <span class="fa fa-star-half-full checked"></span>
                      <span class="fa fa-star-o unchecked"></span>
                      <span class="fa fa-star-o unchecked"></span>
                      </span>
                      </span>
                      <button type="button" class="btn btn-primary" style="float:right;margin-right: 10px" id="addToCartButton" onclick="addToCart('`+item.productId+`','`+item.productName+`','`+item.price+`','`+item.description+`','`+item.starRating+`','`+item.imageUrl+`','`+item.productCode+`')"><i class="fa fa-shopping-cart"></i> Add to Cart </button>
                  </div>
                </div>`);
         return;
      }else{
      document.getElementById('notFound').style.display = 'block';
      document.getElementById('notFound').innerHTML = `
      <div class="chip">
        `+productName+`
        <span class="closebtn" onclick="baseFunction();document.getElementById('notFound').style.display='none'">&times;</span>
      </div>`;  
      }
    });
      if (res.length != 0) {
    document.getElementById('cards').innerHTML = res.join(" ");
    document.getElementById('circle').style.display = 'none';
    } else {
      // var chips = [];
      // var chipsLabel = productName.split(" ");
      // chipsLabel.map((name) => chips.push(`
      //   <div class="chip">
      //   `+productName+`
      //     <span class="closebtn" onclick="this.parentElement.style.display='none'">&times;</span>
      //   </div>`));
      // document.getElementById('notFound').innerHTML = chips.join(" ");
    }
  }
  }
  xmlHttp.open("GET", "./public/js/data.json", true);
  xmlHttp.send();
   }else{
     var nf = document.getElementById('notFound');
     nf.style.display = 'block';
     document.getElementById('cards').innerHTML = '';
     nf.innerHTML =  `
      <div class="chip">
        No Products Found
        <span class="closebtn" onclick="baseFunction();document.getElementById('notFound').style.display='none'">&times;</span>
      </div>`;
   }
}

function filterByRating(){
  var slider = document.getElementById("myRange");
  // var output = document.getElementById("demo");

  slider.oninput = function() {
    // output.innerHTML = slider.value;
    // output.innerHTML = this.value;
    var val = this.value;
    document.getElementById('circle').style.display = 'block';
    var res = [];
    var count = 0;

     var xmlHttp = new XMLHttpRequest();
      xmlHttp.onreadystatechange = function(){

        if (this.readyState == 4 && this.status == 200) {
          var obj = JSON.parse(this.responseText);
          var arr = [];
            
        const formatter = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          maximumFractionDigits: 2
        });

        obj.map((item,i) => {
        var a = item['starRating'];
        var b = val;
        // console.log(a+" "+b);
        if (a <= b) {
           res.push(`
            <div class="product-item">
                    <p class="text-right" style="padding-left: 15px"><span class="badge-secondary" style="padding: 5px"><b>`+formatter.format(item.price)+`</b></span></p>
                    <div id="img-top" class="badge-light" style="text-align: center;margin-top: -40px">
                      <img src="`+item.imageUrl+`" alt="`+item.productName+`" width="100" height="100" style="text-align: center">
                    </div>
                    <div class="details" style="margin-top: 35px">
                        <button type="button" class="btn btn-success" style="float:right;margin-right: 10px"><i class="fa fa-shopping-cart"></i> Buy Now </button>
                        <h5 style="padding: 10px;">`+item.productName+`</h5>
                        <span style="padding-left: 15px">
                        <span class="badge-light" style="font-size: 12px">
                        <span class="fa fa-star checked"></span>
                        <span class="fa fa-star checked"></span>
                        <span class="fa fa-star-half-full checked"></span>
                        <span class="fa fa-star-o unchecked"></span>
                        <span class="fa fa-star-o unchecked"></span>
                        </span>
                        </span>
                        <button type="button" class="btn btn-primary" style="float:right;margin-right: 10px" id="addToCartButton" onclick="addToCart('`+item.productId+`','`+item.productName+`','`+item.price+`','`+item.description+`','`+item.starRating+`','`+item.imageUrl+`','`+item.productCode+`')"><i class="fa fa-shopping-cart"></i> Add to Cart </button>
                    </div>
                  </div>`);
           return;
        }else{
        document.getElementById('notFound').style.display = 'block';
        document.getElementById('notFound').innerHTML = `
        <div class="chip">
        <i>Results Found: 
          `+res.length+`</i>
          <span class="closebtn" onclick="baseFunction();document.getElementById('notFound').style.display='none'">&times;</span>
        </div>`;  
        }
      });
      if (res != undefined) {
      document.getElementById('cards').innerHTML = res.join(" ");
      document.getElementById('circle').style.display = 'none';
      }
    }
    }
    xmlHttp.open("GET", "./public/js/data.json", true);
    xmlHttp.send();
  }
}

function filterByPrice(){
  var slider = document.getElementById("priceRange");
  // var output = document.getElementById("priceValue");
  var maxPrice = document.getElementById("max-price");
  var minPrice = document.getElementById("min-price");


  slider.oninput = function() {
    // output.innerHTML = slider.value;
    // output.innerHTML = this.value;
    maxPrice.value = this.value;
    var val = this.value;
    var minimum = minPrice.value;
    document.getElementById('circle').style.display = 'block';
    var res = [];
    var count = 0;

     var xmlHttp = new XMLHttpRequest();
      xmlHttp.onreadystatechange = function(){

        if (this.readyState == 4 && this.status == 200) {
          var obj = JSON.parse(this.responseText);
          var arr = [];
            
        const formatter = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          maximumFractionDigits: 2
        });

        obj.map((item,i) => {
        var a = item['price'];
        var b = val;
        // console.log(a+" "+b);
        if (a <= b && a>=minimum) {
           res.push(`
            <div class="product-item">
                    <p class="text-right" style="padding-left: 15px"><span class="badge-secondary" style="padding: 5px"><b>`+formatter.format(item.price)+`</b></span></p>
                    <div id="img-top" class="badge-light" style="text-align: center;margin-top: -40px">
                      <img src="`+item.imageUrl+`" alt="`+item.productName+`" width="100" height="100" style="text-align: center">
                    </div>
                    <div class="details" style="margin-top: 35px">
                        <button type="button" class="btn btn-success" style="float:right;margin-right: 10px"><i class="fa fa-shopping-cart"></i> Buy Now </button>
                        <h5 style="padding: 10px;">`+item.productName+`</h5>
                        <span style="padding-left: 15px">
                        <span class="badge-light" style="font-size: 12px">
                        <span class="fa fa-star checked"></span>
                        <span class="fa fa-star checked"></span>
                        <span class="fa fa-star-half-full checked"></span>
                        <span class="fa fa-star-o unchecked"></span>
                        <span class="fa fa-star-o unchecked"></span>
                        </span>
                        </span>
                        <button type="button" class="btn btn-primary" style="float:right;margin-right: 10px" id="addToCartButton" onclick="addToCart('`+item.productId+`','`+item.productName+`','`+item.price+`','`+item.description+`','`+item.starRating+`','`+item.imageUrl+`','`+item.productCode+`')"><i class="fa fa-shopping-cart"></i> Add to Cart </button>
                    </div>
                  </div>`);
           return;
        }else{
        document.getElementById('notFound').style.display = 'block';
        document.getElementById('notFound').innerHTML = `
        <div class="chip">
        <i>Results Found: 
          `+res.length+`</i>
          <span class="closebtn" onclick="baseFunction();document.getElementById('notFound').style.display='none'">&times;</span>
        </div>`;  
        }
      });
      if (res != undefined) {
      document.getElementById('cards').innerHTML = res.join(" ");
      document.getElementById('circle').style.display = 'none';
      }
    }
    }
    xmlHttp.open("GET", "./public/js/data.json", true);
    xmlHttp.send();
  }
}

(function(){
  itemsInCart();
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      baseFunction();

    } else {
      console.log("No user is signed in.");
    }
  });
})();