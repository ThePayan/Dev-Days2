import auditRepository from '../repositories/audit.repository.js';
import IssueRepository from '../repositories/issue.repository.js';

export const getAllAudits = async () => {
 return await auditRepository.findAll();
};

export const getAuditById = async (id) => {
 return await auditRepository.findByAuditId(id);
};

export const auditIssues = async () => {
 const issues = await IssueRepository.findAll();    
 const issuesWithBugInTitle = issues.filter(issue => /bug/i.test(issue.title));
 const totalIssues = issues.length;
 const ratioWithBugInTitle = totalIssues === 0 ? 0 : issuesWithBugInTitle.length / totalIssues;

 const auditRecord = {
  auditId: `audit-${Date.now()}`,
  createdAt: new Date(),
  compliant: ratioWithBugInTitle <= 0.50,
  metadata: {
   totalIssues: totalIssues,
   issuesWithBugInTitle: issuesWithBugInTitle.length,
   ratioWithBugInTitle: ratioWithBugInTitle,
   operation: 'ratioWithBugInTitle <= 0.50'
  },
  evidences: issuesWithBugInTitle
 };

 const auditCreated = await auditRepository.create(auditRecord);
 return auditCreated;
};

const getCoordinates = async (city) => {
    const params = new URLSearchParams({
        name: city,
        count: '1',
        language: 'en',
        format: 'json'
    });
    const url = `https://geocoding-api.open-meteo.com/v1/search?${params.toString()}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (!data.results || data.results.length === 0) {
            throw new Error(`Coordinates not found for city: ${city}`);
        }
        
        return {
            latitude: data.results[0].latitude,
            longitude: data.results[0].longitude,
            name: data.results[0].name,
            country: data.results[0].country
        };
    } catch (error) {
        console.error('Error fetching coordinates:', error);
        throw error;
    }
};

export const auditWeather = async (city = 'Seville', temp = 18, days = 21) => {
    try {
        const { latitude, longitude, name, country } = await getCoordinates(city);

        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - days);

        const formatDate = (date) => date.toISOString().split('T')[0]; // YYYY-MM-DD

        const params = new URLSearchParams({
            latitude,
            longitude,
            start_date: formatDate(startDate),
            end_date: formatDate(endDate),
            daily: 'temperature_2m_mean',
            timezone: 'auto'
        });

        const weatherUrl = `https://archive-api.open-meteo.com/v1/archive?${params.toString()}`;

        const response = await fetch(weatherUrl);
        const data = await response.json();

        if (!data.daily || !data.daily.time || !data.daily.temperature_2m_mean) {
            throw new Error('Invalid data from OpenMeteo');
        }

        const dailyTemps = data.daily.time.map((time, index) => ({
            date: time,
            temp: data.daily.temperature_2m_mean[index]
        }));

        const weeks = [];
         for (let i = 0; i < dailyTemps.length; i += 7) {
            const weekChunk = dailyTemps.slice(i, i + 7);
            if (weekChunk.length === 7) {
                 weeks.push(weekChunk);
            }
        }

        const audits = [];

        for (const [index, weekData] of weeks.entries()) {
            const averageTemp = weekData.reduce((acc, curr) => acc + curr.temp, 0) / weekData.length;
            const umbral = averageTemp > temp;

            const auditRecord = {
                auditId: `audit-weather-${Date.now()}-week-${index + 1}`,
                createdAt: new Date(),
                compliant: umbral,
                metadata: {
                    city: `${name}, ${country}`,
                    requestedCity: city,
                    thresholdTemp: temp,
                    weekNumber: index + 1,
                    weekStartDate: weekData[0].date,
                    weekEndDate: weekData[6].date,
                    averageTemp: parseFloat(averageTemp.toFixed(2)),
                    operation: `averageTemp > ${temp}`
                },
                evidences: weekData
            };
            
            audits.push(await auditRepository.create(auditRecord));
        }

        return audits;

    } catch (error) {
        console.error('Error in weather audit:', error);
        throw error;
    }
};


export default {
 getAllAudits,
 getAuditById,
 auditIssues,
 auditWeather
};