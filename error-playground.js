const sum=(a,b)=>{
    if(a&&b)
    {return a+b;}
    else
    {throw new Error('Invalid Arguments');} 
};
try{
    console.log(sum(1));
}
catch(error){
    console.log("Error Occured")
    // console.log(error);
}
console.log('Thsi works!');
