const fs = require('fs');
const filepath = 'src/js/components/consultData/consultData.js';
let code = fs.readFileSync(filepath, 'utf8');

// The `control` variable in `activateDataConsult` is already referencing `document.getElementById("iconCD")`,
// which is the `<a>` element! So control.setAttribute is actually setting it on the <a>. Wait, let me check.

// Let's re-read the activateDataConsult function.
