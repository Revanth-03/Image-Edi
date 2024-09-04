document.getElementById("searchButton").addEventListener("click", fetchImages);
const canvas = new fabric.Canvas("imageCanvas");

function fetchImages() {
  const query = document.getElementById("searchQuery").value;
  if (!query) {
    alert("Please enter a search query");
    return;
  }

  fetch(
    `https://pixabay.com/api/?key=33586568-e7a25e50ce25c4b8dd85fa713&q=${encodeURIComponent(
      query
    )}&image_type=photo`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => displayImages(data.hits, query)) // Pass query to displayImages
    .catch((error) => console.error("Error fetching images:", error));
}

function displayImages(images, query) {
  const imageResults = document.getElementById("imageResults");
  imageResults.innerHTML = ""; // Clear previous results

  images.forEach((image) => {
    const imageContainer = document.createElement("div");
    imageContainer.classList.add("image-container");
    const imgElement = document.createElement("img");
    imgElement.src = image.previewURL;
    imgElement.alt = query;

    const button = document.createElement("button");
    button.classList.add("add-caption");
    button.textContent = "Add Captions";

    button.addEventListener("click", () => {
      console.log(image);

      const canvasUrl = `canvas.html?imageUrl=${encodeURIComponent(
        image.webformatURL
      )}`;

      window.open(canvasUrl, "_self");
      canvas.clear();
      addImageToCanvas(image.webformatURL);
    });

    imageContainer.appendChild(imgElement);
    imageContainer.appendChild(button);

    imageResults.appendChild(imageContainer);
  });
}

function addImageToCanvas(imageUrl) {
  fabric.Image.fromURL(
    imageUrl,
    (img) => {
      canvas.clear();

      // Calculate the appropriate scale factor to maintain aspect ratio
      const scaleFactor = Math.min(450 / img.height, canvas.width / img.width);

      img.set({
        left: 0,
        top: 0,
        scaleX: scaleFactor,
        scaleY: scaleFactor,
      });

      canvas.add(img);
      canvas.renderAll();

      document.getElementById("canvasContainer").style.display = "block";

      // Add interactivity to add text or shapes
      setupCanvasControls(canvas);
    },
    { crossOrigin: "anonymous" } // Set the crossOrigin attribute
  );
}
