let id = 0;
let foodArr = [];
let userObj = { userName: "", calGoal: 0 };
const path = require('path')
const axios = require('axios')
module.exports = {
  //main html page
  main: (req,res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
},
  // take a food item and and it to arr. Sends string "Food Accepted" back
  foodEntry: (req, res) => {
    const { name, calories } = req.body;
    if (name && calories >= 0) {
      let entry = { id, name, calories };
      id++;
      foodArr.push(entry);
      res.status(200).send(req.body);
    } else {
      res.status(400).send("Food Invalid");
    }
  },
  // take a user and goal input and fill userObj with values. Sends string "User Accepted" back
  userEntry: (req, res) => {
    console.log("HIT")
    const { user, goal } = req.body;
    if (user && goal) {
      userObj.userName = user;
      userObj.calGoal = +goal;
      console.log(userObj);
      res.status(200).send("User Accepted");
    } else {
      res.status(400).send("User Invalid");
    }
  },
  // sends back foodArr
  getFood: (req, res) => {
    res.status(200).send(foodArr);
  },
  // sends back userObj
  getUser: (req, res) => {
    res.status(200).send(userObj);
  },
  deleteEntry: (req, res) => {
    const deleteId = +req.params.id
    console.log(deleteId)
    let index = foodArr.findIndex(food => {
      console.log(deleteId)
      console.log(food.id)
      return food.id === deleteId
    })
    foodArr.splice(index,1)
    console.log(foodArr)
    res.status(200).send("Entry Deleted")
  },
  getCallApi: (req, res) => {
  console.log("hit")
  const {searchKey} = req.params
  const options = {
    method: "GET",
    url: `https://nutritionix-api.p.rapidapi.com/v1_1/search/${searchKey}`,
    params: {
      fields: "item_name,nf_calories,"
    },
    headers: {
      "x-rapidapi-key": process.env.api_key,
      "x-rapidapi-host": "nutritionix-api.p.rapidapi.com",
    },
  };
  axios
    .request(options)
    .then(function (response) {
      console.log(response)
      res.status(200).send(response.data)
    }) .catch (err => {
    console.log(err) 
    res.status(400).send(err)
    })
  }
};
