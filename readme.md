# Passport MRZ Extraction and Validation

This project provides an Express.js application that uses Tesseract.js for Optical Character Recognition (OCR) to extract and validate Machine Readable Zone (MRZ) data from passport images.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [API Endpoints](#api-endpoints)
- [License](#license)

## Features

- Extract MRZ data from passport images using Tesseract.js.
- Validate extracted MRZ fields, including check digits.
- Convert MRZ dates to JavaScript Date objects.

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) or [Yarn](https://classic.yarnpkg.com/)

### Steps

1. Clone the repository:

    ```bash
    git clone https://github.com/elmakox/mrz-ocr-parser.git
    ```

2. Navigate to the project directory:

    ```bash
    cd mrz-ocr-parser
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

4. (Optional) Install `nodemon` globally if you haven't already:

    ```bash
    npm install -g nodemon
    ```

## Usage

### Running the Server

To start the server in development mode with automatic restarts on code changes:

```bash
npm run dev


For production mode (requires manual restart on code changes):

```bash
npm start
```

### API Endpoints

- **POST /api/parse-mrz**
  
  Upload a passport image for MRZ extraction and validation.

  **Request:**
  - Form-data with key `passport` containing the passport image.

  **Response:**
  - Returns the extracted and validated MRZ data.

## Observation

- Currently, the application supports only passport images for MRZ extraction. Support for other types of identity documents is not implemented at this time.

## Configuration

### Language Configuration

The OCR process is configured to use the French language. Ensure that the Tesseract French language data is installed. If you encounter issues, refer to the [Tesseract language data](https://github.com/tesseract-ocr/tessdata) for installation instructions.

### Date Conversion

The application uses a specific method to handle dates in the MRZ format, converting them to JavaScript `Date` objects considering the 1900 and 2000 centuries.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Feel free to open issues or submit pull requests to improve this project. Contributions are welcome!