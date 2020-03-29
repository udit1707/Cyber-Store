// const products= [];
// module.exports= class product {
//     constructor(t){
//         this.title=t;
//     }
//     save(){
//         product.push(this);
//     }
//     static fetchAll(){
//         return products;
//     }
// }

//Storing Data in files via the model

const fs=require('fs');
const path=require('path');
const p=path.join(path.dirname(process.mainModule.filename),'data','products.json');
const getProductsFromFile=cb=>{

fs.readFile(p,(err,fileContent)=>{
    if(err){
       return cb([]);
    }
    cb(JSON.parse(fileContent));
});};

module.exports= class Product {
    constructor(title,imageUrl, price,description ){
        this.title=title;
        this.imageUrl=imageUrl;
        this.description=description;
        this.price=price;
    }
    save(){
    
         getProductsFromFile(products=>{

            products.push(this); 
            fs.writeFile(p,JSON.stringify(products),(err)=>{console.log(err);});

         });

       //console.log(fileContent);
       
          
    
    
    }
    
    
    static fetchAll(cb){
       getProductsFromFile(cb);
    }
};

