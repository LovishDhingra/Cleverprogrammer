const OTP = require("../models/otp");
const User = require("../models/user");
const otpGenerator = require("otp-generator");

exports.createOpt = async(req,res)=>{
  try {

    const {email} = req.body;

    if(!email){
        return res.status(400).json({
            success:false,
            message:"please fill all the input fileds",
        });
    }

    const userDetails = await User.findOne({email:email});

    if(userDetails){
        return res.status(400).json({
            success:false,
            message:"User allready have an account",
        })
    }
     

  const newOtp = otpGenerator.generate(4,{
    specialChars:false,
    upperCaseAlphabets:false,
    lowerCaseAlphabets:false,
  });


    const newOpt = await OTP.create({
        email:email,
        otp:newOtp,
    });



    return res.status(200).json({
        success:true,
        message:"Otp created successfully",
        newOpt,      
    });

  
    } catch (error) {
       console.log(error);
       return res.status(500).json({
        success:false,
        message:"Internal Setver error",
       })
        
    }

}