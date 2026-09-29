const fs = require('fs');

function updateFile(path) {
  let content = fs.readFileSync(path, 'utf8');
  
  // Replace `content['key'] || 'val'` with `content.hasOwnProperty('key') ? content['key'] : 'val'`
  content = content.replace(/content\['([^']+)'\]\s*\|\|\s*('[^']*'|"[^"]*"|\d+)/g, "(content.hasOwnProperty('$1') ? content['$1'] : $2)");
  
  // Fix specific hero typography in home.tsx
  if (path.includes('home.tsx')) {
    content = content.replace(
      /<h1 className="text-\[clamp[^>]+>[\s\S]*?<\/h1>/m,
      `<h1 className="text-[clamp(3.2rem,8vw,7rem)] leading-[0.9] tracking-[-0.03em] text-[#f5f2e9]">
                {(content.hasOwnProperty('hero_title') ? content['hero_title'] : 'Invest With') && (
                  <><span className="font-sans font-semibold">{content.hasOwnProperty('hero_title') ? content['hero_title'] : 'Invest With'}</span><br /></>
                )}
                {(content.hasOwnProperty('hero_title_2') ? content['hero_title_2'] : 'Trust') && (
                  <><span className="font-sans font-semibold">{content.hasOwnProperty('hero_title_2') ? content['hero_title_2'] : 'Trust'}</span><br /></>
                )}
                <span className="font-display italic text-[#947e82]">{content.hasOwnProperty('hero_title_3') ? content['hero_title_3'] : 'Grow'}</span>
                <span className="font-display text-[#947e82]"> {content.hasOwnProperty('hero_title_4') ? content['hero_title_4'] : 'With'}</span><br />
                <span className="font-display">{content.hasOwnProperty('hero_title_5') ? content['hero_title_5'] : 'Community'}</span>
              </h1>`
    );
    
    // Wrap other elements conditionally to hide them entirely if they are empty
    // hero_subtitle
    content = content.replace(
      /<p className="mt-8 max-w-md text-base leading-7 text-\[#f5f2e9\]\/70 font-sans">\s*\{\(content\.hasOwnProperty\('hero_subtitle'\) \? content\['hero_subtitle'\] : '.*?'\)\}\s*<\/p>/,
      `{(content.hasOwnProperty('hero_subtitle') ? content['hero_subtitle'] : 'Thoughtfully planned communities. A better tomorrow.') && (
                <p className="mt-8 max-w-md text-base leading-7 text-[#f5f2e9]/70 font-sans">
                  {content.hasOwnProperty('hero_subtitle') ? content['hero_subtitle'] : 'Thoughtfully planned communities. A better tomorrow.'}
                </p>
              )}`
    );
  }
  
  fs.writeFileSync(path, content, 'utf8');
}

updateFile('src/components/site.tsx');
updateFile('src/pages/home.tsx');
console.log('Files updated!');
