const unirest = require("unirest")
const ObjectsToCsv = require('objects-to-csv');
const cheerio = require("cheerio")

const getData = async () => {
    try {
        let range = Math.ceil(200 / 25)
        let pageNum = 0;
        let jobs_data = [];
        for (let i = 0; i < range; i++) {
            console.log(i)
            let url = `https://sg.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=software%2Bengineer&location=Singapore&geoId=102454443&trk=public_jobs_jobs-search-bar_search-submit&start=${pageNum}`
            let response = await unirest.get(url).headers({ "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36" })
            const $ = cheerio.load(response.body)


            $(".job-search-card").each(async (i, el) => {
                jobs_data.push({
                    title: $(el).find(".base-search-card__title").text()?.trim(),
                    company: $(el).find("h4.base-search-card__subtitle").text()?.trim(),
                    link: $(el).find("a.base-card__full-link").attr("href")?.trim(),
                    id: $(el).attr("data-entity-urn")?.split("urn:li:jobPosting:")[1],
                    location: $(el).find(".job-search-card__location").text()?.trim(),
                    date: $(el).find(".job-search-card__listdate").text()?.trim(),
                })
            })
        }

        // for (let j = 0; j < jobs_data.length; j++) {
        //     let url2 = `https://www.linkedin.com/jobs-guest/jobs/api/jobPosting/${jobs_data[j].id}`

        //     let response2 = await unirest.get(url2).headers({ "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36" })


        //     const $2 = cheerio.load(response2.body)

        //     let level = $2("li.description__job-criteria-item:nth-child(1) span").text().trim()

        //     let type = $2("li.description__job-criteria-item:nth-child(2) span").text().trim()

        //     jobs_data[j].level = level;
        //     jobs_data[j].type = type;
        // }

        const csv = new ObjectsToCsv(jobs_data)
        csv.toDisk('./linkedInJobs.csv', { append: true })
        pageNum += 25;

    }
    catch (e) {
        console.log(e)
    }
}

getData()