const ApiError = require("../main/error/apiError");
const { verifyToken } = require("./account");
const { Achievement } = require("../main/db/models");
const fs = require('fs');
const { resolve } = require("path");

const getAllAchievement = async (req) => {
  
  let account = await verifyToken(req);
  console.log(`Account ${account.id} get all achievement`);
  
  let achievements = await Achievement.findAll();
  let sendArray = []
  
  achievements.forEach(el => {
    sendArray.push({
      name: el.name,
      description: el.description,
      design_path: el.design_path
    });
  });
  

  return { achevements: sendArray }
}

const setAchievement = async (req) => {
  
  let account = await verifyToken(req);
  let name = req.query.name;
  let description = req.query.description;
  let image = req.files.image;
  console.log(`Account ${account.id} set achievement`);
  
  if(typeof name === "undefined") {
    throw new ApiError(400, `Name undefined`);
  }
  if(typeof description === "undefined") {
    throw new ApiError(400, `Description undefined`);
  }
  if(typeof image === "undefined") {
    throw new ApiError(400, `Image undefined`);
  }

  // file
  data = fs.readFileSync(image.path);
  if(!data) {
    throw new ApiError(83, `No data read image file`);
  }

  fs.writeFile(`${resolve(__dirname, "../../")}/public/imageAchievements/${name}.png`, data, {}, (e) => {
    if(e) {
      throw new ApiError(83, `Error write image file`);
    }
  });

  let newAchievement = await Achievement.create({
    name: name,
    description: description,
    design_path: `/public/imageAchievements/${name}.png`
  });

  return { achevement: {
    name: newAchievement.name,
    description: newAchievement.description,
    design_path: newAchievement.design_path
  }}
}


module.exports = {
  getAllAchievement,
  setAchievement
}