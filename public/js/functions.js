function baseFunction(){
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
          obj.map((item,i) => arr.push(
            `<div class="product-item">
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
    				</div>`
          ));
          
          document.getElementById('cards').innerHTML = arr.join(" ");
          document.getElementById('circle').style.display = 'none';
        }
      }
      xmlHttp.open("GET", "./public/js/data.json", true);
      xmlHttp.send();
}