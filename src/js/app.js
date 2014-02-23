var fs = require('fs'),
    path = require('path'),
    mime = require('mime-magic');

var canvas = document.querySelector('#canvas'),
    
    text_alert = document.querySelector('#alert');

    btn_h_loadfile = document.querySelector('#h_loadfile'),
    btn_loadfile = document.querySelector('#loadfile'),

    btn_h_exportfile = document.querySelector('#h_exportfile'),
    btn_exportToHTML = document.querySelector('#exportToHTML'),
    btn_exportToPNG = document.querySelector('#exportToPNG'),
    btn_exportToJPEG = document.querySelector('#exportToJPEG');

var fileToWrite = '';

if(canvas) {
    var ctx = canvas.getContext('2d');

    // console.log(canvas.toDataURL('image/png'));
    // console.log(canvas.toDataURL('image/jpeg'));
}

function openImportFileGUI() {    
    btn_h_loadfile.click();
}

function handleImportedFile() {
    var file = this.value;

    fileToWrite = path.basename(file, path.extname(file));

    // traitement
    fs.readFile(file, function(err, data) {
        if(err) {
            alert('Erreur : impossible d\'ouvrir le fichier "' + file + '"');
            return;
        }

        mime(file, function(err, type) {
            if(type == 'inode/x-empty') {
                alert('Merci d\'importer un fichier texte non-vide');
                return;
            }

            if(type != 'text/plain') {
                alert('Merci d\'importer un fichier texte');
                return;
            }

            resetApp();

            data = data.toString();
            data = data.toLowerCase();

            var words = purgeText(data).split(' ');
            words = countWords(words);

            words10 = words.splice(0, 10);

            drawWords(words10);
        });
    });
}

function resetApp() {
    text_alert.className = "hidden";

    btn_h_loadfile.value = "";

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function purgeText(data) {
    return data.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g, '')
               .replace(/ (le|la|les|un|une|des|du|de|la|des|\u00E0|au|aux|du|des|ce|cet|cette|ces|mon|ton|son|ma|ta|mes|tes|ses|notre|votre|leur|nos|vos|leurs) /g, ' ')
               .replace(/ (je|tu|il|elle|on|nous|vous|ils|elles|et|ou|où|a|se|s) /g, ' ')
               .replace(/\s{2,}/g," ");
}

function countWords(words) {
    var words_count = {},
        sortable = [];

    for(i in words) {
        var word = words[i];
        
        if(!(word in words_count)) {
            words_count[word] = 1;
        } else {
            words_count[word]++;
        }
    }
    for (word in words_count) 
        sortable.push([word, words_count[word]])
    
    sortable.sort(function(a, b) {return b[1] - a[1]})
    
    return sortable;
}

function drawWords(words) {
    ctx.textAlign = "center";

    for(i in words) {
        var word = words[i][0];

        ctx.fillStyle = 'rgb(' + Math.round(Math.random() * 255) + ',' 
                               + Math.round(Math.random() * 255) + ',' 
                               + Math.round(Math.random() * 255) + ')';

        ctx.font = (Math.random() * 10 + 10) + 'px sans-serif';        
        
        ctx.fillText(word, 
            Math.random() * canvas.width,
            Math.random() * canvas.height
        );
    }
}

function openSaveFileGUI(type) {
    btn_h_exportfile.typeForExport = type;
    btn_h_exportfile.nwsaveas = 'nuage-de-mot-' + fileToWrite + '.' + type;
    btn_h_exportfile.click();
}

function handleFileToSave() {
    if(this.typeForExport == 'png' || this.typeForExport == 'jpeg') {
        var data = canvas.toDataURL('image/' + this.typeForExport ).replace('data:image/' + this.typeForExport + ';base64,', '');

        fs.writeFile(this.value, data, 'base64', handleFileWritting)
    }

    if(this.typeForExport == 'html') {
        // hf
    }
}


// import file
btn_loadfile.addEventListener('click', openImportFileGUI, false);

btn_h_loadfile.addEventListener('change', handleImportedFile, false);

// export file
btn_exportToHTML.addEventListener('click', function(e) { 
    openSaveFileGUI('html'); 
}, false);

btn_exportToPNG.addEventListener('click', function(e) {
    openSaveFileGUI('png');
}, false);

btn_exportToJPEG.addEventListener('click', function(e) {
    openSaveFileGUI('jpeg');
} , false);

btn_h_exportfile.addEventListener('change', handleFileToSave, false);

function handleFileWritting(err) {
    if(err) {
        alert('Il y a eu une erreur lors de l\'écriture du fichier.');
        return;
    }

    alert('Le fichier a bien été enregistré !');
}