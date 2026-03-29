import { useState, useEffect, useCallback } from "react";
import axios from "axios";

interface StatusResponse {
    status: string;
    transaction_status: "pending" | "successful" | "failed" | "error";
    message: string;
    provider_response?: any;
    data?: any;
    error?: any;
}

interface UseTransactionStatusOptions {
    transaction_ref: string;
    enabled?: boolean;
    pollingInterval?: number; // in milliseconds
    maxAttempts?: number;
    onSuccess?: (data: StatusResponse) => void;
    onFailed?: (data: StatusResponse) => void;
    onTimeout?: () => void;
}

export const useTransactionStatus = ({
    transaction_ref,
    enabled = false,
    pollingInterval = 5000, // Poll every 5 seconds
    maxAttempts = 60, // 60 attempts = 5 minutes at 5 second intervals
    onSuccess,
    onFailed,
    onTimeout,
}: UseTransactionStatusOptions) => {
    const [status, setStatus] = useState<StatusResponse | null>(null);
    const [isPolling, setIsPolling] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const checkStatus = useCallback(async () => {
        try {
            const response = await axios.post("/api/onepipe/transaction-status", {
                transaction_ref,
            });

            const data: StatusResponse = response.data;
            setStatus(data);

            return data;
        } catch (err: any) {
            console.error("Status check error:", err);
            setError(err.message);
            return null;
        }
    }, [transaction_ref]);

    const stopPolling = useCallback(() => {
        setIsPolling(false);
        setAttempts(0);
    }, []);

    const startPolling = useCallback(() => {
        setIsPolling(true);
        setAttempts(0);
        setError(null);
    }, []);

    useEffect(() => {
        if (!enabled || !isPolling || !transaction_ref) {
            return;
        }

        const poll = async () => {
            const result = await checkStatus();

            if (result) {
                if (result.transaction_status === "successful") {
                    stopPolling();
                    onSuccess?.(result);
                    return;
                }

                if (result.transaction_status === "failed") {
                    stopPolling();
                    onFailed?.(result);
                    return;
                }
            }

            setAttempts((prev) => {
                const newAttempts = prev + 1;
                if (newAttempts >= maxAttempts) {
                    stopPolling();
                    onTimeout?.();
                }
                return newAttempts;
            });
        };

        // Initial check
        poll();

        // Set up polling interval
        const interval = setInterval(poll, pollingInterval);

        return () => clearInterval(interval);
    }, [
        enabled,
        isPolling,
        transaction_ref,
        checkStatus,
        stopPolling,
        pollingInterval,
        maxAttempts,
        onSuccess,
        onFailed,
        onTimeout,
    ]);

    return {
        status,
        isPolling,
        attempts,
        maxAttempts,
        error,
        startPolling,
        stopPolling,
        checkStatus,
        remainingTime: Math.max(0, (maxAttempts - attempts) * (pollingInterval / 1000)),
    };
};
