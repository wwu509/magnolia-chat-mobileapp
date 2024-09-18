import {useEffect, useState} from "react";

type PerformanceReportProps = {
    screenName: string;
    isLoading: boolean;
}

type PerformanceReport = {
    loadTime: string;
}

export const useGetPerformanceReport = ({screenName, isLoading}: PerformanceReportProps): PerformanceReport => {
    const [startTime, setStartTime] = useState<number>(0);
    const [loadTime, setLoadTime] = useState<string>("");

    const getPerformanceReport = () => {
        const endTime = global.performance.now();
        const timeToRender = endTime - startTime;
        const logMessage = `${screenName} Load Time: ${timeToRender.toFixed(0)} milliseconds`;
        setLoadTime(logMessage);
    };

    useEffect(() => {
        setStartTime(global.performance.now());
        if (!isLoading) {
            getPerformanceReport();
        }
    }, [isLoading]);

    return {
        loadTime,
    };
};

//call this hook like this:
// import { useGetPerformanceReport } from "./performance";
//  useGetPerformanceReport({
//    screenName: "Feed",
//    isLoading: feedDataLoaded,
//  });
