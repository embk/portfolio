const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let colors = [];
let showGrid = false; // Variable zum Speichern des Raster-Status
let gridColors = []; // Array zum Speichern der Farben im Raster
let selectedColor = null; // Variable für die ausgewählte Farbe
let previouslySelectedSwatch = null; // Variable zur Speicherung des zuletzt ausgewählten Swatches

// zählt die Häufigkeit von Farben in einer Sammlung und gibt ein Objekt zurück,
// das die Anzahl der Vorkommen jeder Farbe speichert
function countColorCells() {
  const colorCounts = {};

  gridColors.forEach((color) => {
    const colorKey = color.rgb.join(",");
    if (!colorCounts[colorKey]) {
      colorCounts[colorKey] = 0;
    }
    colorCounts[colorKey]++;
  });

  return colorCounts;
}

// konvertiert RGB Farben zu HSL Farben
function rgbToHsl(rgb) {
  let [r, g, b] = rgb.map((x) => x / 255.0);
  let max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2.0;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2.0 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return [h * 360, s * 100, l * 100];
}

// konvertiert HSL Farben zu RGB Farben
function hslToRgb(hsl) {
  let [h, s, l] = hsl;
  s /= 100;
  l /= 100;

  let c = (1 - Math.abs(2 * l - 1)) * s;
  let x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  let m = l - c / 2;
  let r = 0,
    g = 0,
    b = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return [r, g, b];
}

// erzeugt eine Farbpalette basierend auf dem angegebenen Farbharmonie-Typ (harmonyType)
// und der Basisfarbe (baseHsl)
function calculateHarmony(baseHsl, harmonyType, colorCount) {
  let harmonies = [];

  switch (harmonyType) {
    case "complementary":
      harmonies.push(baseHsl);
      harmonies.push([(baseHsl[0] + 180) % 360, baseHsl[1], baseHsl[2]]);
      break;

    case "analogous":
      harmonies.push(baseHsl);
      harmonies.push([(baseHsl[0] - 30 + 360) % 360, baseHsl[1], baseHsl[2]]);
      harmonies.push([(baseHsl[0] + 30) % 360, baseHsl[1], baseHsl[2]]);
      break;

    case "triadic":
      harmonies.push(baseHsl);
      harmonies.push([(baseHsl[0] + 120) % 360, baseHsl[1], baseHsl[2]]);
      harmonies.push([(baseHsl[0] + 240) % 360, baseHsl[1], baseHsl[2]]);
      break;

    case "tetradic":
    case "square":
      harmonies.push(baseHsl);
      harmonies.push([(baseHsl[0] + 90) % 360, baseHsl[1], baseHsl[2]]);
      harmonies.push([(baseHsl[0] + 180) % 360, baseHsl[1], baseHsl[2]]);
      harmonies.push([(baseHsl[0] + 270) % 360, baseHsl[1], baseHsl[2]]);
      break;

    case "monochromatic":
      harmonies.push(baseHsl); // Originalfarbe hinzufügen
      harmonies.push([
        baseHsl[0],
        Math.max(0, Math.min(baseHsl[1] * 0.8, 100)),
        Math.max(0, Math.min(baseHsl[2] * 1.2, 100)),
      ]);
      break;

    case "split-complementary":
      harmonies.push(baseHsl);
      harmonies.push([(baseHsl[0] + 150) % 360, baseHsl[1], baseHsl[2]]);
      harmonies.push([(baseHsl[0] + 210) % 360, baseHsl[1], baseHsl[2]]);
      break;
  }

  return harmonies;
}

// sucht die dem angegebenen Farbwert (hsl) am nächsten liegende Farbe
// aus einer vordefinierten Liste von Farben (predefinedColors)
function findClosestColor(hsl) {
  let minDistance = Infinity;
  let closestColor = null;

  predefinedColors.forEach((color) => {
    let colorHsl = rgbToHsl(color.rgb);
    let distance = Math.sqrt(
      Math.pow(hsl[0] - colorHsl[0], 2) +
        Math.pow(hsl[1] - colorHsl[1], 2) +
        Math.pow(hsl[2] - colorHsl[2], 2)
    );

    if (distance < minDistance) {
      minDistance = distance;
      closestColor = color;
    }
  });

  return closestColor;
}

// berechnet eine Reihe von Farben, die harmonisch zur Basisfarbe passen.
// Sie verwendet dabei die Farbtheorie, um Farben zu generieren, die gut zusammenarbeiten und visuell ansprechend sind.
function getHarmoniousColors(baseColor, harmonyType, colorCount) {
  const baseHsl = rgbToHsl(baseColor.rgb);
  const harmonies = calculateHarmony(baseHsl, harmonyType, colorCount);

  const selectedColors = harmonies
    .slice(0, colorCount)
    .map((hsl) => findClosestColor(hsl));

  return selectedColors;
}

// aktualisiert die verfügbaren Optionen in einem Dropdown-Menü (color-count)
// basierend auf dem ausgewählten Typ der Farbharmonie, der in einem anderen Dropdown-Menü (harmony-select) ausgewählt ist
function updateColorCountOptions() {
  const harmonyType = document.getElementById("harmony-select").value;
  const colorCountSelect = document.getElementById("color-count");

  colorCountSelect.innerHTML = "";

  let minColors, maxColors;
  switch (harmonyType) {
    case "monochromatic":
      minColors = 2;
      maxColors = 2;
      break;
    case "random":
      minColors = 2;
      maxColors = 10;
      break;
    case "complementary":
      minColors = 2;
      maxColors = 2;
      break;
    case "analogous":
      minColors = 3;
      maxColors = 3;
      break;
    case "triadic":
      minColors = 3;
      maxColors = 3;
      break;
    case "tetradic":
    case "square":
      minColors = 4;
      maxColors = 4;
      break;
    case "split-complementary":
      minColors = 3;
      maxColors = 3;
      break;
  }

  // Create options based on the allowed range of colors
  for (let i = minColors; i <= maxColors; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    colorCountSelect.appendChild(option);
  }

  // Hier wird die Funktion aufgerufen, um die Sichtbarkeit der Checkbox zur %-Verteilung der Farben zu steuern
  toggleDistributionCheckbox(); // Hinzufügen der neuen Funktion
}

// erzeugt eine Liste zufälliger Farben in HSL (Farbton, Sättigung, Helligkeit) und konvertiert
// diese Farben in die am nächsten liegende definierte Farbe
function generateRandomColors(colorCount) {
  const randomColors = [];
  for (let i = 0; i < colorCount; i++) {
    const randomColor = [
      Math.floor(Math.random() * 360),
      Math.floor(Math.random() * 100),
      Math.floor(Math.random() * 100),
    ];
    randomColors.push(randomColor);
  }
  return randomColors.map((hsl) => findClosestColor(hsl));
}

// aktualisiert die Optionen eines Dropdown-Menüs (<select>-Element)
// auf einer Webseite, das als Auswahlmöglichkeit für eine Basisfarbe dient
function updateBaseColorOptions() {
  const baseColorSelect = document.getElementById("base-color-select");
  baseColorSelect.innerHTML = "<option value='random'>Random</option>"; // Reset options and add random

  predefinedColors.forEach((color, index) => {
    const option = document.createElement("option");
    option.value = index; // Using the index to identify the color
    option.textContent = color.description;
    baseColorSelect.appendChild(option);
  });
}

// blendet add neutral colours checkbox aus, wenn checkbox: harmonous Activate harmonious color distribution:
// aktiviert ist
// Fügt einen Event Listener zur 'Activate Harmonious Color Distribution'-Checkbox hinzu
document
  .getElementById("enable-distribution")
  .addEventListener("change", function () {
    const neutralCheckbox = document.getElementById(
      "neutral-checkbox-container"
    );

    if (this.checked) {
      neutralCheckbox.style.display = "none"; // Blendet die 'Add Neutral Colour'-Checkbox aus
    } else {
      neutralCheckbox.style.display = "block"; // Zeigt die 'Add Neutral Colour'-Checkbox wieder an
    }
  });

// generiert eine neue Palette von Farben basierend auf Benutzereingaben und Einstellungen auf der Webseite
function generateNewColors() {
  const harmonyType = document.getElementById("harmony-select").value;
  const colorCount = parseInt(document.getElementById("color-count").value);
  const baseColorIndex = document.getElementById("base-color-select").value;

  const includeNeutral = document.getElementById("neutral-checkbox").checked;

  let newColors = [];

  // Determine the base color
  let baseColor;
  if (baseColorIndex === "random") {
    baseColor =
      predefinedColors[Math.floor(Math.random() * predefinedColors.length)];
  } else {
    baseColor = predefinedColors[parseInt(baseColorIndex)];
  }

  if (harmonyType === "random") {
    newColors = generateRandomColors(colorCount);
  } else {
    const randomBaseColor =
      predefinedColors[Math.floor(Math.random() * predefinedColors.length)];
    newColors = getHarmoniousColors(baseColor, harmonyType, colorCount);
  }

  if (includeNeutral) {
    const randomNeutral =
      neutralColors[Math.floor(Math.random() * neutralColors.length)];
    newColors.push(randomNeutral);
  }

  colors = newColors;
  //previouslySelectedSwatch = null; // Rücksetzen der Auswahl, da die Farben neu generiert wurden
  generatePattern();
}

// steuert die Darstellung eines Rasters auf einer Canvas-Fläche
function toggleGrid() {
  showGrid = document.getElementById("show-grid").checked;

  if (showGrid) {
    drawGrid(
      parseInt(document.getElementById("grid-width").value),
      parseInt(document.getElementById("grid-height").value),
      canvas.width / parseInt(document.getElementById("grid-width").value),
      canvas.height / parseInt(document.getElementById("grid-height").value)
    );
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (
      let y = 0;
      y < parseInt(document.getElementById("grid-height").value);
      y++
    ) {
      for (
        let x = 0;
        x < parseInt(document.getElementById("grid-width").value);
        x++
      ) {
        const color =
          gridColors[
            y * parseInt(document.getElementById("grid-width").value) + x
          ];
        ctx.fillStyle = `rgb(${color.rgb.join(",")})`;
        ctx.fillRect(
          x *
            (canvas.width /
              parseInt(document.getElementById("grid-width").value)),
          y *
            (canvas.height /
              parseInt(document.getElementById("grid-height").value)),
          canvas.width / parseInt(document.getElementById("grid-width").value),
          canvas.height / parseInt(document.getElementById("grid-height").value)
        );
      }
    }
  }
}

// steuert die Sichtbarkeit und den Zustand eines Kontrollkästchens (Checkbox) auf der
// Webseite basierend auf den aktuellen Auswahlmöglichkeiten in der Benutzeroberfläche
function toggleDistributionCheckbox() {
  const harmonyType = document.getElementById("harmony-select").value;
  const colorCount = parseInt(document.getElementById("color-count").value);
  const distributionOption = document.getElementById("distribution-option");

  if (harmonyType != "random") {
    distributionOption.style.display = "block";
  } else {
    distributionOption.style.display = "none";
    document.getElementById("enable-distribution").checked = false;
  }
}

// sorgt dafür, dass bestimmte Aktionen nach dem vollständigen Laden des DOMs (Document Object Model) ausgeführt werden
document.addEventListener("DOMContentLoaded", () => {
  // Ruft die Funktion auf, um die Farboptionen zu aktualisieren, sobald das DOM geladen ist
  updateBaseColorOptions();

  //   ermöglicht es, Zellen durch Klicken zu färben. Dabei wird die Zelle bestimmt, die angeklickt wurde,
  //   die Farbe in der Zelle aktualisiert und die Information über die Farbverteilung auf der Seite aktualisiert
  canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const xOffset = event.clientX - rect.left;
    const yOffset = event.clientY - rect.top;
    const cellX = Math.floor(
      xOffset /
        (canvas.width / parseInt(document.getElementById("grid-width").value))
    );
    const cellY = Math.floor(
      yOffset /
        (canvas.height / parseInt(document.getElementById("grid-height").value))
    );

    if (selectedColor) {
      ctx.fillStyle = `rgb(${selectedColor.rgb.join(",")})`;
      ctx.fillRect(
        cellX *
          (canvas.width /
            parseInt(document.getElementById("grid-width").value)),
        cellY *
          (canvas.height /
            parseInt(document.getElementById("grid-height").value)),
        canvas.width / parseInt(document.getElementById("grid-width").value),
        canvas.height / parseInt(document.getElementById("grid-height").value)
      );
      gridColors[
        cellY * parseInt(document.getElementById("grid-width").value) + cellX
      ] = selectedColor;

      displayColorInfo(
        parseInt(document.getElementById("grid-width").value),
        parseInt(document.getElementById("grid-height").value),
        canvas.width / parseInt(document.getElementById("grid-width").value),
        canvas.height / parseInt(document.getElementById("grid-height").value)
      );
    }
  });
});

// erstellt und zeichnet ein Rastermuster auf einem Canvas-Element,
// basierend auf den aktuell ausgewählten Einstellungen und Farben
function generatePattern() {
  const gridWidth = parseInt(document.getElementById("grid-width").value);
  const gridHeight = parseInt(document.getElementById("grid-height").value);
  const cellWidth = canvas.width / gridWidth;
  const cellHeight = canvas.height / gridHeight;
  const harmonyTyp = document.getElementById("harmony-select").value;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  gridColors = []; // Array zurücksetzen

  // Farbanteile definieren
  const enableDistribution = document.getElementById(
    "enable-distribution"
  ).checked;

  let distributionColors = [];
  if (
    enableDistribution &&
    (harmonyTyp === "triadic" || harmonyTyp === "split-complementary")
  ) {
    const totalCells = gridWidth * gridHeight;
    const dominantCount = Math.floor(totalCells * 0.6);
    const secondaryCount = Math.floor(totalCells * 0.3);
    const accentCount = totalCells - dominantCount - secondaryCount;

    distributionColors = [
      ...Array(dominantCount).fill(colors[0]),
      ...Array(secondaryCount).fill(colors[1]),
      ...Array(accentCount).fill(colors[2]),
    ];
  } else if (
    enableDistribution &&
    (harmonyTyp === "monochromatic" ||
      harmonyTyp === "complementary" ||
      harmonyTyp === "analogous")
  ) {
    const totalCells = gridWidth * gridHeight;
    const baseColorCount = Math.floor(totalCells * 0.7);
    const secondaryCount = totalCells - baseColorCount;

    distributionColors = [
      ...Array(baseColorCount).fill(colors[0]),
      ...Array(secondaryCount).fill(colors[1]),
    ];
  } else if (
    enableDistribution &&
    (harmonyTyp === "tetradic" || harmonyTyp === "square")
  ) {
    const totalCells = gridWidth * gridHeight;
    const baseColorCount = Math.floor(totalCells * 0.25);
    const secondaryColorCount = Math.floor(totalCells * 0.25);
    const thirdColorCount = Math.floor(totalCells * 0.25);
    const fourthColorCount =
      totalCells - baseColorCount - secondaryColorCount - thirdColorCount;

    distributionColors = [
      ...Array(baseColorCount).fill(colors[0]),
      ...Array(secondaryColorCount).fill(colors[1]),
      ...Array(thirdColorCount).fill(colors[2]),
      ...Array(fourthColorCount).fill(colors[3]),
    ];
  }

  if (enableDistribution) {
    distributionColors = distributionColors.sort(() => Math.random() - 0.5);
  }

  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      let color;
      if (distributionColors.length > 0) {
        color = distributionColors.pop();
      } else {
        color = colors[Math.floor(Math.random() * colors.length)];
      }
      gridColors.push(color);

      // Zeichne das Rasterfeld
      const xPos = x * cellWidth;
      const yPos = y * cellHeight;

      ctx.fillStyle = `rgb(${color.rgb.join(",")})`;
      ctx.fillRect(xPos, yPos, cellWidth, cellHeight);
    }
  }

  if (showGrid) {
    drawGrid(gridWidth, gridHeight, cellWidth, cellHeight);
  }

  displayColorInfo(gridWidth, gridHeight, cellWidth, cellHeight);
}

// zeichnet ein Raster auf einem Canvas-Element
function drawGrid(gridWidth, gridHeight, cellWidth, cellHeight) {
  ctx.strokeStyle = "#000"; // Rasterfarbe
  ctx.lineWidth = 1; // Linienbreite

  for (let x = 0; x <= gridWidth; x++) {
    ctx.beginPath();
    ctx.moveTo(x * cellWidth, 0);
    ctx.lineTo(x * cellWidth, canvas.height);
    ctx.stroke();
  }

  for (let y = 0; y <= gridHeight; y++) {
    ctx.beginPath();
    ctx.moveTo(0, y * cellHeight);
    ctx.lineTo(canvas.width, y * cellHeight);
    ctx.stroke();
  }
}

// zeigt Informationen zu den Farben an, die in einem Raster verwendet werden,
// und ermöglicht eine visuelle Interaktion mit diesen Farben
function displayColorInfo(gridWidth, gridHeight, cellWidth, cellHeight) {
  console.log("displayColorInfo aufgerufen");
  const colorInfoDiv = document.getElementById("color-info");
  colorInfoDiv.innerHTML = "";

  const colorCounts = countColorCells();

  colors.forEach((color) => {
    const colorKey = color.rgb.join(",");
    const cellCount = colorCounts[colorKey] || 0;

    const colorBox = document.createElement("div");
    colorBox.className = "color-box";

    const colorSwatch = document.createElement("div");
    colorSwatch.className = "color-swatch";
    colorSwatch.style.backgroundColor = `rgb(${color.rgb.join(",")})`;

    const colorLabel = document.createElement("div");
    colorLabel.className = "color-label";
    colorLabel.innerHTML = `<strong>${
      color.description
    }</strong><br>${cellCount} blocks in size ${cellWidth.toFixed(
      2
    )} x ${cellHeight.toFixed(2)} mm`;

    // Debugging-Ausgabe
    console.log(
      "Currently selected swatch background:",
      previouslySelectedSwatch
        ? previouslySelectedSwatch.style.backgroundColor
        : "None"
    );
    console.log(
      "Current swatch background:",
      colorSwatch.style.backgroundColor
    );

    // Setze initial die Umrandung auf keine, außer der Swatch war vorher ausgewählt
    if (
      previouslySelectedSwatch &&
      previouslySelectedSwatch.style.backgroundColor ===
        colorSwatch.style.backgroundColor
    ) {
      colorSwatch.style.border = "2px solid red";
    } else {
      colorSwatch.style.border = "2px solid transparent";
    }

    // Registriere Klick-Events für Farb-Swatch
    colorSwatch.addEventListener("click", () => {
      // Entferne die rote Umrandung von allen Swatches
      const allSwatches = document.querySelectorAll(".color-swatch");
      allSwatches.forEach((swatch) => {
        swatch.style.border = "2px solid transparent";
      });

      // Setze die rote Umrandung auf die ausgewählte Swatch
      selectedColor = color; // Speichere die ausgewählte Farbe
      previouslySelectedSwatch = colorSwatch; // Speichere den ausgewählten Swatch

      colorSwatch.style.border = "2px solid red"; // Visuelles Feedback
    });

    colorBox.appendChild(colorSwatch);
    colorBox.appendChild(colorLabel);

    colorInfoDiv.appendChild(colorBox);
  });
}

// aktualisiert die Anzeige der Größe des Canvas-Elements auf der Benutzeroberfläche
function updateCanvasSizeDisplay() {
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;

  const sizeInfoDiv = document.getElementById("canvas-size-info");
  sizeInfoDiv.textContent = `Quilt Size: ${canvasWidth}mm x ${canvasHeight}mm`;
  sizeInfoDiv.style.margin = "40px 0 0 20px";
}

// wird verwendet, um die Größe des Canvas-Elements auf einer Webseite zu ändern
function updateCanvasSize() {
  const widthInput = document.getElementById("canvas-width");
  const heightInput = document.getElementById("canvas-height");

  const width = parseInt(widthInput.value, 10);
  const height = parseInt(heightInput.value, 10);

  // Überprüfen, ob die Werte gültige Zahlen sind
  if (isNaN(width) || isNaN(height)) {
    alert("Bitte geben Sie gültige Zahlen ein.");
    return;
  }

  // Überprüfen, ob die Werte die maximalen Grenzen überschreiten
  if (width > 2590 || height > 2540) {
    alert(
      "Bitte wählen Sie Zahlen kleiner oder gleich 2590 Breite und 2540 Höhe."
    );
    // Setzen der Werte zurück auf den maximalen Wert
    widthInput.value = Math.min(width, 2590);
    heightInput.value = Math.min(height, 2540);
    return;
  }

  // Überprüfen, ob die Werte die minimalen Grenzen überschreiten
  if (width < 100 || height < 100) {
    alert("Bitte wählen Sie Zahlen gößer oder gleich 100 sind.");
    // Setzen der Werte zurück auf den minimalen Wert
    widthInput.value = Math.min(width, 100);
    heightInput.value = Math.min(height, 100);
    return;
  }

  // Update der Canvas-Größe
  // const canvas = document.getElementById("canvas");
  canvas.width = width;
  canvas.height = height;

  // Reset the canvas CSS styles to match the new size
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  // Optional: Generiere ein neues Muster oder andere Canvas-Inhalte
  generatePattern();
  updateCanvasSizeDisplay(); // Update the size display
}

// ermöglicht es dem Benutzer, den aktuellen Inhalt des Canvas-Elements als Bilddatei herunterzuladen
function saveCanvas() {
  const link = document.createElement("a");
  link.download = "pattern.png";
  link.href = canvas.toDataURL();
  link.click();
}

// Funktion zum Öffnen des Modals für die Eingabe des Titels für die Speicherung
//des png
// function openModal() {
//   document.getElementById("title-modal").style.display = "flex";
// }

function openModal() {
  const titleInput = document.getElementById("title-input");

  // Platzhalter-Wort als Titel vorausfüllen
  const placeholderTitle = "V01";

  // Vorausgefülltes Wort in das Titel-Eingabefeld setzen
  titleInput.value = placeholderTitle;

  // Modal anzeigen
  document.getElementById("title-modal").style.display = "flex";
}

// Funktion zum Schließen des Modals
function closeModal() {
  document.getElementById("title-modal").style.display = "none";
}

// Funktion zum Einreichen des Titels
function submitTitle() {
  const title = document.getElementById("title-input").value;
  if (title.trim() !== "") {
    saveCanvasWithColorInfo(title);
    closeModal();
  } else {
    alert("Please enter a title.");
  }
}

// speichert das aktuelle Canvas-Bild zusammen mit Informationen
// über die verwendeten Farben in einer PNG-Datei
function saveCanvasWithColorInfo(title) {
  const canvasElement = document.getElementById("canvas");
  const colorInfoDiv = document.getElementById("color-info");

  // Dimensionen des Canvas
  const originalCanvasWidth = canvasElement.width;
  const originalCanvasHeight = canvasElement.height;
  const colorInfoBoxes = colorInfoDiv.querySelectorAll(".color-box");

  // Maximale Breite für DIN-A4 in Pixeln (z.B. bei 300 DPI)
  const maxA4Width = 2480; // Beispiel für A4 bei 300 DPI

  // Berechnung des Verhältnisses zur Skalierung
  let scale = 1;
  if (originalCanvasWidth > maxA4Width) {
    scale = maxA4Width / originalCanvasWidth;
  }

  const scaledCanvasWidth = originalCanvasWidth * scale;
  const scaledCanvasHeight = originalCanvasHeight * scale;

  // Padding, Titelhöhe und Abstand
  const padding = 20;
  const titleHeight = 80; // Bereich für Titel und Datum
  const spacingBetweenCanvasAndColorInfo = 10; // Abstand zwischen Canvas und Farb-Info

  // Höhe der Farbinfo-Bereiche berechnen
  const colorBoxHeight = 40; // Jede Farbbox + Label nimmt ca. 40px ein
  const colorInfoHeight = colorBoxHeight * colorInfoBoxes.length;

  // Größe des temporären Canvas
  const tempCanvas = document.createElement("canvas");
  const tempCtx = tempCanvas.getContext("2d");
  tempCanvas.width = scaledCanvasWidth + 2 * padding;
  tempCanvas.height =
    scaledCanvasHeight +
    titleHeight +
    colorInfoHeight +
    2 * padding +
    spacingBetweenCanvasAndColorInfo;

  // Hintergrund auf Weiß setzen
  tempCtx.fillStyle = "#ffffff";
  tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

  // Titel und Datum zeichnen
  tempCtx.fillStyle = "#000000";
  tempCtx.font = "24px Arial";
  tempCtx.textAlign = "left";
  tempCtx.textBaseline = "top";
  tempCtx.fillText(title, padding, padding);

  // Aktuelles Datum berechnen und formatieren
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Monate sind 0-basiert
  const year = now.getFullYear();
  const formattedDate = `${day}.${month}.${year}`;

  // Datum auf das Canvas zeichnen
  tempCtx.font = "16px Arial";
  tempCtx.fillText(formattedDate, padding, padding + 40);

  // Canvas-Größe auf das Canvas zeichnen
  tempCtx.font = "16px Arial";
  tempCtx.fillText(
    `Size: ${originalCanvasWidth} x ${originalCanvasHeight} mm`,
    padding,
    padding + 60
  );

  // Canvas-Bild auf das temporäre Canvas zeichnen
  tempCtx.drawImage(
    canvasElement,
    padding,
    padding + titleHeight + spacingBetweenCanvasAndColorInfo,
    scaledCanvasWidth,
    scaledCanvasHeight
  );

  // Farbinfo-Bereich zeichnen
  let currentY =
    padding +
    titleHeight +
    scaledCanvasHeight +
    spacingBetweenCanvasAndColorInfo; // Startposition unter dem Canvas-Bild

  colorInfoBoxes.forEach((box, index) => {
    const colorLabel = box.querySelector(".color-label").textContent;
    const swatch = box.querySelector(".color-swatch").style.backgroundColor;

    // Zeichnen des Swatch
    tempCtx.fillStyle = swatch;
    tempCtx.fillRect(
      padding + 10,
      currentY + index * colorBoxHeight + 5, // Kleinere Anpassung für Abstand
      30,
      30
    );

    // Zeichnen des Labels
    tempCtx.fillStyle = "#000000";
    tempCtx.font = "14px Arial";
    tempCtx.textAlign = "left";
    tempCtx.textBaseline = "top";
    tempCtx.fillText(
      colorLabel,
      padding + 50,
      currentY + index * colorBoxHeight + 15 // Kleinere Anpassung für Abstand
    );
  });

  // Download-Link erstellen
  const link = document.createElement("a");
  link.download = "quilt_pattern_" + formattedDate + ".png";
  link.href = tempCanvas.toDataURL("image/png");
  link.click();
}

// wird automatisch ausgeführt, sobald die gesamte Webseite geladen ist
window.onload = function () {
  document.getElementById("canvas-width").value = 700;
  document.getElementById("canvas-height").value = 700;
  updateColorCountOptions();
  generateNewColors();
  updateCanvasSizeDisplay(); // Füge dies hinzu, um die Canvas-Größe anzuzeigen
};
