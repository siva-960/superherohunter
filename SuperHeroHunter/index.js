//using timestamp privatekey and publickey and  hashcode we are sending unique and secure API request to Marvel server.
var currentTimestamp = new Date().getTime();
const publicKey = "f8a1924933955c7afca198d5f8d15804";
const privateKey = "d35ef0f35cf495dfc3be329851a32ae129bc2912";
// Calculate MD5 hash
const hash = CryptoJS.MD5(currentTimestamp + privateKey + publicKey).toString();
console.log(hash);
const parameters=`ts=${currentTimestamp}&apikey=${publicKey}&hash=${hash}`;
// Construct the URL with the correct hash
const baseUrl = `https://gateway.marvel.com:443/v1/public/characters?limit=36&${parameters}`;
console.log(baseUrl);
//const url=`http://gateway.marvel.com/v1/public/characters/1011334?${parameters}`;

let allImages;
//getting image-container
let imageContainer= document.querySelector(".image-container");

//function to render fetched images
const renderImages=(imageCollection)=>{
    //getting all child div of image-container
    console.log("length"+imageCollection.length);
    console.log(imageCollection);
    let imageCells=imageContainer.children;
    console.log(imageCells);
    var nextImage=0;
    imageCollection.forEach((image)=>{
      if(!image.thumbnail.path.includes("image_not_available") && image.thumbnail.extension=="jpg" && nextImage<18){
        //adding cards to web page
        imageCells[nextImage++].innerHTML=card(image);
      }
    });
};





//rendeering images to our GUI
const card=(image)=>{
  console.log(image.name);
  return `
        <div class="card">
              <div class="fav" id=${image.id} ><i class="fa-regular fa-heart"></i></div>
              <div class="card-image"> <img  id="${image.id}" class="click-event ${image.name}" src="${image.thumbnail.path}.${image.thumbnail.extension}" alt="${image.name} Image"></div>
              <div class="card-details">${image.name}</div>
      </div>
  `;
}

  // event on page load loadsimages when our web pageloads 
  window.addEventListener('load',()=>{
    //fetching images from api
    fetchCharacters(baseUrl);
   
  });

  //fetching characters images from Marvel API
  const fetchCharacters=(url)=>{

    allImages=fetch(url)
    .then(response =>response.json())
    .then(data => {
      console.log(data);
      renderImages(data.data.results);
    })
    .then(()=>{
       //rmembering fav cards
      let favs=JSON.parse(localStorage.getItem("favImages"));
      if(favs!==null)
      favs.forEach((fav)=>{
       console.log(fav.imageName+"......");
       console.log(fav.imageId+"......");
       let favIcon=document.getElementById(fav.imageId);
       console.log(favIcon+"......");
       if(favIcon!=null)
       favIcon.style.color="red";
      });
    })
    .then(()=>{
      console.log(document.getElementsByClassName("fav"));
      let fav=document.getElementsByClassName("fav");
      for(let i=0;i<fav.length;i++){
        //event hadiling for fav icon 
        fav[i].addEventListener("click",(event)=>{
          let card=event.target.closest(".card");
          let img=card.querySelector(".click-event");
          let favIcon=card.querySelector(".fav");
          console.log(img);
          let imageName=img.getAttribute("alt");
          let imagePath=img.getAttribute("src");
          let imageId=favIcon.getAttribute("id");
          console.log(imageId);
          console.log(imageName);
          console.log(imagePath);
          let imageObject={
            imageName:imageName,
            imagePath:imagePath,
            imageId:imageId
          };
          let existingImages=JSON.parse(localStorage.getItem("favImages")) || [];
          if(fav[i].style.color==="red" && existingImages.length>=1)
          {
            console.log("hello");
            existingImages=existingImages.filter((image)=>{
              return image.imageId!==imageObject.imageId;
            });
            fav[i].style.color="whitesmoke";
          }else{
            existingImages.push(imageObject);
            fav[i].style.color="red";
          }
          localStorage.setItem("favImages",JSON.stringify(existingImages));
          console.log(existingImages);
        });
      }
    })
    .catch(error => {console.error('Error:', error.message)});
    console.log(allImages);

  }


  //searching of characters 
  const search=document.getElementById("search-string");
  search.addEventListener("keydown",(event)=>{
    if(event.key==="Enter"){
      let searchString=search.value;
      console.log(searchString);
      if(searchString!=""){
        fetchCharacters(baseUrl+`&nameStartsWith=${searchString}`);
      }
    }
  });

 
  
//registering images to click events  and calling respective image card when clicked 
const imageBox=document.querySelector(".image-container");

imageBox.addEventListener("click", (event)=>{
  if(event.target.classList.contains('click-event')){
    console.log("image-clicked");
    let src=event.target.getAttribute("src");
    let id=event.target.getAttribute("id");
    imageBox.style.opacity="0.5"; 
    profile(src,id,name);
  }
});

// fetching profile of indivudual characters 
const profile=(src,id,name)=>{
  const characterObject={};
  const url=baseUrl.split("?");
  console.log(url[0]+`/${id}?${parameters}`);
  fetch(url[0]+`/${id}?${parameters}`)
  .then(response =>response.json())
    .then(data => {
      console.log(data);
      characterObject.name=data.data.results[0].name;
      characterObject.description=data.data.results[0].description;
      characterObject.series=data.data.results[0].series.available;
      characterObject.stories=data.data.results[0].stories.available;
      characterObject.comics=data.data.results[0].comics.available;
      console.log(data.data.results[0].comics.available);
      console.log(characterObject.description);
      profileTemplate(src,characterObject);
    }).then(()=>{
      console.log(document.getElementById("profile"));
      document.getElementById("profile").addEventListener("click",()=>{
        document.getElementById("profile").remove();
        imageBox.style.opacity="1"; 
      })
    })
    .catch(error => {console.error('Error:', error.message)});
};
// rendering profile html template
const profileTemplate=(src,characterObject)=>{
  let htmlTemplate= `
  <div id="profile">
    <div class="profile-image">
      <image src="${src}">
    </div>
    <div class="profile-details">
      <h1>Name:${characterObject.name}</h1>
      <h2> No.of Stories:${characterObject.stories}</h2>
      <h2> No.Of comics:${characterObject.comics}</h2>
      <h2> No.of series:${characterObject.series}</h2>
      <h2> ${characterObject.description!==null ? characterObject.description:""}
    </div>
  </div>
`;
document.body.insertAdjacentHTML("afterend", htmlTemplate);
};





