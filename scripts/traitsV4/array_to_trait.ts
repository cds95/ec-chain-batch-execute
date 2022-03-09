import BitArray from "../../tests/helpers/BitArray";

async function main() {

    const traitData = new BitArray(10000);

    let traitUsage = 0;
    let traitRealUsage = 0;

    Object.keys(tokenData).forEach((tokenId: any, index: number) => {
        if(tokenId.toString() !== "default") {

            let trait = getTokenTraitData(tokenData[tokenId], traitId);
            
            if(traitSettings !== false) {

                if(traitSettings.type === 2) {

                    // token in range 
                    if(traitSettings.start <= tokenId && tokenId <= traitSettings.end) {
                        // for tokens in range that DO NOT have trait, we need to set it to true
                        // as hasTrait inverts the value that is stored

                        if( trait !== false) {
                            // trait exists.. since this is inverted, do nothing
                            traitUsage++;
                            traitRealUsage+= trait.value || 0;
                            
                            // save value for value trait implementer
                            if(parseInt(trait.value) > 0) {
                                traitTokenValues[traitId][tokenId] = trait.value;
                            }

                        } else {
                            // trait does not exist, since it is inverted, set On
                            traitData.on(tokenId);
                        }

                    } else {
                        // outside range do nothing
                    }

                }

            } else {

                if( trait !== false) {
                    traitData.on(tokenId);
                    traitUsage++;
                    traitRealUsage+= parseInt(trait.value) || 0;

                    // save value for value trait implementer
                    if(parseInt(trait.value) > 0) {
                        traitTokenValues[traitId][tokenId] = trait.value;
                    }

                }
            }
        }
    });



}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });