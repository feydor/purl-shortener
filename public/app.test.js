const saveNewUrl = require('./app.js').default;

// test https://en.wikipedia.org as url and
// sho.rt/MTAwMA== as hash
test('displays url in div', () => {
    let url = "https://en.wikipedia.org";
    let hash = "https://sho.rt/MTAwMA==";

    saveNewUrl(hash, url);
    
    expect(document.querySelectorAll('.savedurl-container').length).toBe(1);
    expect(document.getElementById(url).textContent()).toBe(url);
  });