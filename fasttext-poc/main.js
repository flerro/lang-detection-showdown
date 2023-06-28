const { Classifier } = require('fasttext');
const path = require('node:path'); 
const fs = require('node:fs');
const csv = require('csv-parse/sync');



(async() => {

    const model = path.join(__dirname, 'model', 'lid.176.bin');
    const classifier = new Classifier(model);

    const detectLanguage = (text, k=1) => 
      new Promise((resolve, reject) => {
          // Remove '\n' and ':' for better predictions
          // see: https://github.com/indix/whatthelang/issues/12
          let input = text.replace(/[\n:]/g, ' ');
          classifier.predict(input, k, (err, res) => 
                                        err ? reject(err) : resolve(res))
        })

    const isoCode = p => p[0].label.replace(/^__label__/, '')   // Extract lang ISO code from prediction
    const precision = p => p[0].value                           // Extract precision value from prediction 
    const match = (p, t) => (isoCode(p) == t) ? 'Y' : 'N'
    const cleanUpText = (text) => text.replace(/[\n:]/g, ' ')   // Remove '\n' and ':' for better predictions 
                                                                // see: https://github.com/indix/whatthelang/issues/12


    const dataset = fs.readFileSync(path.join(__dirname, 'dataset.csv'));
    const reviews = csv.parse(dataset);

    let predictions = [] 

    for (i=0; i<reviews.length; i++) {
      let r = reviews[i]
      let truth = r[1];
      let text = cleanUpText(r[0]);
    
      try {
        let p = await detectLanguage(text);
        predictions.push([truth, isoCode(p), match(p, truth), precision(p)])
      } catch (err) {
        console.error(err)
        predictions.push([truth, 'null', 'N']);
      }
      
      //  predictionAccuracy in prediction.value
      console.log('.');
    }
    
    fs.writeFileSync(path.join(__dirname, 'detected.csv'), predictions.join('\n'));
})();