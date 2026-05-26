/**
 * Centralized frontend configuration.
 * Uses relative /api paths — works on Vercel and local dev (vercel dev).
 */
const CONFIG = {
    COMPANY_NAME: "Acko Consultancy",
    EMAIL: "a.jinda@gmail.com",
    MOBILE: "+91 7017930241",

    /** Same-origin API (Vercel rewrites /api/* to Python serverless) */
    API_BASE_URL: "",

    API_SUBMIT_PATH: "/api/submit",
    API_GENERATE_REPORTS_PATH: "/api/reports/generate",

    QUOTES: [
        {
            text: "बीमा सिर्फ पॉलिसी नहीं — यह आपके परिवार की सुरक्षा की प्रतिज्ञा है।",
            author: "Insurance Wisdom",
        },
        {
            text: "The best time to buy insurance was yesterday. The second best time is now.",
            author: "Financial Planning",
        },
        {
            text: "एक अच्छा एडवाइजर ग्राहक की ज़रूरत समझता है, सिर्फ प्रोडक्ट नहीं बेचता।",
            author: "Acko Consultancy",
        },
        {
            text: "Your income may stop, but your responsibilities never do — protect what matters.",
            author: "Life Insurance",
        },
        {
            text: "सफलता उन्हीं की होती है जो दूसरों की सुरक्षा को अपना व्यवसाय बनाते हैं।",
            author: "Career Motivation",
        },
    ],

    QUOTE_INTERVAL_MS: 6000,
};

CONFIG.API_URL = `${CONFIG.API_BASE_URL}${CONFIG.API_SUBMIT_PATH}`;
CONFIG.API_GENERATE_REPORTS_URL = `${CONFIG.API_BASE_URL}${CONFIG.API_GENERATE_REPORTS_PATH}`;
