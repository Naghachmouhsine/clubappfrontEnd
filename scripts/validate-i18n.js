const fs = require('fs');
const path = require('path');

// Fonction pour lire récursivement tous les fichiers
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file));
    }
  });

  return arrayOfFiles;
}

// Fonction pour vérifier les clés de traduction manquantes
function validateTranslationKeys() {
  const frTranslations = JSON.parse(fs.readFileSync('./src/assets/i18n/fr.json', 'utf8'));
  const enTranslations = JSON.parse(fs.readFileSync('./src/assets/i18n/en.json', 'utf8'));
  const arTranslations = JSON.parse(fs.readFileSync('./src/assets/i18n/ar.json', 'utf8'));

  // Fonction récursive pour obtenir toutes les clés
  function getKeys(obj, prefix = '') {
    let keys = [];
    for (let key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        keys = keys.concat(getKeys(obj[key], prefix + key + '.'));
      } else {
        keys.push(prefix + key);
      }
    }
    return keys;
  }

  const frKeys = getKeys(frTranslations);
  const enKeys = getKeys(enTranslations);
  const arKeys = getKeys(arTranslations);

  console.log('🔍 Validation des clés de traduction...');
  console.log(`📊 Français: ${frKeys.length} clés`);
  console.log(`📊 Anglais: ${enKeys.length} clés`);
  console.log(`📊 Arabe: ${arKeys.length} clés`);

  // Vérifier les clés manquantes
  const missingInEn = frKeys.filter(key => !enKeys.includes(key));
  const missingInAr = frKeys.filter(key => !arKeys.includes(key));

  if (missingInEn.length > 0) {
    console.log('❌ Clés manquantes en anglais:', missingInEn);
  }

  if (missingInAr.length > 0) {
    console.log('❌ Clés manquantes en arabe:', missingInAr);
  }

  if (missingInEn.length === 0 && missingInAr.length === 0) {
    console.log('✅ Toutes les clés de traduction sont présentes dans les 3 langues');
  }
}

// Fonction pour vérifier les composants avec TranslateModule
function validateComponents() {
  const htmlFiles = getAllFiles('./src/app').filter(file => file.endsWith('.html') && !file.includes('.spec.'));
  let componentsNeedingTranslate = [];

  htmlFiles.forEach(htmlFile => {
    const htmlContent = fs.readFileSync(htmlFile, 'utf8');
    if (htmlContent.includes('| translate')) {
      const tsFile = htmlFile.replace('.html', '.ts');
      if (fs.existsSync(tsFile)) {
        const tsContent = fs.readFileSync(tsFile, 'utf8');
        if (!tsContent.includes('TranslateModule') && !tsContent.includes('SharedIonicModule')) {
          componentsNeedingTranslate.push(tsFile);
        }
      }
    }
  });

  console.log('\n🔍 Validation des composants...');
  if (componentsNeedingTranslate.length > 0) {
    console.log('❌ Composants nécessitant TranslateModule:', componentsNeedingTranslate);
  } else {
    console.log('✅ Tous les composants utilisant le pipe translate ont TranslateModule ou SharedIonicModule');
  }
}

// Exécuter les validations
console.log('🚀 Validation du multilingue...\n');
validateTranslationKeys();
validateComponents();
console.log('\n✨ Validation terminée !');