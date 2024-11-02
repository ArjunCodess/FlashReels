import axios from 'axios';

const API_KEY = "g0f7ey4mw4wkwobkpumjk";
const API_URL = "https://getanalyzr.vercel.app/api/events";

export const sendAnalyticsEvent = async (name: string, description?: string) => {
    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
    };

    const eventData = {
        name,
        domain: window.location.hostname,
        description
    };

    try {
        const response = await axios.post(API_URL, eventData, { headers });
        console.log("Event sent successfully", response.data);
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error("Error: ", error.response?.data ?? error.message);
        } else {
            console.error("Error: ", error);
        }
    }
};