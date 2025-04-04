const neutralColors = [
  { rgb: [234, 219, 192], description: "32001 blanc" },
  { rgb: [236, 236, 236], description: "32002 blanc 31" },
  { rgb: [242, 242, 242], description: "32003 blanc très clair" },
  { rgb: [94, 96, 97], description: "32010 gris foncé 31" },
  { rgb: [146, 148, 148], description: "32011 gris 31" },
  { rgb: [167, 168, 165], description: "32012 gris moyen" },
  { rgb: [188, 187, 182], description: "32013 gris clair 31" },
  { rgb: [198, 213, 204], description: "32034 céruléen pâle" },
  { rgb: [234, 207, 166], description: "32060 ocre" },
  { rgb: [226, 203, 181], description: "32123 terre sienne pâle" },
  { rgb: [76, 66, 61], description: "32130 terre d'ombre brûlée 31" },
  { rgb: [183, 163, 146], description: "32131 ombre brûlée claire" },
  { rgb: [90, 85, 80], description: "32140 ombre naturelle 31" },
  { rgb: [146, 138, 126], description: "32141 ombre naturelle moyenne" },
  { rgb: [183, 172, 157], description: "32142 ombre naturelle claire" },
  { rgb: [218, 218, 217], description: "32104 gris clair 31" },
  { rgb: [135, 136, 133], description: "32105 gris foncé 31" },
  { rgb: [38, 38, 38], description: "32106 noir 31" },
];

const predefinedColors = [
  { rgb: [2, 89, 97], description: "Cretonne petrol 320 Preis: 7" },
  { rgb: [124, 128, 104], description: "Cretonne oliv hell 319 Preis: 7" },
  { rgb: [73, 128, 112], description: "Cretonne salbeigrün 318 Preis: 6" },
  { rgb: [1, 166, 112], description: "Cretonne grün 317 Preis: 6" },
  { rgb: [3, 95, 72], description: "Cretonne dunkelgrün 316 Preis: 6" },
  { rgb: [50, 54, 40], description: "Cretonne dunkelgrün 315 Preis: 6" },
  { rgb: [134, 80, 109], description: "Cretonne mauve 314 Preis: 6" },
  { rgb: [175, 121, 137], description: "Cretonne altrosa 313 Preis: 6" },
  { rgb: [222, 169, 172], description: "Cretonne rosa 312 Preis: 6" },
  { rgb: [231, 90, 81], description: "Cretonne koralle 311 Preis: 6" },
  { rgb: [249, 163, 56], description: "Cretonne orange gelb 310 Preis: 6" },
  { rgb: [232, 216, 200], description: "Cretonne creme 309 Preis: 7" },
  { rgb: [167, 91, 48], description: "Cretonne kürbis 307 Preis: 6" },
  { rgb: [180, 66, 32], description: "Cretonne rost 306 Preis: 6" },
  { rgb: [157, 84, 61], description: "Cretonne rotbraun 263 Preis: 6" },
  { rgb: [77, 125, 157], description: "Cretonne blaugrau 259 Preis: 7" },
  { rgb: [225, 76, 63], description: "Cretonne rotorange 262 Preis: 6" },
  { rgb: [176, 202, 202], description: "Cretonne pastellblau 257 Preis: 6" },
  { rgb: [185, 137, 20], description: "Cretonne curry 308 Preis: 6" },
  { rgb: [185, 102, 120], description: "Cretonne altrose 305 Preis: 6" },
  { rgb: [187, 102, 150], description: "Cretonne beere 304 Preis: 6" },
  { rgb: [242, 221, 220], description: "Cretonne rose 301 Preis: 7" },
  { rgb: [109, 110, 110], description: "Cretonne grau 300 Preis: 6" },
  { rgb: [84, 39, 79], description: "Cretonne violett 303 Preis: 6" },
  { rgb: [127, 100, 89], description: "Cretonne graubraun 260 Preis: 6" },
  { rgb: [46, 174, 185], description: "Cretonne türkis 258 Preis: 7" },
  { rgb: [1, 181, 200], description: "Cretonne türkis hell 256 Preis: 7" },
  { rgb: [1, 123, 176], description: "Cretonne türkis dunkel 255 Preis: 7" },
  { rgb: [47, 55, 145], description: "Cretonne royalblau 254 Preis: 7" },
  { rgb: [61, 57, 118], description: "Cretonne dunkelblau 253 Preis: 6" },
  { rgb: [241, 125, 116], description: "Cretonne koralle 261 Preis: 7" },
  { rgb: [168, 190, 171], description: "Cretonne mint 265 Preis: 6" },
  { rgb: [157, 182, 62], description: "Cretonne hellgrün 266 Preis: 7" },
  { rgb: [202, 189, 167], description: "Cretonne beige hell 264 Preis: 7" },
  { rgb: [129, 47, 103], description: "Cretonne beere 302 Preis: 6" },
  { rgb: [217, 177, 177], description: "Cretonne rosa 272 Preis: 7" },
  { rgb: [43, 89, 89], description: "Cretonne petrol 269 Preis: 6" },
  { rgb: [234, 136, 174], description: "Cretonne pink hell 274 Preis: 7" },
  { rgb: [203, 180, 168], description: "Cretonne rose 273 Preis: 7" },
  { rgb: [111, 175, 204], description: "Cretonne hellblau 271 Preis: 7" },
  { rgb: [59, 75, 103], description: "Cretonne blau 270 Preis: 7" },
  { rgb: [131, 192, 166], description: "Cretonne mint dunkel 290 Preis: 7" },
  { rgb: [101, 113, 44], description: "Cretonne grün 267 Preis: 7" },
  { rgb: [252, 89, 62], description: "Cretonne orange 291 Preis: 6" },
  { rgb: [71, 56, 53], description: "Cretonne taupe dunkel 268 Preis: 7" },
  { rgb: [187, 173, 170], description: "Cretonne beige 297 Preis: 7" },
  { rgb: [47, 44, 44], description: "Cretonne schwarz 293 Preis: 7" },
  { rgb: [205, 210, 216], description: "Cretonne weiß 299 Preis: 7" },
  { rgb: [207, 201, 188], description: "Cretonne ecru 298 Preis: 7" },
  { rgb: [176, 177, 173], description: "Cretonne hellgrau 296 Preis: 7" },
  { rgb: [165, 163, 174], description: "Cretonne grau 295 Preis: 7" },
  { rgb: [40, 46, 61], description: "Cretonne dunkelblau 292 Preis: 7" },
  { rgb: [80, 75, 81], description: "Cretonne dunkelgrau 294 Preis: 7" },
  { rgb: [202, 224, 242], description: "Cretonne hellblau 289 Preis: 7" },
  { rgb: [138, 176, 167], description: "Cretonne aquamarine 288 Preis: 7" },
  { rgb: [1, 110, 106], description: "Cretonne grünblau 287 Preis: 7" },
  { rgb: [63, 85, 64], description: "Cretonne dunkelgrün 286 Preis: 7" },
  { rgb: [72, 93, 48], description: "Cretonne oliv hell 285 Preis: 7" },
  { rgb: [104, 159, 69], description: "Cretonne grün 284 Preis: 7" },
  { rgb: [168, 174, 65], description: "Cretonne hellgrün 283 Preis: 7" },
  { rgb: [253, 229, 70], description: "Cretonne gelb 282 Preis: 7" },
  { rgb: [233, 175, 42], description: "Cretonne gelb 281 Preis: 6" },
  { rgb: [215, 173, 164], description: "Cretonne rose dunkel 280 Preis: 7" },
  { rgb: [179, 146, 178], description: "Cretonne flieder 279 Preis: 7" },
  { rgb: [201, 26, 93], description: "Cretonne pink 278 Preis: 7" },
  { rgb: [163, 13, 71], description: "Cretonne pink 277 Preis: 6" },
  { rgb: [181, 28, 46], description: "Cretonne rot 276 Preis: 7" },
  { rgb: [181, 28, 46], description: "Cretonne dunkelrot 275 Preis: 7" },
];
