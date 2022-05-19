const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const app = express();
const catalyst = require('zcatalyst-sdk-node');

// default options
app.use(fileUpload());

app.post('/upload', async function(req, res) {
    console.log('upload invoked  rrrrrrrrr');
    let sampleFile;
    let uploadPath;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    sampleFile = req.files.sampleFile;
    // console.log(sampleFile);
    uploadPath = __dirname + '/uploads/' + sampleFile.name;
    console.log(uploadPath);
    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(uploadPath, function(err) {
        if (err)
            return res.status(500).send(err);

        // res.send('File uploaded!');
    });

    const catalystApp = catalyst.initialize(req);
    console.log('got catalystApp ' + uploadPath);
    let panDetails = await getPassbookDetails(uploadPath, catalystApp);
    console.log(panDetails);
    res.send(panDetails);
});





function getPassbookDetails(path, catalystApp) {
    return new Promise((resolve, reject) => {
        console.log('in get passbook Details  ');

        var zia = catalystApp.zia();
        zia.extractOpticalCharacters(fs.createReadStream(path), { language: 'eng', modelType: 'PASSBOOK' })
            .then((result) => {
                //    console.log(result);
                //   return result;
                resolve(result);
            })
            .catch((err) => {
                    console.log(err.toString());
                    reject(err);
                } //Push errors to Catalyst Logs
            );
    });
}


module.exports = app;