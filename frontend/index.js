///// GLOBAL VARIABLES

const addBtn = document.getElementById("new-beer-button");
const beerForm = document.querySelector(".container");
let addBeer = false;
const loginBtn = document.getElementById("login-btn");
const signupBtn = document.getElementById("signup-btn");
const loginForm = document.querySelector(".sign-in");
const loginSignupBtns = document.getElementsByClassName("login-signup");
let loginUser = false;
let signupUser = false;
const signupForm = document.querySelector(".sign-up");
const addBeerForm = document.querySelector(".add-beer-form");
const BEER_URL = "http://localhost:3000/beers/";
const COUNTRY_URL = "http://localhost:3000/countries";
const STYLES_URL = "http://localhost:3000/styles";
const USERS_URL = "http://localhost:3000/users";
const REVIEWS_URL = "http://localhost:3000/reviews";
const beerCollection = document.querySelector("#beer-collection");
let formStyle = document.querySelector("#menu-style-selectors");
let formCountries = document.querySelector("#menu-countries-selectors");
let currentUser = null;
const search = document.querySelector(".search");
const allBeersBtn = document.getElementById("all-beers-btn");

//// welcome and logout
const welcome = document.getElementById("welcome");
const logout = document.getElementById("logout-btn");

function greeting() {
  currentUser === !null;
  if (currentUser) {
    welcome.style.display = "block";
    welcome.innerText = `Welcome, ${currentUser.username}!`;
    logout.style.display = "block";
    logout.addEventListener("click", () => {
      currentUser = null;
      welcome.style.display = "none";
      logout.style.display = "none";
      loginBtn.style.display = "block";
      signupBtn.style.display = "block";
    });
    loginForm.style.display = "none";
    loginBtn.style.display = "none";
    signupBtn.style.display = "none";
    signupForm.style.display = "none";
  } else {
    welcome.style.display = "none";
    logout.style.display = "none";
  }
}

// All Beers Button

allBeersBtn.addEventListener("click", () => {
  init();
});

/// event listener to show/hide login field
loginBtn.addEventListener("click", () => {
  loginUser = !loginUser;
  if (loginUser) {
    loginForm.style.display = "block";
    loginBtn.style.display = "none";
    signupBtn.style.display = "block";
    signupForm.style.display = "none";
    loginForm.addEventListener("submit", e => {
      e.preventDefault();
      const username = loginForm.username.value;
      getUser(username)
        .then(data => {
          if (data.error) {
            alert(data.error);
          } else {
            currentUser = data;
          }
        })
        .then(greeting);
    });
  } else {
    loginForm.style.display = "none";
  }
});

signupBtn.addEventListener("click", () => {
  signupUser = !signupUser;
  if (signupUser) {
    signupForm.style.display = "block";
    signupBtn.style.display = "none";
    loginBtn.style.display = "block";
    loginForm.style.display = "none";
    signupForm.addEventListener("submit", e => {
      e.preventDefault();
      postUserToServer(e)
        .then(data => {
          if (data.error) {
            alert(data.error);
          } else {
            currentUser = data;
          }
        })
        .then(greeting);
    });
  } else {
    signupForm.style.display = "none";
  }
});

//event listener to show/hide the form and add/remove event listener
addBtn.addEventListener("click", () => {
  addBeer = !addBeer;
  if (addBeer) {
    beerForm.style.display = "block";

    addBeerForm.addEventListener("submit", postBeer);
  } else {
    beerForm.style.display = "none";
    addBeerForm.removeEventListener("submit", postBeer);
  }
});

// // current user function
function getUser(username) {
  return fetch(USERS_URL + `/${username}`).then(data => data.json());
}

function postUserToServer(event) {
  event.preventDefault();
  return fetch(USERS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      username: signupForm.username.value
    })
  }).then(data => data.json());
}

function getBeers() {
  return fetch(BEER_URL).then(data => data.json());
}
/// nav bar

const countryDrop = document.querySelector("#country-dropdown");
const styleDrop = document.querySelector("#style-dropdown");

/// filter countries
/// render list of countries to nav bar
fetch(COUNTRY_URL)
  .then(data => data.json())
  .then(countryDropdown);

function countryDropdown(countryArray) {
  countryArray.forEach(country => {
    let countryA = document.createElement("a");
    countryA.className = "dropdown-item";
    countryA.innerText = country.name;
    countryA.name = country.id;
    countryDrop.append(countryA);
    countryA.addEventListener("click", () => {
      getBeers().then(data => {
        showBeers(
          data.filter(beer => beer.country.name === countryA.innerText)
        );
      });
    });
  });
}
/////

////// filter styles
fetch(STYLES_URL)
  .then(data => data.json())
  .then(styleDropdown);

function styleDropdown(styleArray) {
  styleArray.forEach(style => {
    let styleA = document.createElement("a");
    styleA.className = "dropdown-item";
    styleA.innerText = style.name;
    styleA.name = style.id;
    styleDrop.append(styleA);
    styleA.addEventListener("click", () => {
      getBeers().then(data => {
        showBeers(data.filter(beer => beer.style.name === styleA.innerText));
      });
    });
  });
}

//////

// beer card
function makeBeerCard(beer) {
  const div = document.createElement("div");
  div.className = "beer-card";
  div.dataset.id = beer.id;
  $("#beer-collection").scrollspy({ target: "#render-beer" });

  const name = document.createElement("h2");
  name.innerText = beer.name;

  const image = document.createElement("img");
  image.className = "beer-image";
  image.src = beer.image;

  // const brewery = document.createElement("p");
  // brewery.innerText = `Brewery: ${beer.brewery}`;
  // brewery.className = "brewery";

  const viewButton = document.createElement("button");
  viewButton.className = "beer-button";
  viewButton.innerText = "More Details";
  viewButton.setAttribute("border-radius", "50%");

  const stars = document.createElement("p");
  stars.innerHTML = beerStars(beer);

  div.append(name, image, stars, viewButton);
  beerCollection.append(div);

  viewButton.addEventListener("click", () => {
    renderBeer(beer);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function beerStars(beer) {
  let allRatings = beer.reviews.map(review => review.rating);
  let averageRating = Math.round(
    allRatings.reduce((a, b) => a + b) / allRatings.length
  );
  switch (averageRating) {
    case 5:
      return `&#9733; &#9733; &#9733; &#9733; &#9733;`;
      break;
    case 4:
      return `&#9733; &#9733; &#9733; &#9733; &#9734;`;
      break;
    case 3:
      return `&#9733; &#9733; &#9733; &#9734; &#9734;`;
      break;
    case 2:
      return `&#9733; &#9733; &#9734; &#9734; &#9734; `;
      break;
    case 1:
      return `&#9733; &#9734; &#9734; &#9734; &#9734;`;
      break;
    default:
      return `&#9734; &#9734; &#9734; &#9734; &#9734;`;
    }
}

// render all beers
function showBeers(beersArray) {
  beerCollection.innerHTML = "";
  beersArray.map(beer => {
    makeBeerCard(beer);
  });
}

// render one beer information
function renderBeer(beer) {
  const beerRenderDiv = document.querySelector("#render-beer");
  beerRenderDiv.innerHTML = "";
  beerRenderDiv.style.display = "block";
  let beerDiv = document.createElement("div");
  beerDiv.className = "beer-render-div";

  let beerImageDiv = document.createElement("div");

  let beerImg = document.createElement("img");
  beerImg.src = beer.image;
  beerImg.className = "beer-image-single-render";
  beerImageDiv.append(beerImg);

  let beerName = document.createElement("h2");
  beerName.innerText = beer.name;

  let beerRating = document.createElement("p")
  beerRating.innerHTML = beerStars(beer)

  let beerNotes = document.createElement("p");
  beerNotes.innerText = `Notes: ${beer.notes}`;

  let beerCountry = document.createElement("p");
  beerCountry.innerText = `Country: ${beer.country.name}`;

  let beerStyle = document.createElement("p");
  beerStyle.innerText = `Style: ${beer.style.name}`;

  let beerBrewery = document.createElement("p");
  beerBrewery.innerText = `Brewery: ${beer.brewery}`;

  let reviewsBtn = document.createElement("button");
  reviewsBtn.innerText = "Show Reviews";
  reviewsBtn.addEventListener("click", () => {
    reviewCollection.style.display = "block";
    hideReviewsBtn.style.display = "block";
    reviewsBtn.style.display = "none";
  });

  let closeCard = document.createElement("button");
  closeCard.innerText = "x";
  closeCard.className = "close-card";
  closeCard.addEventListener("click", () => {
    beerRenderDiv.style.display = "none"
  })

  let hideReviewsBtn = document.createElement('button')
      hideReviewsBtn.innerText = "Hide Reviews"
      hideReviewsBtn.style.display = "none"
      hideReviewsBtn.addEventListener('click', () => {
        reviewCollection.style.display = "none"
        hideReviewsBtn.style.display = "none"
        reviewsBtn.style.display = "block"
      })

  let reviewCollection = document.createElement('div')
      reviewCollection.className = "review-collection"
      reviewCollection.style.display = "none"

      renderReviews(beer, reviewCollection)
  
  let addReviewBtn = document.createElement('button')
  addReviewBtn.innerText = 'Add Review'
  addReviewBtn.addEventListener('click', () => {
    reviewForm.style.display = "block"
  })
  reviewCollection.append(addReviewBtn)

  let reviewForm = document.createElement('form')
  reviewForm.className = "form-review"
  reviewForm.style.display = "none"
  reviewForm.name = beer.id
  reviewCollection.append(reviewForm)

  let p = document.createElement('p')
  p.innerText = "Rating:"
  p.style.display = "inline-block"
  
  let inputRatingReviewForm = document.createElement('input')
  inputRatingReviewForm.type = "number"
  inputRatingReviewForm.max = "5"
  inputRatingReviewForm.min = "0"
  inputRatingReviewForm.step = "1"
  inputRatingReviewForm.placeholder = "0"
  inputRatingReviewForm.style.display = "inline-block"

  let p2 = document.createElement('p')
  p2.innerText = "Review:"

  let inputTextReviewForm = document.createElement('textarea')
  inputTextReviewForm.rows = "5"
  inputTextReviewForm.cols = "68"
  inputTextReviewForm.placeholder = `Review ${beer.name}...`

  let submitReviewBtn = document.createElement('button')
  submitReviewBtn.innerText = "Submit"
  submitReviewBtn.style.display = "Block"
  reviewForm.addEventListener("submit", postReview)
  
  function postReview(e) {
    e.preventDefault();
    const target = e.target;
    const review = {
      user_id: currentUser.id,
      beer_id: Number(reviewForm.name),
      rating: Number(reviewForm[0].value),
      review_content: reviewForm[1].value
    };

    postReviewToServer(review)
      .then(reviewData => reviewData.json())
      .then(review => {
        reviewForm.reset();
        // beer.reviews.push(review)
        renderReview(review, reviewCollection);
      });
  }

  function renderReview (review, reviewCollection) {
    let reviewCard = document.createElement('div')
    reviewCard.className = "review-card"
    let reviewImageDiv = document.createElement('div')
    let reviewImg = document.createElement('img')
      reviewImg.src = "https://i.imgur.com/klpkZ5N.png"
      reviewImg.className = "review-image-single-render"
      reviewImageDiv.append(reviewImg)
    let rating = document.createElement('P')
    rating.innerHTML = reviewStar(review.rating)
    let pReview = document.createElement('p')
    pReview.className = "review-content"
    pReview.innerText = `Review: ${review.review_content}`
    let user = document.createElement('p')
    user.innerText = `By ${review.username}`
    user.className = "review-by-user"
    reviewCard.append(reviewImageDiv, rating, pReview, user)
    reviewCollection.prepend(reviewCard)
  }

  function reviewStar(rating) {
    switch (rating) {
      case 5:
        return `&#9733; &#9733; &#9733; &#9733; &#9733;`;
        break;
      case 4:
        return `&#9733; &#9733; &#9733; &#9733; &#9734;`;
        break;
      case 3:
        return `&#9733; &#9733; &#9733; &#9734; &#9734;`;
        break;
      case 2:
        return `&#9733; &#9733; &#9734; &#9734; &#9734; `;
        break;
      case 1:
        return `&#9733; &#9734; &#9734; &#9734; &#9734;`;
        break;
      default:
        return `&#9734; &#9734; &#9734; &#9734; &#9734;`;
    }
  };


  function renderReviews(beer, reviewCollection) {
    beer.reviews.forEach(review => renderReview(review, reviewCollection));
  }

  function postReviewToServer(review) {
    return fetch(REVIEWS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(review)
    });
  }

  reviewForm.append(
    p,
    inputRatingReviewForm,
    p2,
    inputTextReviewForm,
    submitReviewBtn
  );

  beerDiv.append(
    closeCard,
    beerImageDiv,
    beerName,
    beerRating,
    beerCountry,
    beerBrewery,
    beerStyle,
    beerNotes,
    reviewsBtn,
    hideReviewsBtn,
    reviewCollection
  );
  beerRenderDiv.append(beerDiv);
}

//rendering countries to form

fetch(COUNTRY_URL)
  .then(data => data.json())
  .then(countriesArray);

// iterating over countries array and passing into form
function countriesArray(array) {
  array.forEach(country => {
    let countryOption = document.createElement("option");
    countryOption.innerText = country.name;
    countryOption.value = country.id;
    formCountries.appendChild(countryOption);
  });
}

//rendering styles to form

fetch(STYLES_URL)
  .then(data => data.json())
  .then(stylesArray);

// iterating over styles array and passing into form
function stylesArray(array) {
  array.forEach(style => {
    let stylesOption = document.createElement("option");
    stylesOption.innerText = style.name;
    stylesOption.value = style.id;
    formStyle.appendChild(stylesOption);
  });
}

// create a beer

function postBeer(e) {
  // debugger
  e.preventDefault();
  const target = e.target;
  const beer = {
    name: addBeerForm[0].value,
    image: addBeerForm[1].value,
    brewery: addBeerForm[2].value,
    notes: addBeerForm[3].value,
    abv: addBeerForm[4].value,
    style_id: addBeerForm[5].value,
    country_id: addBeerForm[6].value
  };

  postBeerToServer(beer)
    .then(beerData => beerData.json())
    // .then(data => {
    //   console.log(data);
    //   return data;
    // })
    .then(beer => {
      makeBeerCard(beer);
      addBeerForm.reset();
    });
}

// connections to the server
function postBeerToServer(beer) {
  return fetch(BEER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(beer)
  });
}

const searchBar = document.forms["search-bar-form"].querySelector("input");
searchBar.addEventListener("keyup", function(e) {
  let term = e.target.value.toLowerCase();
  let beers = document.getElementsByClassName("beer-card");
  Array.from(beers).forEach(function(beer) {
    let name = beer.firstElementChild.textContent;
    if (name.toLowerCase().indexOf(term) != -1) {
      beer.style.display = "inline-block";
    } else {
      beer.style.display = "none";
    }
  });
});

// initialize page

function init() {
  fetch(BEER_URL)
    .then(data => data.json())
    .then(showBeers);
}

init();
