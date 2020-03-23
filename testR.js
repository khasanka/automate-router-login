const url = 'http://192.168.8.1/html/home.html';

const puppeteer = require('puppeteer');
const fs = require('fs');
//const $ = require('cheerio');

let scrape = async () => {

	const browser = await puppeteer.launch({
		"headless": false,
		"args": ["--fast-start", "--disable-extensions", "--no-sandbox"],
		//"ignoreHTTPSErrors": true
	});

	const page = await browser.newPage();

	await page.goto(url);
	await page.click('#statistic');
	await page.type('#username', 'admin');
	await page.type('#password', 'admin');
	await page.click('#pop_login');
	console.log('Befor  click');
	await page.waitForSelector('#psw_Cancel');
	await Promise.all([
		page.click('#psw_Cancel'),
		page.waitForNavigation({
		  waitUntil: 'networkidle0',
		}),
	]);
	await page.waitFor(1000);
	//let bodyHTML = await page.evaluate(() => document.getElementById("table_wifiClient"));
	
	//let bodyHTML = await page.$$eval('tr .bottom_host', bottom_hosts => bottom_hosts.map(bottom_host => bottom_host.innerHTML));
let bodyHTML = await page.$$eval('tr [class*=bottom_]', bottom_hosts => bottom_hosts.map(bottom_host => bottom_host.innerHTML));
	//let bodyHTML = await page.$$eval('tr', trs => trs.map(tr => tr.innerHTML));
	
	console.log(bodyHTML);
	console.log('After click');
	fs.writeFile('./testR.txt', bodyHTML, function (err) {
		  if (err) {
			console.log('There has been an error saving your configuration data.');
			console.log(err.message);
			return;
		  }
		  console.log('Configuration saved successfully.');
	 });
	console.log('File write done....');
	//await browser.close();
	
};

function readPageContent(html) {
	console.log('inside function');
	var iner = $('#table_wifiClient', html).innerHTML;
	console.log(iner);
    $('#table_wifiClient tr', html).each(function() {
      console.log($(this).text());
    });
  }

scrape();
