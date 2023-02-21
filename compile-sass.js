const sass = require('node-sass');
const fs = require('fs');

sass.render({
    file: 'sass/style.scss'
}, function(err, result) {
    if (err) {
        console.error(err);
    } else {
        fs.writeFile('/public/stylesheets/css', result.css, function(err) {
            if (err) {
                console.error(err);
            } else {
                console.log('Sass compiled successfully');
            }
        });
    }
});
