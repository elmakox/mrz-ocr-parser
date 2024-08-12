const Tesseract = require("tesseract.js");

// Check digit
const calculateCheckDigit = (data) => {
  const weights = [7, 3, 1];
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<";
  let sum = 0;

  for (let i = 0; i < data.length; i++) {
    const charValue = chars.indexOf(data[i]);
    sum += charValue * weights[i % 3];
  }

  return sum % 10;
};


const parseMRZ = (mrz) => {
  const lines = mrz.split("\n");
  if (lines.length !== 2) throw new Error("Invalid MRZ format");

  const line1 = lines[0];
  const line2 = lines[1];

  const documentType = line1.substring(0, 1);
  const issuingCountry = line1.substring(2, 5);

  const names = line1.substring(5).split("<<");
  let lastName = names[0].replace(/<+/g, " ").trim();
  let firstName = names[1] ? names[1].replace(/<+/g, " ").trim() : "";
  
  lastName = lastName.replace(/[^A-Z ]/g, "");
  firstName = firstName.replace(/[^A-Z ]/g, ""); 

  
  lastName = lastName.replace(/\s+/g, " ");
  firstName = firstName.replace(/\s+/g, " ");

  const passportNumber = line2.substring(0, 9).replace(/<+/g, "");
  const passportCheckDigit = parseInt(line2.substring(9, 10), 10);
  const nationality = line2.substring(10, 13);
  const birthDate = line2.substring(13, 19);
  const birthDateCheckDigit = parseInt(line2.substring(19, 20), 10);
  const gender = line2.substring(20, 21);
  const expirationDate = line2.substring(21, 27);
  const expirationDateCheckDigit = parseInt(line2.substring(27, 28), 10);
  const personalNumber = line2.substring(28, 42).replace(/<+/g, "");
  const personalNumberCheckDigit = parseInt(line2.substring(42, 43), 10);
  const finalCheckDigit = parseInt(line2.substring(43, 44), 10);

  // Validate each field
  const isPassportNumberValid =
    calculateCheckDigit(passportNumber) === passportCheckDigit;
  const isBirthDateValid =
    calculateCheckDigit(birthDate) === birthDateCheckDigit;
  const isExpirationDateValid =
    calculateCheckDigit(expirationDate) === expirationDateCheckDigit;
  const isPersonalNumberValid =
    calculateCheckDigit(personalNumber) === personalNumberCheckDigit;

  const compositeString =
    passportNumber +
    passportCheckDigit +
    birthDate +
    birthDateCheckDigit +
    expirationDate +
    expirationDateCheckDigit +
    personalNumber +
    personalNumberCheckDigit;
  const isFinalCheckDigitValid =
    calculateCheckDigit(compositeString) === finalCheckDigit;

  const formattedBirthDate = convertMRZDate(birthDate);
  const formattedExpirationDate = convertMRZDate(expirationDate);

  return {
    documentType,
    issuingCountry,
    lastName,
    firstName,
    passportNumber,
    isPassportNumberValid,
    nationality,
    birthDate,
    formattedBirthDate,
    isBirthDateValid,
    gender,
    expirationDate,
    formattedExpirationDate,
    isExpirationDateValid,
    personalNumber,
    isPersonalNumberValid,
    isFinalCheckDigitValid,
  };
};


const convertMRZDate = (dateString) => {
  if (!/^\d{6}$/.test(dateString)) {
    throw new Error("Invalid MRZ Date Format");
  }

  // Extract Date components
  const year = parseInt(dateString.substring(0, 2), 10);
  const month = parseInt(dateString.substring(2, 4), 10);
  const day = parseInt(dateString.substring(4, 6), 10);

  // Add 2000 to year if necessary
  const fullYear = year >= 0 && year <= 99 ? 2000 + year : year;

  
  const date = new Date(fullYear, month - 1, day);

  // Check if date is valid
  if (isNaN(date.getTime())) {
    throw new Error("Date invalide");
  }

  return date;
};


exports.parseMRZ = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Aucun fichier téléchargé." });
    }

    const { path } = req.file;

    // Get text from image
    const {
      data: { text },
    } = await Tesseract.recognize(path, "fra");

    // console.log("Text from file: ", text);

    // Cleanup text and Get infos
    const mrzData = text.trim().split("\n").slice(-2).join("\n"); 

    // console.log("MRZ data: ", mrzData);

    const parsedData = parseMRZ(mrzData);

    return res.json(parsedData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erreur lors du traitement du MRZ." });
  }
};
