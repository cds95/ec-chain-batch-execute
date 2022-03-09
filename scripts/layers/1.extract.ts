const fs = require('fs')
const BigNumber = require('bignumber.js');

let traitNameToId = {};

let traitUsage = {};

const imageData = [];


for (let i = 0; i < 10000; i++) {
    const meta = getTokenImageString(i);
    const str = meta["layer_image"].split("/");
    const image_and_ext = str[str.length-1].split(".");
    console.log(i, image_and_ext);
    imageData.push(image_and_ext[0]);
}

try {
    fs.writeFileSync('data/ImageData.json', JSON.stringify(imageData));
    //file written successfully
} catch (err) {
    console.error(err);
}


function getTokenImageString(id: number): any {

    const root = "./data/metadata";
    const folder = (id % 100).toString();
    const file = root + "/" + folder + "/" + id.toString() + ".json";

    let retval = '';
    try {
        const data = fs.readFileSync(file, 'utf8')
        retval = JSON.parse(data);
    } catch (err) {
        console.error(err)
    }
    return retval;
}


