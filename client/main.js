const baseURL = "/api/";
// const baseURL = "http://localhost:4000/api/";
let hitsArr = [] //this array holds the 10 displayed food objects on the page
let foodList = []

const getFoodList = () => {
  document.querySelector('.user-foods').innerHTML = ''
  axios.get(baseURL + 'food').then(res => {
    foodList = res.data
    let foodCard = document.createElement('ul')
    foodCard.className = 'food-list'
    // let foodHeader = document.createElement('h2')
    // foodHeader.textContent = 'User Foods'
    // foodCard.append(foodHeader)
    foodList.forEach(ele => {
      let li = document.createElement('li')
      li.innerHTML = `<p class="food-list-item"><b>Food:</b> ${ele.name}, <b>Calories:</b> ${ele.calories}</p><button class="food-list-button" value="${ele.id}">Remove Food</button>`
      foodCard.append(li)
    })
    document.querySelector('.user-foods').append(foodCard)
    let foodButtons = document.querySelectorAll('.food-list-button')
    foodButtons.forEach(ele => ele.addEventListener('click', deleteFood))
  })
};

//searches the api for food results based off keywords entered by the user, it then displays 10 foods along with their info and an add button
const search = async() => {
  let searchKey = document.querySelector("#search-input").value;
  searchKey = searchKey.replace(/\s/g, "%20");



  try {
  const response = await axios.get(`${baseURL}call/${searchKey}`)
  


      //if statments display up to 10 foods search for by keyword. Add buttons are attached to each. obj created for each hit and pushed to global hitsArr
      document.querySelector('.hits-list').innerHTML = ''
      let foodDiv = document.createElement('div')
      foodDiv.className = 'food-list'

      const hits = response.data.hits
      if (hits.length >= 10) {
        for (let i = 0; i < 10; i++) {
          let hitObj = {
            id: i,
            name: hits[i].fields.item_name,
            calories: +hits[i].fields.nf_calories
          }
          hitsArr.push(hitObj)
          const foodCard = document.createElement('div')
          foodCard.innerHTML = `<p class="food-name"><b>Food:</b> ${hits[i].fields.item_name}, <b>Calories:</b> ${hits[i].fields.nf_calories}, <b>Serving size:</b> ${hits[i].fields.nf_serving_size_qty}</p><button value="${i}" class="food-button">Add Food</button>`
          foodDiv.append(foodCard)
        }
      } else if (hits.length === 0) {
        const foodCard = document.createElement('div')
        foodCard.innerHTML = `<p class=food-name>No matches found</p>`
        foodDiv.append(foodCard)
      } else if (hits.length <= 10 && hits.length > 0) {
        let i = 0
        hits.forEach(ele => {
          let hitObj = {
            id: i,
            name: ele.fields.item_name,
            calories: +ele.fields.nf_calories
          }
          hitsArr.push(hitObj)
          const foodCard = document.createElement('div')
          foodCard.innerHTML = `<p class="food-name"><b>Food:</b> ${ele.fields.item_name}, <b>Calories:</b> ${ele.fields.nf_calories}, <b>Serving size:</b> ${ele.fields.nf_serving_size_qty}</p><button value="${i}" class="food-button">Add Food</button>`
          foodDiv.append(foodCard)
          i++
        })
      }
      //attaches buttons and listeners to each food display
      document.querySelector('.hits-list').append(foodDiv)
      let foodButton = document.querySelectorAll('.food-button')
      foodButton.forEach(ele => ele.addEventListener('click', addFood))

    } catch (err) {
      console.log(err)
    }
    
};

const addFood = e => {
  e.preventDefault()
  let body = hitsArr[e.target.value]
  axios.post(baseURL + 'food', body).then(res => {
      getFoodList()
    })
    .catch(err => console.log(err))
};

const deleteFood = e => {
  axios.delete(`${baseURL}food/${e.target.value}`).then(res => {
    getFoodList()
  }).catch(err => console.log(err))
  //id for back end prob name
  //e.target.remove()
};

//creates a user and displays using 2 vars user/goal and then adds a button to them
const createUser = e => {
  e.preventDefault()
  const user = document.querySelector("#user-name").value
  const goal = document.querySelector("#user-goal").value
  let body = {
    user,
    goal
  }

  axios.post(baseURL + 'user', body).then(res => {
    console.log(res.data)
    displayUser()
  }).catch(err => console.log(err))





}; //

//calculates total calories the user has in their foodArr
const calcCals = () => {
  let goalDisplay = document.querySelector('#user-goal-display')
  axios.get(baseURL + 'food').then(res => {
    let calArr = res.data
    const calTotal = calArr.reduce((acc, cur) => acc + cur.calories, 0)

    axios.get(baseURL + 'user').then(res => {
      let {
        userName,
        calGoal
      } = res.data
      if (+calTotal > +calGoal) {
        goalDisplay.textContent = `User: ${userName} ate ${calTotal} calories and did not meet their goal of ${calGoal} calories`

      } else {
        goalDisplay.textContent = `User: ${userName} ate ${calTotal} calories and met their goal of ${calGoal} calories`
      }
    })

  }).catch(err => console.log(err))
}

//attaches user info to an html card and displays it, also gives a button to it
const displayUser = () => {
  axios.get(baseURL + 'user').then(res => {
    let {
      userName,
      calGoal
    } = res.data
    document.querySelector('#user-name-info').textContent = `User: ${userName}`
    document.querySelector('#user-calorie-info').textContent = `Calorie Goal: ${calGoal}`

    if (!document.querySelector('.user-button-info')) {

      const newButton = document.createElement('button')
      newButton.textContent = 'Calculate Calories'
      newButton.className = 'user-button-info'
      newButton.addEventListener('click', calcCals)
      document.querySelector('.user-info').append(newButton)
    }
  }).catch(err => console.log(err))
}

document.querySelector("#user-button").addEventListener("click", createUser)
document.querySelector("#search-button").addEventListener("click", search)