function test(items){
	var arr=[];
	var obj = [];
	var count=0;
	// Object.keys(items).map(item => console.log(item));
	// console.log(arr[0]);
	firebase.database().ref("cart").on("value", (snapshot) => {
      count = snapshot.numChildren();
  	});
	Object.values(items).map(item => arr.push(item));
		for(var i=0;i<count;i++){
	  		obj.push(Object.values(arr[i])[0]);
		}
 //  	for(var i=0;i<count;i++){
 //  		console.log(Object.values(arr[i]));
 //  		// obj.push(Object.values(arr[i])[0]);
 //  	}

  	Object.values(obj).map(item => console.log(item.productName));
  	console.log("finished");
}

/* Get Product By ID */
function addProduct(items){
	// console.log(items);
	var obj = items;
	var arr = [];
	var obj = [];
	var count=0;
	var productList = [];

	firebase.database().ref("cart").on("value", (snapshot) => {
      count = snapshot.numChildren();
  	});

	const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 2
          });

	if (count == 0) {
		document.getElementById('addProductRow').innerHTML = "<tr><td class='text-center' colspan=5><i style='color:#bebebe'>There are no items in your cart</i></td></tr>";
	} else {
		Object.values(items).map(item => arr.push(item));
		for(var i=0;i<count;i++){
	  		obj.push(Object.values(arr[i])[0]);
		}
		Object.values(obj).map(item => productList.push(`
			<tr>
		      <th class="text-center" scope="row" class="id">`+item.productId+`</th>
		      <td class="text-left" style="width: 25%;"> 
					<span class="text-center"><img src="`+item.productUrl+`" alt="`+item.productName+`" width="75" height="75">&nbsp;&nbsp;&nbsp;&nbsp;`+item.productName+`</span>	
			  </td>
		      <td class="text-center">`+formatter.format(item.productPrice)+`</td>
		      <td class="text-center">
		      <span style="padding-left: 15px">
	              <span class="badge-light" style="font-size: 15px">
	              <span class="fa fa-star checked"></span>
	              <span class="fa fa-star checked"></span>
	              <span class="fa fa-star-half-full checked"></span>
	              <span class="fa fa-star-o unchecked"></span>
	              <span class="fa fa-star-o unchecked"></span>
	              </span>
	          </span></td>
		      <td class="text-center"><button class="btn btn-success"><i class="fa fa-shopping-cart"></i> Buy now </button>
		      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
		      <button class="btn btn-danger" onclick="removeItem('`+item.productCode+`')"><i class="fa fa-shopping-cart"></i> Remove from cart </button></td>
		    </tr>`));
		document.getElementById('addProductRow').innerHTML = productList.join("");
	}
	document.getElementById('circle').style.display="none";
}

function removeItem(key){
	var ref = firebase.database().ref().child('cart');
	ref.on("value", function(snapshot) {
		var s = snapshot.val();
		Object.keys(s).map(item => {
			console.log(s);
			if(item == key){
				ref.child('/'+key).remove();
			}
		});
	}, function (error) {
	   console.log("Error: " + error.code);
	});
}

function itemsInCart(){
  firebase.database().ref("cart").on("value", (snapshot) => {
      var count = snapshot.numChildren();
      document.getElementById('productCount').innerHTML = count;
    });
}

function filterCart(){

  var productName = document.getElementById("search").value;
  var items = "";  

  if (productName != '') {

  document.getElementById('circle').style.display = 'block';
  var arr=[];
  var obj = [];
  var count=0;
  var res = [];

  firebase.database().ref("cart").on("value", (snapshot) => {
      count = snapshot.numChildren();
      items = snapshot.val();
    });
 
   Object.values(items).map(item => arr.push(item));
    for(var i=0;i<count;i++){
        obj.push(Object.values(arr[i])[0]);
    }
 
  const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2
    });
    Object.values(obj).map(item => {
      var a = item['productName'].toUpperCase();
      var b = productName.toUpperCase();
      if (a.includes(b)) {
         res.push(`
          <tr>
		      <th class="text-center" scope="row" class="id">`+item.productId+`</th>
		      <td class="text-left" style="width: 25%;"> 
					<span class="text-center"><img src="`+item.productUrl+`" alt="`+item.productName+`" width="75" height="75">&nbsp;&nbsp;&nbsp;&nbsp;`+item.productName+`</span>	
			  </td>
		      <td class="text-center">`+formatter.format(item.productPrice)+`</td>
		      <td class="text-center">
		      <span style="padding-left: 15px">
	              <span class="badge-light" style="font-size: 15px">
	              <span class="fa fa-star checked"></span>
	              <span class="fa fa-star checked"></span>
	              <span class="fa fa-star-half-full checked"></span>
	              <span class="fa fa-star-o unchecked"></span>
	              <span class="fa fa-star-o unchecked"></span>
	              </span>
	          </span></td>
		      <td class="text-center"><button class="btn btn-success"><i class="fa fa-shopping-cart"></i> Buy now </button>
		      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
		      <button class="btn btn-danger" onclick="removeItem('`+item.productCode+`')"><i class="fa fa-shopping-cart"></i> Remove from cart </button></td>
		    </tr>`);
         return;
      }else{  
        console.log("Not Matched");
      }
    }
    );
    console.log(res);
    document.getElementById('addProductRow').innerHTML = res.join(" ");
    document.getElementById('circle').style.display = 'none';
   }else{
    document.getElementById('addProductRow').innerHTML = "<tr><td class='text-center' colspan=5><i style='color:#bebebe'>No products found with this name</i></td></tr>";
    location.reload();
   }
}

(function(){
	itemsInCart();
	var ref = firebase.database().ref().child('cart');
	ref.on("value", function(snapshot) {
		var s = snapshot.val();
		addProduct(s);
		// test(s);
	}, function (error) {
	   console.log("Error: " + error.code);
	});
})();