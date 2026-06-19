import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    // Capture console messages
    page.on('console', msg => {
        if (msg.type() === 'error') {
            console.log('PAGE ERROR:', msg.text());
        }
    });

    page.on('pageerror', err => {
        console.log('PAGE UNHANDLED ERROR:', err.message);
    });

    try {
        // Change URL as needed
        await page.goto('http://localhost/submissions/1', { waitUntil: 'networkidle0' });
        console.log('Page loaded successfully');
    } catch (e) {
        console.log('Navigation error:', e.message);
    }
    
    await browser.close();
})();
