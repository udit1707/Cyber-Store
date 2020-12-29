const axios = require('axios').default;
const AWS = require('aws-sdk');
AWS.config.update({region: process.env.REGION});
const path = require('path');
const User=require('../modelsSQL/user');
const Data=require('../modelsSQL/data');
const Product=require('../modelsSQL/product');
const moment=require('moment');
const PRODUCT=require('../models/product');
const Rating=require('../modelsSQL/rating');
const ProductRating=require('../modelsSQL/product-rating');
const mongoose=require('mongoose');
const converter = require('json-2-csv');
const fs=require('fs');
const ID = process.env.AWS_ID;
const { Op } = require('sequelize')
const SECRET = process.env.AWS_KEY;
const BUCKET_NAME = process.env.BUCKET_NAME;
const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  accessKeyId: ID,
  secretAccessKey: SECRET
});

exports.postRatings=async(req,res,next)=>{
    console.log("Endpoint Hit");
    const prodId=req.params.productId;
    const value=req.body.rating;let sum=0,mean=0,count=0;
    try{
        const product=await Product.findOne({where:{mongoId:prodId.toString()}});
        const user=await User.findOne({where:{mongoId:req.user._id.toString()}});
        const foundProduct=await ProductRating.findOne({where:{productId:product.id,userId:user.id}});
        if(foundProduct)
        {
            const rating=await Rating.findByPk(foundProduct.ratingId);
            rating.value=value;
            await rating.save();
            const productRatings=await product.getRatings();
            if(productRatings.length!=0)
            {for(let i=0;i<productRatings.length;i++)
            sum+=productRatings[i].value;
            mean=sum/productRatings.length;
            product.mean_rating=mean;
            await product.save();}            
        }
        else
        {
            const rating=await Rating.create({value:value});
            const productRat=await product.addRating(rating);
            await user.addProductRating(productRat,{rating:value,mongoUser:req.user._id.toString(),mongoProd:prodId.toString()});
            const productRatings=await product.getRatings();
            if(productRatings.length!=0)
            {for(let i=0;i<productRatings.length;i++)
            sum+=productRatings[i].value;
            mean=sum/productRatings.length;
            product.mean_rating=mean;
            product.count_ratings=productRatings.length;
            await product.save();}
        }
       res.redirect("/products/" + prodId);
    }
    catch(err)
    {
        console.log(err);
        res.redirect("/");
    }

}

exports.toCSV=async(req,res,next)=>{
    try{
        const prodRatings=await ProductRating.findAll({attributes:['id','userId','productId','mongoProd','rating']});
        const data=JSON.parse(JSON.stringify(prodRatings));

        const csv=await converter.json2csvAsync(data);
            // write CSV to a file
        await fs.writeFileSync('dataset.csv', csv);
            

    const filePath = path.join(__dirname, '..','/dataset.csv');
    const fileContent=fs.createReadStream(filePath);
    const params = {
        Bucket: BUCKET_NAME,Key: 'dataset', // File name you want to save as in S3
        Body: fileContent
      };
    let postAWS;
    postAWS=await s3.upload(params).promise();
    let urlData=await Data.findAll();
    if(!urlData||urlData.length==0)
    {
        await Data.create({uri:postAWS.Location});
    }
    else
    {
        urlData[0].uri=postAWS.Location;
        await urlData[0].save();
    }
    fs.unlink(filePath, err => console.log(err));
    res.status(200).json({url:postAWS.Location});
 }
    catch(err)
    {
        console.log(err);
        res.redirect("/");
    }

}

exports.fetchIndex=async(req,res,next)=>{
    try{
        let products,response;let prodObj={};
        if(req.session.isLoggedIn)
        {
            const user=await User.findOne({where:{mongoId:req.user._id.toString()}});
            const data=await Data.findAll();
            // response = await axios.post('http://127.0.0.1:5000/loggedInRec', {user:user.id,url:data[0].uri},{   
            response = await axios.post('https://shopflask-api.herokuapp.com/loggedInRec', {user:user.id,url:data[0].uri},{   

            headers: {"content-type": "application/json"}});
            products=response.data.data_result;
            products=JSON.parse(products);
            if(!('id' in products))
            {
                const limit=8;
                products=await Product.findAll({limit,order:[['mean_rating','DESC']],attributes:[['mongoId','id'],'image','name',['mean_rating','mean'],['count_ratings','count'],['updatedAt','update']],where:{mean:{[Op.gt]:0}}});
                products=JSON.parse(products);
                prodObj={...products};
            }
            else
            {
                let image=[],names=[],id=[],mean=[],count=[],update=[];
                for(let i=0;i<products["id"].length;i++)
                {
                    const product=await Product.findByPk(products['id'][i]);
                    image.push(product.image);
                    names.push(product.name);
                    id.push(product.mongoId);
                    mean.push(product.mean_rating);
                    count.push(product.count_ratings);
                    let date=new Date(product.updatedAt)
                    update.push(date.toISOString().split('T')[0]);
                }
                prodObj={image:image,id:id,name:names,mean:mean,count:count,update:update};
            }
        }
        else
        {
            // console.log("Hit")
            // response = await axios.post('http://127.0.0.1:5000/contentRec',{   
            response = await axios.post('https://shopflask-api.herokuapp.com/contentRec',{   
            headers: {"content-type": "application/json"}});
            products=response.data.data_result;
            products=JSON.parse(products);
            if(!("image" in products))
            {
                const limit=8;
                products=await Product.findAll({limit,order:[['mean_rating','DESC']],attributes:[['mongoId','id'],'image','name',['mean_rating','mean'],['count_ratings','count'],['updatedAt','update']],where:{mean:{[Op.gt]:0}}});
                products=JSON.parse(products);
                prodObj={...products};
            }
            else
            {
                prodObj={...products};
            }
        }
        console.log(prodObj);
        res.render('shop/index',{prods:prodObj ,pageTitle:'Shop',path:'/',isAuthenticated:req.session.isLoggedIn});
    }
    catch(err)
    {
        console.log(err);
        // res.redirect("/");
    }
    
};

