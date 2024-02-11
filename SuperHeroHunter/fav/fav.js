window.addEventListener("load",()=>{
    let existingImages=JSON.parse(localStorage.getItem("favImages")) || [];
    let imageTemplate=document.querySelector(".image-template");
    if(existingImages.length>=1)
    existingImages.forEach((image)=>{
        imageTemplate.innerHTML+=favHtmlTemplate(image);
    });
    let card=document.querySelectorAll(".image-container");
    console.log(card);
    if(card.length>=1){
        card.forEach((card)=>{
            card.addEventListener(("click"),()=>{
                let id=card.getAttribute("id");
                card.remove();
                existingImages=existingImages.filter((image)=>{
                    console.log(image.imageId+"  "+id);
                    return image.imageId!==id;
                  });
                  localStorage.setItem("favImages",JSON.stringify(existingImages));
            });
        });
    }
});

const favHtmlTemplate=(image)=>{
    console.log(image.imageId+"........");
    return `
        <div id="${image.imageId}" class="image-container" >
        <img class="image" src="${image.imagePath}">
        <div>${image.imageName}</div>
        </div>
    `;
}