import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    try {
        await page.goto('http://localhost/login', { waitUntil: 'networkidle0' });
        
        // Sesuaikan dengan data login yang ingin diuji
        await page.type('#email', 'admin@example.com');
        await page.type('#password', 'password');
        
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
            page.click('button[type="submit"]')
        ]);
        
        console.log('Login successful');
    } catch (e) {
        console.log('Login error:', e.message);
    }
    
    await browser.close();
})();
