const selectDirBtn = document.getElementById("select-directory");
selectDirBtn?.addEventListener("click", async () => {
  const path = await window.api.openFileDialog();
  document.getElementById("selected-file").innerHTML = `You selected: ${path}`;
});

const imageContainer = document.getElementById("image-container");

// const buttonTest = document.getElementById("button-fetch-images");
// buttonTest.addEventListener("click", async () => {
//   const pathToImages = await window.api.fetchLayerImages("layers");
//   console.log(pathToImages);
// });

window.api
  .fetchLayerImages("layers")
  .then((imagePaths) => {
    for (const imagePath of imagePaths) {
      window.api
        .convertImageToBase64(imagePath)
        .then((base64) => {
          // const image = document.createElement("img");
          // image.src = "data:image/jpeg;base64," + base64;
          // imageContainer.appendChild(image);
        })
        .catch((error) => {});
    }
  })
  .catch((error) => {});
