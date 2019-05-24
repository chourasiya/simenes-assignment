const fs = require('fs');

const userdata = (data) => {
    fs.writeFile("userdata.json", data, (err) => {
        if (err) console.log(err);
        console.log("Successfully Written to File.");
    });
};

module.exports = {
    userdata : userdata
}