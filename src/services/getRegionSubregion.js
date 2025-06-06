const EU_COUNTRIES = new Set([
    'AT', 'BE', 'BG', 'CY', 'CZ', 'DE', 'DK', 'EE',
    'EL', 'ES', 'FI', 'FR', 'HR', 'HU', 'IE', 'IT',
    'LT', 'LU', 'LV', 'MT', 'NL', 'PL', 'PT', 'RO',
    'SE', 'SI', 'SK', 'GB'
]);

/**
 * Извлекает регион и субрегион из ответа Google Geocoding API
 * @param {Object} data - Ответ Google API (response.data)
 * @returns {Object} - { region, subregion }
 */
export const extractRegionData = (data) => {
    if (!data || !data.results) {
        throw new Error("Некорректные данные");
    }

    let countryCode = null;
    let stateCode = null;
    let city = null;
    let street = null;
    let houseNum = null;

    for (const result of data.results) {
        for (const component of result.address_components) {
            if (component.types.includes("country")) {
                countryCode = component.short_name;
            }
            if (component.types.includes("administrative_area_level_1")) {
                stateCode = component.short_name;
            }
            if (component.types.includes("locality")) {
                city = component.long_name;
            }
            if (component.types.includes("route")) {
                street = component.long_name;
            }
            if (component.types.includes("street_number")) {
                houseNum = component.short_name;
            }
        }
    }

    if (!countryCode) {
        throw new Error("Страна не найдена в данных");
    }

    const region = EU_COUNTRIES.has(countryCode) ? "EU" : countryCode;
    const subregion = EU_COUNTRIES.has(countryCode) ? countryCode : stateCode || countryCode;

    return { region, subregion, city, street, houseNum };
};
