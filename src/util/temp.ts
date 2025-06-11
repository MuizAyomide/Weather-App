import React from "react";

type TempContextType = {
    degree: number;
    toCelsius?: boolean;
};

export const degreeConversion = (temp: number, toCelsius: boolean = true): number => {
    let convertedTemp: number;
    
    if (toCelsius) {
        // Convert Fahrenheit to Celsius
        convertedTemp = (temp - 32) * 5 / 9;
    } else {
        // Convert Celsius to Fahrenheit
        convertedTemp = (temp * 9 / 5) + 32;
    }
    
    // Round to 2 decimal places
    return parseFloat(convertedTemp.toFixed(2));
};