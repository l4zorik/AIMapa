/**
 * Script to update Content Security Policy and add Font Awesome to all HTML files
 */

const fs = require('fs');
const path = require('path');

// Enhanced CSP with high security settings
const enhancedCSP = `default-src 'self' https://*.auth0.com https://*.supabase.co https://api.mapy.cz https://cdn.jsdelivr.net https://unpkg.com https://cdnjs.cloudflare.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.auth0.com https://cdn.auth0.com https://cdn.jsdelivr.net https://api.mapy.cz https://unpkg.com https://*.openstreetmap.org https://*.openrouteservice.org https://*.freemap.sk https://*.windy.com https://cdnjs.cloudflare.com https://js.stripe.com; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://api.mapy.cz https://unpkg.com https://cdnjs.cloudflare.com; img-src 'self' data: https://*.auth0.com https://api.mapy.cz https://unpkg.com https://*.tile.openstreetmap.org https://*.openstreetmap.org https://cdn.auth0.com https://via.placeholder.com https://*.googleusercontent.com; connect-src 'self' https://*.auth0.com https://*.supabase.co https://api.mapy.cz https://unpkg.com https://*.openstreetmap.org https://*.openrouteservice.org https://*.freemap.sk https://*.windy.com https://dev-zxj8pir0moo4pdk7.us.auth0.com https://*.stripe.com https://*.googleapis.com; frame-src 'self' https://*.auth0.com https://*.stripe.com; worker-src 'self' blob:; manifest-src 'self'; font-src 'self' data: https://cdn.jsdelivr.net https://api.mapy.cz https://unpkg.com https://cdnjs.cloudflare.com; object-src 'none'; upgrade-insecure-requests; block-all-mixed-content`;

// Font Awesome link tag
const fontAwesomeLink = `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" 
      integrity="sha512-1ycn6IcaQQ40/MKBW2W4Rhis/DbILU74C1vSrLJxCq57o941Ym01SwNsOMqvEBFlcgUa6xLiPY/NS5R+E6ztJQ==" 
      crossorigin="anonymous" referrerpolicy="no-referrer" />`;

// Function to find all HTML files recursively
function findHtmlFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            findHtmlFiles(filePath, fileList);
        } else if (file.endsWith('.html')) {
            fileList.push(filePath);
        }
    });
    
    return fileList;
}

// Function to update a single HTML file
function updateHtmlFile(filePath) {
    console.log(`Updating ${filePath}...`);
    
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Add Font Awesome if not already present
    if (!content.includes('font-awesome') && !content.includes('cdnjs.cloudflare.com/ajax/libs/font-awesome')) {
        // Find the position to insert Font Awesome (after other stylesheets or before </head>)
        const stylePos = content.lastIndexOf('</style>');
        const linkPos = content.lastIndexOf('</link>');
        const headPos = content.indexOf('</head>');
        
        let insertPos;
        if (stylePos !== -1 && stylePos < headPos) {
            insertPos = stylePos + 8; // After </style>
        } else if (linkPos !== -1 && linkPos < headPos) {
            insertPos = linkPos + 7; // After </link>
        } else {
            insertPos = headPos; // Before </head>
        }
        
        content = content.slice(0, insertPos) + '\n    <!-- Font Awesome -->\n    ' + fontAwesomeLink + '\n' + content.slice(insertPos);
        modified = true;
    }
    
    // Update or add CSP meta tag
    if (content.includes('<meta http-equiv="Content-Security-Policy"')) {
        // Replace existing CSP
        content = content.replace(
            /<meta http-equiv="Content-Security-Policy" content="[^"]*">/g,
            `<meta http-equiv="Content-Security-Policy" content="${enhancedCSP}">`
        );
        modified = true;
    } else {
        // Add CSP if not present
        const headPos = content.indexOf('</head>');
        if (headPos !== -1) {
            content = content.slice(0, headPos) + 
                     `\n    <meta http-equiv="Content-Security-Policy" content="${enhancedCSP}">\n` + 
                     content.slice(headPos);
            modified = true;
        }
    }
    
    // Save the file if modified
    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${filePath}`);
    } else {
        console.log(`No changes needed for ${filePath}`);
    }
}

// Main function
function main() {
    const rootDir = path.resolve('.');
    const publicDir = path.join(rootDir, 'public');
    
    console.log('Finding HTML files...');
    const htmlFiles = findHtmlFiles(publicDir);
    
    console.log(`Found ${htmlFiles.length} HTML files`);
    
    // Update each HTML file
    htmlFiles.forEach(updateHtmlFile);
    
    console.log('All HTML files updated successfully!');
}

// Run the script
main();
