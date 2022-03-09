const fs = require('fs')
const BigNumber = require('bignumber.js');
const axios = require('axios');

async function main() {
    for(let i = 3000; i < 4000; i++) {
    // for(let i = 0; i < 10; i++) {
        console.log(await getTokenMetadata(i));
    }
}
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });

async function getTokenMetadata(tokenId) {
    let id = new BigNumber(tokenId);

    const root = "data/v2/metadata";
    const folder = id.mod(100).toString();
    const file = root + "/" + folder + "/" + id + ".json";
    
    const url = "https://heroku.ether.cards/card/" + folder + "/" + id + ".json";

    return "curl -s "+url+" --output "+root+"/"+folder+"/"+id+".json";

    // const data = await axios.get(url)
    //     .then(function (response) {
    //         return response.data;
    //     })
    //     .catch(function (error) {
    //         console.log(error);
    //     })
    //     .then(function (data) {
    //         console.log("got data for", id.toString());
    //         return data;
    //     });

    // if (!fs.existsSync(root + "/" + folder)) {
    //     fs.mkdirSync(root + "/" + folder) 
    // }
    
    // try {
    //     fs.writeFileSync(file, JSON.stringify(data));
    // } catch (err) {
    //     console.error(err);
    // }

    // return data;
}

// function getTokenTraits(tokenId) {
//     tokenId = new BigNumber(tokenId);
//     const og_rand = new BigNumber("8449680988540440215");
//     const alpha_rand = new BigNumber("10566023106710594524");
//     const founder_rand = new BigNumber("12403320775077705976");

//     let id = tokenId;
//     if (tokenId < 10) {
//         //
//     } else if (tokenId < 100) {
//         // id = ((tokenId + og_rand) % 90) + 10;
//         id = tokenId.plus(og_rand).mod(90).plus(10);
//     } else if (tokenId < 1000) {
//         // id = ((tokenId + alpha_rand) % 900) + 100;
//         id = tokenId.plus(alpha_rand).mod(900).plus(100);
//     } else if (tokenId < 10000) {
//         // id = ((tokenId + founder_rand) % 9000) + 1000;
//         id = tokenId.plus(founder_rand).mod(9000).plus(1000);
//     }

//     const root = "./data/QmfC87yxZKPSU3vQdsh8CBdgJttrLDJmS1HSfFfYqeRyUQ";
//     const folder = id.mod(100).toString();
//     const file = root + "/" + folder + "/" + id.toString() + ".json";

//     let retval = '';
//     try {
//         const data = fs.readFileSync(file, 'utf8')
//         const obj = JSON.parse(data);
//         console.log(obj);
//         retval = {
//             // traits: [ "Accidental Collaboration", ... obj.traits],
//             traits: obj.traits,
//             trait_types: obj.trait_types,
//             series: obj.series
//         };
//         // console.log(retval);

//     } catch (err) {
//         console.error(err)
//     }
//     return retval;
// }


